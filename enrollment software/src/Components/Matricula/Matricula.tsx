import {
  Button,
  Heading,
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
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Popover, PopoverTrigger, Portal } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Matricula as M } from "../../Interfaces/Matricula";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import AddCursoEstud from "./AddCursoEstud";
import Eliminar from "../Administrador/Eliminar";
import CiclosGrupos from "./CiclosGrupos";
import { Grupo } from "../../Interfaces/Grupo";
import { Ciclo } from "../../Interfaces/Ciclo";
const Matricula = () => {
  const [ciclo, setCiclo] = useState<number | null>(null);
  const [cicloNombreGrupo, setCicloNombreGrupo] = useState<string>("activo");
  const { id, carrera } = useParams();
  const toast = useToast();
  const [nombreCiclo, setNombreCiclo] = useState<string>("");
  const [gruposTotal, setGruposTotal] = useState<Grupo[]>([]);
  const [gruposTmp, setGruposTmp] = useState<Grupo[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/matricula`);
    return ws;
  }, []);
  const wsG = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/grupo`);
    return ws;
  }, []);
  const wsC = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/ciclo`);
    return ws;
  }, []);
  const [historial, setHistorial] = useState<M[]>([]);
  const [totalTmp, setTotalTmp] = useState<M[]>([]);
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
        setTotalTmp(
          data.view.filter((mat: M) => mat.alumno.toString() === id) as M[]
        );

        setHistorial(
          data.view.filter(
            (mat: M) => mat.alumno.toString() === id && mat.ciclo.activo === 1
          )
        );
        setNombreCiclo("Activo")
      }
      if (data.action === "CREATE" || data.action === "DELETE") {
        toast({
          title: "Success",
          description: `Course ${data.action.toLowerCase()}d correctly`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    wsM.onerror = (e) => {};
    wsM.onclose = () => {};
    return () => wsM.close();
  }, []);

  useEffect(() => {
    wsG.onopen = () => {
      wsG.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };

    wsG.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        setGruposTotal(data.view);
        const carreraGrupos = data.view.filter(
          (grupo: Grupo) =>
            grupo.curso.carrera === carrera && grupo.ciclo.activo === 1
        );
        setGruposTmp(carreraGrupos);
      }
    };
    wsG.onerror = (e) => {};
    wsG.onclose = () => {};
    return () => wsG.close();
  }, []);

  useEffect(() => {
    wsC.onopen = () => {
      wsC.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };

    wsC.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        setCiclos(data.view);
      }
    };
    wsC.onerror = (e) => {};
    wsC.onclose = () => {};
    return () => wsC.close();
  }, []);
  const addGrupo = (idGrupo: number) => {
    wsM.send(
      JSON.stringify({
        action: "CREATE",
        alumno: parseInt(id!),
        grupo: idGrupo,
        nota: -1,
      })
    );
  };

  const deleteGrupo = (idMatricula: string) => {
    wsM.send(
      JSON.stringify({
        action: "DELETE",
        id: parseInt(idMatricula),
      })
    );
  };

  useEffect(() => {
    if (!ciclo) {
      setNombreCiclo("activo");
    } else {
      const cicloN = historial.find((his) => his.ciclo.idCiclo === ciclo);
      if (cicloN) {
        setNombreCiclo(
          `${cicloN.ciclo.numero}-${cicloN.ciclo.fechaInicio}/${cicloN.ciclo.fechaFin}`
        );
      }
    }
  }, [ciclo]);
  const changeCiclo = (e: any) => {
    const active = parseInt(e.target.value.split(":")[1]);
    const idC = parseInt(e.target.value.split(":")[0]);
    setHistorial(
      totalTmp.filter(
        (mat: M) => mat.alumno.toString() === id && mat.ciclo?.idCiclo === idC
      ) as M[]
    );
    const ciclo = ciclos.find((ciclo) => ciclo.id === idC);
    const cicloActivo = ciclo?.activo === 1 ? "Activo " : "";
    const nombreCompleto = `${cicloActivo} ${ciclo?.numero}-${ciclo?.fechaInicio}/${ciclo?.fechaFin}`;
    setNombreCiclo(nombreCompleto);
    setCiclo(active === 1 ? null : parseInt(e.target.value.split(":")[0]));
  };

  const changeGrupoView = (e: any) => {
    const idC = parseInt(e.target.value.split(":")[0]);
    const ciclo = ciclos.find((ciclo) => ciclo.id === idC);
    const cicloActivo = ciclo?.activo === 1 ? "Activo " : "";
    const nombreCompleto = `${cicloActivo} ${ciclo?.numero}-${ciclo?.fechaInicio}/${ciclo?.fechaFin}`;
    setCicloNombreGrupo(nombreCompleto);
    const gruposFilter = gruposTotal.filter(
      (grupo) => grupo.ciclo.id === idC && grupo.curso.carrera === carrera
    );
    setGruposTmp(gruposFilter);
  };
  return (
    <div
      style={{
        display: "flex",
        height: "90vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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
          <Tabs variant="enclosed">
            <TabList>
              <Tab>Matricula</Tab>
              <Tab>Grupos</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <TableContainer>
                  <Table variant="striped" colorScheme="linkedin">
                    <TableCaption>Grupos del estudiante</TableCaption>
                    <TableCaption placement="top">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p>
                          <strong>
                            Mostrando los cursos en ciclo {nombreCiclo}
                          </strong>
                        </p>
                        <div style={{ flex: 3 }}>
                          <Popover closeOnBlur={false} placement="left" isLazy>
                            {({ isOpen, onClose }) => (
                              <>
                                <PopoverTrigger>
                                  <Button colorScheme="teal" variant="ghost">
                                    Click aca para ver otros ciclos
                                  </Button>
                                </PopoverTrigger>
                                <Portal>
                                  {isOpen && (
                                    <CiclosGrupos
                                      carrera={carrera}
                                      cb={changeCiclo}
                                      onClose={onClose}
                                    />
                                  )}
                                </Portal>
                              </>
                            )}
                          </Popover>
                        </div>
                      </div>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Curso</Th>
                        <Th>Grupo</Th>
                        <Th>Borrar</Th>
                        <Th>Ciclo</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {historial.map((his, index) => (
                        <Tr key={index}>
                          <Td>{his?.nombreCurso}</Td>
                          <Td>{his.id}</Td>
                          <Td>
                            {" "}
                            <Popover
                              closeOnBlur={false}
                              placement="left"
                              isLazy
                            >
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
                                        borrarAdmin={deleteGrupo}
                                        idAdmin={his.id.toString()}
                                        titulo="Admin"
                                        onClose={onClose}
                                      />
                                    )}
                                  </Portal>
                                </>
                              )}
                            </Popover>
                          </Td>
                          <Td>
                            {his.ciclo.activo === 1
                              ? `ACTIVO ${his.ciclo.numero}-${his.ciclo.fechaInicio}/${his.ciclo.fechaFin}`
                              : `${his.ciclo.numero}-${his.ciclo.fechaInicio}/${his.ciclo.fechaFin}`}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Curso</Th>
                        <Th>Grupo</Th>
                        <Th>Borrar</Th>
                        <Th>Ciclo</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </TabPanel>
              <TabPanel>
                <TableContainer>
                  <Table variant="striped" colorScheme="linkedin">
                    <TableCaption>Grupos totales</TableCaption>
                    <TableCaption placement="top">
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <p>
                          <strong>
                            Mostrando los grupos en ciclo {cicloNombreGrupo}
                          </strong>
                        </p>
                        <div style={{ flex: 3 }}>
                          <Popover closeOnBlur={false} placement="left" isLazy>
                            {({ isOpen, onClose }) => (
                              <>
                                <PopoverTrigger>
                                  <Button colorScheme="teal" variant="ghost">
                                    Click aca para ver otros ciclos
                                  </Button>
                                </PopoverTrigger>
                                <Portal>
                                  {isOpen && (
                                    <CiclosGrupos
                                      carrera={carrera}
                                      cb={changeGrupoView}
                                      onClose={onClose}
                                    />
                                  )}
                                </Portal>
                              </>
                            )}
                          </Popover>
                        </div>
                      </div>
                    </TableCaption>
                    <Thead>
                      <Tr>
                        <Th>Curso</Th>
                        <Th>Grupo</Th>
                        <Th>Agregar </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {gruposTmp.map((his, index) => (
                        <Tr key={index}>
                          <Td>{his?.curso.nombre}</Td>
                          <Td>{his.numeroGrupo}</Td>
                          <Td>
                            <IconButton
                              disabled={totalTmp
                                .filter((h) => h.alumno.toString() === id)
                                .some(
                                  (history) => history.grupo === his.numeroGrupo
                                )}
                              variant="outline"
                              onClick={() => addGrupo(his.numeroGrupo)}
                              colorScheme="teal"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<AddIcon />}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                    <Tfoot>
                      <Tr>
                        <Th>Curso</Th>
                        <Th>Grupo</Th>
                        <Th>Agregar</Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Matricula;
