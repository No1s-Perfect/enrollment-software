import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonGroup,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Popover, PopoverTrigger, Portal } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { errors } from "../../Constants/Error";
import { Carrera as CarreraI } from "../../Interfaces/Carrera";
import Eliminar from "../Administrador/Eliminar";
import PopAdd from "./PopAdd";
import PopAddCar from "./PopAddCar";
import PopUpdate from "./PopUpdate";
const Carrera = () => {
  const [carrera, setCarreras] = useState<CarreraI[]>([]);
  const navigate = useNavigate();
  const toast = useToast();
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/carrera`);
    return ws;
  }, []);

  useEffect(() => {
    wsM.onopen = () => {
      wsM.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };
    wsM.onmessage = (event) => {
      
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        
        setCarreras(data.view as CarreraI[]);
      }
      if (data.action === "ERROR") {
        const error = data.message.split(":")[0];
        if (error === errors.pkError || error === errors.fkError) {
          toast({
            title: "ERROR",
            description:
              error === errors.pkError
                ? "There is already a degree with this id"
                : "This degree has courses related to it",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "ERROR",
            description: "There was an error while fetching your request",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
      if (
        data.action === "UPDATE" ||
        data.action === "CREATE" ||
        data.action === "DELETE"
      ) {
        toast({
          title: "Sucess!",
          description: `Your data was ${data.action.toLowerCase()}d`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    return () => wsM.close();
  }, []);

  const updateCarrera = (id: string, nombre: string, titulo: string) =>
    wsM.send(
      JSON.stringify({
        action: "UPDATE",
        codigo: id,
        nombre: nombre,
        titulo: titulo,
      })
    );

  const createCarrera = (id: string, nombre: string, titulo: string) =>
    wsM.send(
      JSON.stringify({
        action: "CREATE",
        codigo: id,
        nombre: nombre,
        titulo: titulo,
      })
    );

  const deleteCarera = (id: string) =>
    wsM.send(
      JSON.stringify({
        action: "DELETE",
        id
      })
    );

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "90vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "60vw",
          borderWidth: "1px",
          borderRadius: "12px",
          padding: "0.75em",
        }}
      >
        <TableContainer>
          <Table variant="striped" colorScheme="linkedin">
            <TableCaption>
              {" "}
              <Popover closeOnBlur={false} placement="left" isLazy>
                {({ isOpen, onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button colorScheme="teal" variant="ghost">
                        Click aca para agregar una carrera
                      </Button>
                    </PopoverTrigger>
                    <Portal>
                      <PopAddCar close={onClose} create={createCarrera} />
                    </Portal>
                  </>
                )}
              </Popover>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Codigo</Th>
                <Th>Nombre</Th>
                <Th>Tiulo</Th>
                <Th>Cursos</Th>

                <Th>Editar</Th>
                <Th>Agregar Cursos</Th>
                <Th>Borrar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {carrera.map((car, index) => (
                <Tr key={index}>
                  <Td>{car.codigo}</Td>
                  <Td>{car.nombre}</Td>
                  <Td>{car.titulo}</Td>
                  <Td>
                    <IconButton
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Call Sage"
                      fontSize="20px"
                      onClick={() => navigate(`/curso-carrera/${car.codigo}`)}
                      icon={<ViewIcon />}
                    />
                  </Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left" isLazy>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              variant="outline"
                              colorScheme="teal"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<EditIcon />}
                            />
                          </PopoverTrigger>
                          <Portal>
                            <PopUpdate
                              close={onClose}
                              open={isOpen}
                              update={updateCarrera}
                              id={car.codigo}
                              nombre={car.nombre}
                              titulo={car.titulo}
                            />
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left" isLazy>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              variant="outline"
                              colorScheme="teal"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<AddIcon />}
                            />
                          </PopoverTrigger>
                          <Portal>
                            {isOpen && (
                              <PopAdd codigo={car.codigo} close={onClose} />
                            )}
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                  <Td>
                    {" "}
                    <Popover closeOnBlur={false} placement="left" isLazy>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              variant="outline"
                              colorScheme="red"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<DeleteIcon />}
                            />
                          </PopoverTrigger>
                          <Portal>
                            {isOpen && (
                              <Eliminar
                                onClose={onClose}
                                titulo="Admin"
                                borrarAdmin={deleteCarera}
                                idAdmin={car.codigo}
                              />
                            )}
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Codigo</Th>
                <Th>Nombre</Th>
                <Th>Titulo</Th>
                <Th>Cursos</Th>

                <Th>Editar</Th>
                <Th>Agregar</Th>
                <Th>Borrar</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Carrera;
