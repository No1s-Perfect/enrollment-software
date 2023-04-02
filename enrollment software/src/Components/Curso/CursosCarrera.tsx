import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  IconButton,
  Popover,
  PopoverTrigger,
  Portal,
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
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { errors } from "../../Constants/Error";
import { Curso } from "../../Interfaces/Curso";
import DeleteCarrera from "./DeleteCarrera";
import PopUpdateC from "./PopUpdateC";
const CursosCarrera = () => {
  const toast = useToast();
  const [openPop, setOpenPop] = useState<boolean>(false);
  const { id } = useParams();
  const [cursos, setCursos] = useState<Curso[]>([]);
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/curso`);
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
        
        setCursos(data.view.filter((cur: Curso) => cur.carrera === id));
      }
      if (data.action === "DELETE" || data.action === "UPDATE") {
        toast({
          title: "Sucess!",
          description: `Your data was ${data.action.toLowerCase()}d`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      if (data.action === "ERROR") {
        const error = data.message.split(":")[0];
        
        if (error === errors.fkError) {
          toast({
            title: "ERROR FK CONSTRAINT",
            description: "This course still has asigned groups to it",
            status: "error",
            isClosable: true,
          });
        } else {
          toast({
            title: "ERROR",
            description: "There was an error while fetching your request",
            status: "error",
            isClosable: true,
          });
        }
      }
    };

    return () => wsM.close();
  }, []);

  const deleteCourse = (id: string) => {
    wsM.send(
      JSON.stringify({
        action: "DELETE",
        id,
      })
    );
  };

  const updateCourse = (
    id: string,
    name: string,
    creditos: number,
    horas: number
  ) => {
    wsM.send(
      JSON.stringify({
        action: "UPDATE",
        id,
        name,
        creditos,
        horas,
      })
    );
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "70vh",
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
            <TableCaption>Cursos de la carrera</TableCaption>
            <Thead>
              <Tr>
                <Th>Nombre</Th>
                <Th>Creditos</Th>
                <Th>Horas</Th>
                <Th>Borrar</Th>
                <Th>Editar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cursos.map((cur, index) => (
                <Tr key={index}>
                  <Td>{cur.nombre}</Td>
                  <Td>{cur.creditos}</Td>
                  <Td>{cur.horas}</Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left">
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
                            <DeleteCarrera
                              id={cur.id}
                              deleteCourse={deleteCourse}
                              close={onClose}
                            />
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left">
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
                            {isOpen && (
                              <PopUpdateC
                                nombre={cur.nombre}
                                creditos={cur.creditos}
                                horas={cur.horas}
                                close={onClose}
                                open={isOpen}
                                update={updateCourse}
                                id={cur.id}
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
                <Th>Nombre</Th>
                <Th>Creditos</Th>
                <Th>Horas</Th>
                <Th>Borrar</Th>
                <Th>Editar</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default CursosCarrera;
