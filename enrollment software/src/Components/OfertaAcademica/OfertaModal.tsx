import { useEffect, useState, useRef, useMemo } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Select,
    Td,
    TableContainer,
    Tr,
    TableCaption,
    Thead,
    Table,
    Th,
    Tbody,
    GridItem,
    useDisclosure
  } from '@chakra-ui/react';
  import { useToast } from "@chakra-ui/react";
import { Ciclo } from "../../Interfaces/Ciclo";
import { Grupo2 as Grupo } from "../../Interfaces/Grupo";
import GrupoModal from "./GrupoModal";
import { Curso } from "../../Interfaces/Curso";
import { Profesor } from "../../Interfaces/Profesor";
import AgregarGrupoModal from "../Navbar/AgregarGrupoModal";

interface Props {
    isOpenO: boolean;
    onCloseO: () => void;
    carrera: string;
    ciclo: string;
    grupos: Grupo[];
    ciclos: Ciclo[];
    currentCurso: string;
}

const OfertaModal = ({
  isOpenO,
  onCloseO,
  carrera,
  ciclo,
  grupos,
  ciclos,
  currentCurso,
}: Props) => {
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [cursos, setCursos] = useState<Curso[]>([]);
    const [profesores, setProfesores] = useState<Profesor[]>([]);
    const [currentGrupo, setCurrentGrupo] = useState<any>(null);
    const [agregar, setAgregar] = useState<boolean>(false);

    const wsCu = useMemo(() => {
        const connection = { url: "localhost:8080/server" };
        const wsCu = new WebSocket(`ws://${connection.url}/curso`);
        return wsCu;
    }, []);

    const wsP = useMemo(() => {
        const connection = { url: "localhost:8080/server" };
        const wsP = new WebSocket(`ws://${connection.url}/profesor`);
        return wsP;
    }, []);

    const wsG = useMemo(() => {
        const connection = { url: "localhost:8080/server" };
        const wsG = new WebSocket(`ws://${connection.url}/grupo`);
        return wsG;
    }, []);
    useEffect(() => {
        wsCu.onopen = () => {
          wsCu.send(
            JSON.stringify({
              action: "VIEW_ALL",
            })
          );
        };
        wsCu.onmessage = (event) => {
          let data = JSON.parse(event.data);
          if (data.action === "VIEW_ALL") {
            const { view } = data;
            setCursos(view);
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
        return () => wsCu.close();
    }, []);
    
    useEffect(() => {
        wsP.onopen = () => {
          wsP.send(
            JSON.stringify({
              action: "VIEW_ALL",
            })
          );
        };
        wsP.onmessage = (event) => {
          let data = JSON.parse(event.data);
          if (data.action === "VIEW_ALL") {
            const { view } = data;
            setProfesores(view);
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
        return () => wsP.close();
    }, []);

    const cicloName = (ciclo:number) =>{
        return ciclo === 1 ? "Primer Ciclo" : "Segundo Ciclo"
    }

    const getNombreCurso = (curso: string) =>{
        const car = cursos.find((cur: Curso) => cur.id === curso);
        return car?.nombre;
    }

    const getNombreProfesor = (id: number) =>{
        const pro = profesores.find((p: Profesor) => p.id === id);
        return pro?.nombre;
    }

    const getGrupo = (id:number) =>{
        const gru = grupos.find((g: Grupo) => g.numeroGrupo === id);
        setCurrentGrupo(gru);
        onOpen();
    }
    const updateGrupo = ( grupo:Grupo) => {
        
        wsG.send(
          JSON.stringify({
            action: "UPDATE",
            id: grupo.numeroGrupo,
            ciclo: grupo.cicloSimple,
            curso: grupo.cursoSimple,
            horario: grupo.horario,
            profesor: grupo.profesor
          })
        );
        toast({
          title: "Grupo actualizado",
          description: "El grupo fue actualido con exito!",
          status: "success",
          duration: 4000,
          isClosable: true,
        });
        onClose();
    };
    const deleteGrupo = ( id:number) => {
        wsG.send(
          JSON.stringify({
            action: "DELETE",
            id
          })
        );
        toast({
          title: "Grupo eliminado",
          description: "El grupo fue eliminado con exito!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        onClose();
    };

    const crearGrupo = (grupo:Grupo) =>{
            wsG.send(
              JSON.stringify({
                action: "CREATE",
                ciclo: grupo.cicloSimple,
                curso: grupo.cursoSimple,
                horario: grupo.horario,
                profesor: grupo.profesor
            })
            );
          wsG.onmessage = (event) => {
              let data = JSON.parse(event.data);
              if (data.action === "CREATE") {
                toast({
                    title: "Curso Agregado!",
                    description: "El curso se agrego con exito!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        onClose();
        setAgregar(false);  
    }

    const openAgregar = () =>{
        setAgregar(true);
        onOpen();
    }
    const closeAgregar = () =>{
        setAgregar(false);
        onClose();
    }
    return (
        <>      
          <Modal isOpen={isOpenO} size={'full'} onClose={onCloseO}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Grupos de {getNombreCurso(currentCurso)}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <GridItem colSpan={4} bg='blue.900'>
              <TableContainer>
            <Table>
              <TableCaption>Grupos agregados al sistema</TableCaption>
              <Thead>
                <Tr>
                  <Th>Numero de grupo</Th>
                  <Th>Ciclo</Th>
                  <Th>Curso</Th>
                  <Th>Horario</Th>
                  <Th>Profesor</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {grupos.length > 0 ? (
                  grupos.map((el) => (
                    <Tr key={el.numeroGrupo}>
                      <Td>{el.numeroGrupo}</Td>
                      <Td>{cicloName(el.cicloSimple)}</Td>
                      <Td>{ getNombreCurso(el.cursoSimple)}</Td>
                      <Td>{el.horario}-{parseInt(el.horario.split(":")[0]) + 2}:{el.horario.split(":")[1]}</Td>
                      <Td>{getNombreProfesor(el.profesor)}</Td>
                      <Td>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={()=>getGrupo(el.numeroGrupo)}
                          >
                            Ver Grupo
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
              </ModalBody>
                    <ModalFooter>
                        <Button 
                            textAlign="center"
                            colorScheme="green"
                            size="md"
                            className="p5"
                            onClick={()=>openAgregar()}
                        >
                            Agregar Grupo
                        </Button>
                    </ModalFooter>
    
            </ModalContent>
          </Modal>
          {
            isOpen 
            && 
            agregar 
            &&
            <AgregarGrupoModal
            isOpen={isOpen}
            onClose={closeAgregar}
            ciclo={ciclo}
            profesores={profesores}
            crearGrupo={crearGrupo}
            curso={currentCurso}
            />
            } 
          {
        isOpen
        && 
        !agregar 
        &&
        <GrupoModal
          isOpen={isOpen}
          onClose={onClose}
          grupo={currentGrupo}
          ciclos={ciclos}
          cursos={cursos}
          profesores={profesores}
          updateGrupo={updateGrupo}
          deleteGrupo={deleteGrupo}
        />
      }
      
        </>
      )
};

export default OfertaModal;