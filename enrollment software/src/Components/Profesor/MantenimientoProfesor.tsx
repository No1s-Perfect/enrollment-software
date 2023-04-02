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
  Stack,
  Input,
  Select
} from '@chakra-ui/react'

import { useToast } from "@chakra-ui/react";


import CursosModal from './ProfesorModal';
import { Profesor } from '../../Interfaces/Profesor';
import { errors } from '../../Constants/Error';


const MantenimientoCursos = () => {

  const [profesores, setprofesores] = useState<Profesor[]>([]);
  const [currentProfesor, setCurrentProfesor] = useState<any>(null);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [search, setSearch] = useState<any>(null);
  const toast = useToast();
  const ws = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/profesor`);
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
        setprofesores(view);
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

  const update = ( profesor:Profesor) => {
    ws.send(
      JSON.stringify({
        action: "UPDATE",
        id: profesor.id,
        name: profesor.nombre,
        telefono: profesor.telefono,
        email: profesor.email,
        clave: profesor.clave
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

  const deleteProfesor = ( id:number) => {
    ws.send(
      JSON.stringify({
        action: "DELETE",
        id
      })
    );
    ws.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setprofesores(view);
      }
      if (data.action === "ERROR") {
        if(data.message.split(":")[0] === errors.fkError){
          toast({
            title: 'No se pudo eliminar el profesor ',
            description: 'El profesor tiene cursos asociados',
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        }
      }else{
        toast({
          title: "Profesor eliminado",
          description: "El profesor fue eliminado con exito!",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    }
    onClose();
  };

  const getProfesor = (id:number) => {
    
    const pro = profesores.find((p: Profesor) => p.id === id);
    setCurrentProfesor(pro);
    onOpen();
  };

  const profesorFiltro = () =>{
    if(searchParameter === ""){
      toast({
        title: "Por favor ingrese el parametro de busqueda",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }else if(!search){
      toast({
        title: "Por favor ingrese el valor a buscar",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    else{
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
            const busqueda = view.filter((p:Profesor) => p.nombre.includes(search));
            setprofesores(busqueda);
          }else{
            const busqueda = view.filter((p:Profesor) => p.id.toString().includes(search));
            setprofesores(busqueda);
          }
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
      }
    }
    
  }

  const restaurar = () =>{
    debugger;
    ws.send(
      JSON.stringify({
        action: "VIEW_ALL",
      })
    );
    ws.onmessage = (event) => {
      
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        const { view } = data;
        setprofesores(view);
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
    }
  }
  return (
    <div>
      <Grid h='200px'
            templateRows='repeat(2, 1fr)'
            gap={4}
      >
        <GridItem colSpan={4} bg='blue.900'>
          <Stack w='550px' spacing={3} direction='row' align='center'>
              <Input
                name="año"
                type="year"
                placeholder="Valor a buscar"
                value={search || ""}
                onChange={e => setSearch(e.target.value)}
                required
                w='400px'
              />
            <Select 
                name="numero"
                onChange={e => setSearchParameter(e.target.value)}
                value={searchParameter || ""}
                w='700px'
              >
                <option value={""}>Buscar por...</option>
                <option value={"nombre"}>Nombre</option>
                <option value={"cedula"}>Cedula</option>
            </Select>
            <Button 
                textAlign="center"
                colorScheme="teal"
                size="md"
                onClick={()=>profesorFiltro()}
                w='180px'
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
              <TableCaption>Profesores agregados al sistema</TableCaption>
              <Thead>
                <Tr>
                  <Th>Identificación</Th>
                  <Th>Nombre</Th>
                  <Th>Telefono</Th>
                  <Th>Email</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {profesores.length > 0 ? (
                  profesores.map((el) => (
                    <Tr key={el.id}>
                      <Td>{el.id}</Td>
                      <Td>{el.nombre}</Td>
                      <Td>{el.telefono}</Td>
                      <Td>{el.email}</Td>
                      <Td>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={()=>getProfesor(el.id)}
                          >
                            Ver profesor
                          </Button>
                      </Td>
                    </Tr>   
                  ))
                ) : (
                  <Tr >
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
          profesor={currentProfesor}
          update={update}
          deleteProfesor={deleteProfesor}
        />
      }
    </div>
  )
}

export default MantenimientoCursos
