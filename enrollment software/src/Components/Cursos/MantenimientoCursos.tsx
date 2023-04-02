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
  Select
} from '@chakra-ui/react'

import { useToast } from "@chakra-ui/react";

import { Carrera } from '../../Interfaces/Carrera';
import { Curso } from '../../Interfaces/Curso';
import CursosModal from './CursosModal';

const initialFrom = {
  id:"",
  nombre:"",
  creditos:0,
  horas:0,
  carrera:"",
}
const MantenimientoCursos = () => {
  const [carrera, setCarrera] = useState<Carrera[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [search, setSearch] = useState<any>(null);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [currentCurso, setCurrentCurso] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const ws = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/curso`);
    return ws;
  }, []);
  const wsC = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const wsC = new WebSocket(`ws://${connection.url}/carrera`);
    return wsC;
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
        setCarrera(view);
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
    return () => ws.close();
  }, []);

  const getNombreCarrera = (codigo: string) =>{
    const car = carrera.find((car: Carrera) => car.codigo === codigo);
    return car?.nombre+"-"+car?.titulo;
  }
  const update = ( curso:Curso) => {
    ws.send(
      JSON.stringify({
        action: "UPDATE",
        id: curso.id,
        name: curso.nombre,
        creditos: curso.creditos,
        horas: curso.horas,
        carrera: curso.carrera
      })
    );
    toast({
      title: "Curso actualizado",
      description: "El curso fue actualido con exito!",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
    onClose();
  };

  const deleteCurso = ( id:String) => {
    ws.send(
      JSON.stringify({
        action: "DELETE",
        id
      })
    );
    toast({
      title: "Curso eliminado",
      description: "El curso fue eliminado con exito!",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const getCurso = (id:String) => {
    const cur = cursos.find((cur: Curso) => cur.id === id);
    setCurrentCurso(cur);
    onOpen();
  };
  const cursosFiltro = () =>{
    if(!search){
      toast({
        title: "Por favor ingrese el valor de busqueda",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }else if(searchParameter === ""){
      toast({
        title: "Por favor ingrese el parametro de busqueda",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }else{
      ws.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
      ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.action === "VIEW_ALL") {
          const { view } = data;
          if(searchParameter === "nombre"){
            const busqueda = view.filter((c:Curso) => c.nombre.includes(search));
            setCursos(busqueda);
          }else if(searchParameter === "codigo"){
            const busqueda = view.filter((c:Curso) => c.id.includes(search));
            setCursos(busqueda);
          }else{
            const busqueda = view.filter((c:Curso) => c.carrera.includes(search));
            setCursos(busqueda);
          }
        }
        if (data.action === "ERROR") {
          toast({
            title: "Error al realizar la busqueda",
            description: "Ocurrio un error al realizar la busqueda",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        }
      }
    }
    setSearch("");
  }

  const restaurar = () =>{
    ws.send(
      JSON.stringify({
        action: "VIEW_ALL",
      })
    );
    ws.onmessage = (event) => {
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
          duration: 5000,
          isClosable: true,
        });
      }
    }
  }

  return (
    <div>
      <Grid h='200px'
            templateRows='repeat(2, 1fr)'
            gap={4}
      >
        <GridItem colSpan={4} bg='blue.900'>
          <Stack w='500px' spacing={2} direction='row' align='center'>
              {searchParameter !== "carrera" 
              ?
              <Input
                name="año"
                type="year"
                placeholder="Valor a buscar"
                value={search || ""}
                onChange={e => setSearch(e.target.value)}
                required
              />
              :
              <Select 
                        name="carrera"
                        onChange={e => setSearch(e.target.value)}
                        value={search || ""}
                        required
                    >
                        <option value="" hidden>Seleccionar...</option>
                        {carrera !== null &&
                        carrera.map((el) =>
                            <option
                            key={el.codigo}
                            value={el.codigo}
                            >
                            {el.nombre} - {el.titulo}
                            </option>
                        )

                        }
                    </Select>
              }
            <Select 
                name="numero"
                onChange={e => setSearchParameter(e.target.value)}
                value={searchParameter || ""}
              >
                <option value={""}>Buscar por...</option>
                <option value={"nombre"}>Nombre</option>
                <option value={"codigo"}>Codigo</option>
                <option value={"carrera"}>Carrera</option>
            </Select>
            <Button 
                textAlign="center"
                colorScheme="teal"
                size="md"
                onClick={()=>cursosFiltro()}
                w='200px'
            >
              Buscar
            </Button>
            <Button 
                textAlign="center"
                colorScheme="teal"
                size="md"
                onClick={()=>restaurar()}
                w='250px'
            >
              Restaurar
            </Button>
  
          </Stack>
        </GridItem>
        <GridItem colSpan={4} bg='blue.800'>
          <TableContainer>
            <Table>
              <TableCaption>Cursos agregados al sistema</TableCaption>
              <Thead>
                <Tr>
                  <Th>Codigo</Th>
                  <Th>Nombre</Th>
                  <Th>Créditos</Th>
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
                            onClick={()=>getCurso(el.id)}
                          >
                            Ver curso
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
      {
        isOpen &&
        <CursosModal
          isOpen={isOpen}
          onClose={onClose}
          curso={currentCurso}
          carrera={carrera}
          update={update}
          deleteCurso={deleteCurso}
        />
      }
    </div>
  )
}

export default MantenimientoCursos
