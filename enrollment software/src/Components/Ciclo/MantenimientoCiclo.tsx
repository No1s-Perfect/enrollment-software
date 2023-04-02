import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Button,
  Grid,
  GridItem,
  useDisclosure,
  Input,
  Stack,
} from "@chakra-ui/react";

import { useToast } from "@chakra-ui/react";

import CursosModal from "./CicloModal";
import { Ciclo } from "../../Interfaces/Ciclo";
import { errors } from "../../Constants/Error";

const MantenimientoCiclo = () => {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [currentCiclo, setCurrentCiclo] = useState<any>(null);
  const [search, setSearch] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const ws = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/ciclo`);
    return ws;
  }, []);

  useEffect(() => {
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setCiclos(view);
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
    return () => ws.close();
  }, []);

  const update = (ciclo: Ciclo) => {
    validarCicloActivo(ciclo);
    ws.send(
      JSON.stringify({
        action: "UPDATE",
        id: ciclo.id,
        numero: ciclo.numero,
        fechaInicio: ciclo.fechaInicio,
        fechaFin: ciclo.fechaFin,
        activo: ciclo.activo,
      })
    );
    toast({
      title: "Profesor actualizado",
      description: "El profesor fue actualido con exito!",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const validarCicloActivo = (ciclo: any) => {
    const cicloActivo = ciclos.find((c) => c.activo === 1);
    
    if (cicloActivo && ciclo.activo == 1) {
      ws.send(
        JSON.stringify({
          action: "UPDATE",
          id: cicloActivo.id,
          numero: cicloActivo.numero,
          fechaInicio: cicloActivo.fechaInicio,
          fechaFin: cicloActivo.fechaFin,
          activo: 2,
        })
      );
    }
  };
  const deleteCiclo = (id: number) => {
    ws.send(
      JSON.stringify({
        action: "DELETE",
        id,
      })
    );
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setCiclos(view);
      }
      if (data.action === "ERROR") {
        if (data.message.split(":")[0] === errors.fkError) {
          toast({
            title: "No se pudo eliminar el ciclo ",
            description: "El ciclo tiene cursos asociados",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "Ciclo eliminado",
          description: "El ciclo fue eliminado con exito!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    };
    onClose();
  };

  const getCiclo = (id: number) => {
    const cic = ciclos.find((c: Ciclo) => c.id === id);
    setCurrentCiclo(cic);
    onOpen();
  };

  const cicloName = (ciclo: number) => {
    return ciclo === 1 ? "Primer Ciclo" : "Segundo Ciclo";
  };
  const cicloActivo = (ciclo: number) => {
    return ciclo === 1 ? "Activo" : "Inactivo";
  };

  const cicloFiltro = () => {
    ws.send(
      JSON.stringify({
        action: "VIEW_ALL",
      })
    );
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        const busqueda = view.filter(
          (c: Ciclo) => c.fechaInicio.split("-")[0] === search
        );
        setCiclos(busqueda);
      }
      if (data.action === "ERROR") {
        toast({
          title: "Error al realizar la busqueda",
          description: "Ocurrio un error al realizar la busqueda",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      }
    };
  };

  const restaurar = () => {
    ws.send(
      JSON.stringify({
        action: "VIEW_ALL",
      })
    );
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setCiclos(view);
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
  };

  return (
    <div>
      <Grid h="200px" templateRows="repeat(2, 1fr)" gap={2}>
        <GridItem colSpan={4} bg="blue.900">
          <Stack w="400px" spacing={4} direction="row" align="center">
            <Input
              name="año"
              type="year"
              placeholder="Ingrese el año a buscar"
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              required
            />
            <Button
              textAlign="center"
              colorScheme="teal"
              size="md"
              onClick={() => cicloFiltro()}
            >
              Buscar
            </Button>
            <Button
              textAlign="center"
              colorScheme="teal"
              size="md"
              onClick={() => restaurar()}
            >
              Restaurar
            </Button>
          </Stack>
        </GridItem>
        <GridItem colSpan={4} bg="blue.800">
          <TableContainer>
            <Table>
              <TableCaption>Ciclo agregados al sistema</TableCaption>
              <Thead>
                <Tr>
                  <Th>Identificación</Th>
                  <Th>Numero</Th>
                  <Th>Fecha Inicio</Th>
                  <Th>Fecha Fin</Th>
                  <Th>Estado del ciclo</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {ciclos.length > 0 ? (
                  ciclos.map((el) => (
                    <Tr key={el.id}>
                      <Td>{el.id}</Td>
                      <Td>{cicloName(el.numero)}</Td>
                      <Td>{el.fechaInicio}</Td>
                      <Td>{el.fechaFin}</Td>
                      <Td>{cicloActivo(el.activo)}</Td>
                      <Td>
                        <Button
                          textAlign="center"
                          colorScheme="teal"
                          size="md"
                          onClick={() => getCiclo(el.id)}
                        >
                          Ver ciclo
                        </Button>
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td className="text-center">Sin datos</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
      {isOpen && (
        <CursosModal
          isOpen={isOpen}
          onClose={onClose}
          ciclo={currentCiclo}
          update={update}
          deleteCiclo={deleteCiclo}
        />
      )}
    </div>
  );
};

export default MantenimientoCiclo;
