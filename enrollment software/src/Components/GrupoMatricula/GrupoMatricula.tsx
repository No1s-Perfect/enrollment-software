import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { GrupoMatricula as GArray } from "../../Interfaces/GrupoMatricula";
import {  EditIcon, } from "@chakra-ui/icons";
import {
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
import PopUpdateMat from "./PopUpdateMat";
const GrupoMatricula = () => {
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/matricula`);
    return ws;
  }, []);

  const { id } = useParams();
  const [estudiantes, setEstudiantes] = useState<GArray[]>([]);
  const toast = useToast();
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
        setEstudiantes(
          data.view.filter(
            (mat: GArray) => mat.grupo.toString() === id
          ) as GArray[]
        );
      }
      if (data.action === "ERROR") {
        toast({
          title: "ERROR",
          description: "There was an error while fetching your request",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
      if (data.action === "UPDATE") {
        toast({
          title: "Sucess!",
          description: "Your student score was updated",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
       
      }
    };

    return () => wsM.close();
  }, []);

  const updateNota = (alumno: number, nota: number, idMat: number) =>
    wsM.send(
      JSON.stringify({
        action: "UPDATE",
        id: idMat,
        alumno: alumno,
        grupo: id,
        nota: nota,
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
            <TableCaption>Los estudiantes matriculados</TableCaption>
            <Thead>
              <Tr>
                <Th>Cedula</Th>
                <Th>Nota</Th>
                <Th>Editar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {estudiantes.map((car, index) => (
                <Tr key={index}>
                  <Td>{car.alumno}</Td>
                  <Td>{car.nota}</Td>
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
                            <PopUpdateMat
                              id={car.alumno}
                              nota={car.nota}
                              idMat={car.id}
                              cb={updateNota}
                              close={onClose}
                            />
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
                <Th>Cedula</Th>
                <Th>Nota</Th>
                <Th>Editar</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default GrupoMatricula;
