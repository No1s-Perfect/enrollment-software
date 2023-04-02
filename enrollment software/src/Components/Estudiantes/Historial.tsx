import {
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
import { useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { Matricula } from "../../Interfaces/Matricula";
const Historial = () => {
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/matricula`);
    return ws;
  }, []);
  const [historial, setHistorial] = useState<Matricula[]>([]);

  const { id } = useParams();
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
        
        const array = data.view.filter(
          (mat: Matricula) => mat.alumno.toString() === id
        ) as Matricula[];
        array.sort((a, b) =>
          a.ciclo.fechaInicio.localeCompare(b.ciclo.fechaInicio)
        );
        setHistorial(array);
      }
    };

    return () => wsM.close();
  }, []);
  return (
    <div>
      <div
        style={{
          display: "flex",
          width: "100vw",
          height: "10vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Historial academico de {id}</h1>
      </div>
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
              <TableCaption>Historial academico</TableCaption>
              <Thead>
                <Tr>
                  <Th>Curso</Th>
                  <Th>Ciclo</Th>
                  <Th>Fecha inicio</Th>
                  <Th>Fecha finalizacion</Th>
                  <Th isNumeric>Nota</Th>
                </Tr>
              </Thead>
              <Tbody>
                {historial.map((his, index) => (
                  <Tr key={index}>
                    <Td>{his?.nombreCurso}</Td>
                    <Td>{his.ciclo.numero}</Td>
                    <Td>{his.ciclo.fechaInicio}</Td>
                    <Td>{his.ciclo.fechaFin}</Td>
                    <Td isNumeric>{his.nota}</Td>
                  </Tr>
                ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th>Curso</Th>

                  <Th>Ciclo</Th>
                  <Th>Fecha inicio</Th>
                  <Th>Fecha finalizacion</Th>
                  <Th isNumeric>Nota</Th>
                </Tr>
              </Tfoot>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Historial;
