import { useToast } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { Grupo } from "../../Interfaces/Grupo";
import { useLoginContext } from "../Login/LoginContext";
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
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { Ciclo } from "../Ciclo/Ciclo";
const GrupoProfesor = () => {
  const { user } = useLoginContext();
  const toast = useToast();
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const navigate = useNavigate();
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };

    const ws = new WebSocket(`ws://${connection.url}/grupo`);
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
        setGrupos(
          data.view.filter(
            (grupo: Grupo) =>
              grupo.profesor === user?.id && grupo.ciclo.activo === 1
          )
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
    };

    return () => wsM.close();
  }, []);

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
            <TableCaption>Sus grupos</TableCaption>
            <Thead>
              <Tr>
                <Th>Curso</Th>
                <Th>Horario</Th>
                <Th>Ver estudiantes</Th>
              </Tr>
            </Thead>
            <Tbody>
              {grupos.map((car, index) => (
                <Tr key={index}>
                  <Td>{car.curso.nombre}</Td>
                  <Td>{car.horario}</Td>
                  <Td>
                    <IconButton
                      variant="outline"
                      colorScheme="teal"
                      aria-label="Call Sage"
                      fontSize="20px"
                      onClick={() => navigate(`/grupo/${car.numeroGrupo}`)}
                      icon={<ViewIcon />}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Curso</Th>
                <Th>Horario</Th>
                <Th>Ver estudiantes</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default GrupoProfesor;
