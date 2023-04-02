import React, {useEffect, useState, useMemo} from 'react'
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
  Heading,
  FormLabel,
  Select
} from '@chakra-ui/react'

import { useToast } from "@chakra-ui/react";

import { Ciclo } from '../../Interfaces/Ciclo';
import { Carrera } from '../../Interfaces/Carrera';
import { Curso } from '../../Interfaces/Curso';
import { Grupo2 as Grupo } from '../../Interfaces/Grupo';
import OfertaModal from './OfertaModal';


const OfertaAcademica = () => {
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [currentCarrera, setCurrentCarrera] = useState<any>(null);
  const [currentCiclo, setCurrentCiclo] = useState<any>(null);
  const [currentCurso, setCurrentCurso] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mensaje, setMensaje] = useState<string>("Realizar una busqueda");
  
  const toast = useToast();
  const wsC = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const wsC = new WebSocket(`ws://${connection.url}/ciclo`);
    return wsC;
  }, []);
  
  const wsCa = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const wsCa = new WebSocket(`ws://${connection.url}/carrera`);
    return wsCa;
  }, []);

  const wsCu = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const wsCu = new WebSocket(`ws://${connection.url}/curso`);
    return wsCu;
  }, []);

  const wsG = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const wsG = new WebSocket(`ws://${connection.url}/grupo`);
    return wsG;
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
    return () => wsC.close();
  }, []);

  useEffect(() => {
    wsCa.onopen = () => {
      wsCa.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };
    wsCa.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setCarreras(view);
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
    return () => wsCa.close();
  }, []);
  const cicloName = (ciclo:number) =>{
    return ciclo === 1 ? "Primer Ciclo" : "Segundo Ciclo"
  }
  
  const buscarCursos = () =>{
    if(!currentCarrera){
        toast({
            title: "Seleccione una carrera",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
    }else if(!currentCiclo){
        toast({
            title: "Seleccione un ciclo",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
    }
    else{
        wsCu.send(
            JSON.stringify({
                action: "VIEW_ALL",
            })
        );
        wsCu.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (data.action === "VIEW_ALL") {
              const { view } = data;
              const cur = view.filter((c:Curso)=>c.carrera === currentCarrera);
              
              setCursos(cur);
              if(cur.length === 0){
                setMensaje("Esta carrera no tiene cursos. Por favor agregar!");
              }
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
    }
  }

  const getNombreCarrera = (codigo: string) =>{
    const car = carreras.find((car: Carrera) => car.codigo === codigo);
    return car?.nombre+"-"+car?.titulo;
  }

  const getGruposByCurso = (codigo: string) =>{
    setCurrentCurso(codigo);
    wsG.send(
        JSON.stringify({
            action: "VIEW_ALL",
        })
    );
    wsG.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.action === "VIEW_ALL") {
          const { view } = data;
          const gru = view.filter((g:Grupo)=>g.cursoSimple === codigo && g.cicloSimple === parseInt(currentCiclo));
          setGrupos(gru);
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
    onOpen();
  }


  return (
    <div>
        <Heading textAlign="center">Oferta Academica</Heading>
      <Grid h='200px'
            templateRows='repeat(2, 1fr)'
            gap={2}
      >
        <GridItem colSpan={4} bg='blue.900'>
          <Stack w='800px' spacing={4} direction='row' align='center'>
            <FormLabel htmlFor="nombre">Carrera</FormLabel>
                <Select 
                    name="carrera"
                    onChange={e => setCurrentCarrera(e.target.value)}
                    value={currentCarrera || ""}
                    required
                >
                    <option value="" hidden>Seleccionar...</option>
                    {carreras !== null &&
                    carreras.map((el) =>
                        <option
                        key={el.codigo}
                        value={el.codigo}
                        >
                        {el.nombre} - {el.titulo}
                        </option>
                    )

                    }
                </Select>
                <FormLabel htmlFor="nombre">Ciclo</FormLabel>
                <Select 
                    name="carrera"
                    onChange={e => setCurrentCiclo(e.target.value)}
                    value={currentCiclo || ""}
                    required
                >
                    <option value="" hidden>Seleccionar...</option>
                    {ciclos !== null &&
                    ciclos.map((el) =>
                        <option
                        key={el.id}
                        value={el.id}
                        >
                        {cicloName(el.id)} - {el.fechaInicio.split("-")[0]}
                        </option>
                    )

                    }
                </Select>
                <Button 
                textAlign="center"
                colorScheme="teal"
                size="md"
                onClick={()=>buscarCursos()}
                w='200px'
                >
                    Buscar
                </Button>     
          </Stack>
        </GridItem>
        <GridItem colSpan={4} bg='blue.800'>
          <TableContainer>
            <Table>
              <TableCaption>Oferta Academica</TableCaption>
              <Thead>
                <Tr>
                  <Th>Codigo</Th>
                  <Th>Nombre</Th>
                  <Th>Creditos</Th>
                  <Th>Horas</Th>
                  <Th>Carrera</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {cursos.length > 0 ? (
                  cursos.map((el) => (
                    <Tr key={el.id}>
                      <Td>{el.id}</Td>
                      <Td>{el.nombre}</Td>
                      <Td>{el.creditos}</Td>
                      <Td>{el.horas}</Td>
                      <Td>{getNombreCarrera(el.carrera)}</Td>
                      <Td>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={()=>getGruposByCurso(el.id)}
                          >
                            Ver grupos
                          </Button>
                      </Td>
                    </Tr>   
                  ))
                ) : (
                  <Tr>
                  <Td className="text-center">{mensaje}</Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </GridItem>
      </Grid>
      {
        isOpen &&
        <OfertaModal
          isOpenO={isOpen}
          onCloseO={onClose}
          carrera={currentCarrera}
          ciclo={currentCiclo}
          ciclos={ciclos}
          grupos={grupos}
          currentCurso={currentCurso}
        />
      }
    </div>
  )
}

export default OfertaAcademica;