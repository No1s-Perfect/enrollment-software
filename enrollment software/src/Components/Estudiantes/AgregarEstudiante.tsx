import { useRef, useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { Carrera as CarreraI } from "../../Interfaces/Carrera";
import { errors } from "../../Constants/Error";
const AgregarEstudiante = () => {
  const id = useRef<HTMLInputElement>(null);
  const nombre = useRef<HTMLInputElement>(null);
  const telefono = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);
  const fechaNacimiento = useRef<HTMLInputElement>(null);
  const carreraCodigo = useRef<HTMLSelectElement>(null);
  const clave = useRef<HTMLInputElement>(null);
  const [show, setShow] = useState<boolean>(false);
  const toast = useToast();
  const [carrera, setCarreras] = useState<CarreraI[]>([]);
  const wsE = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/alumno`);
    return ws;
  }, []);
  const wsC = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/carrera`);
    return ws;
  }, []);

  useEffect(() => {
    wsC.onopen = () => {
      wsC.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };
    wsE.onopen = () => {
      
    };
    wsC.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        
        setCarreras(data.view as CarreraI[]);
      }
    };
    wsE.onmessage = (event) => {
      let data = JSON.parse(event.data);
      
      if (data.action === "CREATE") {
        toast({
          title: "Sucess!",
          description: "Student created",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
      if (data.action === "ERROR") {
        const error = data.message.split(":")[0];
        
        if (error === errors.pkError) {
          toast({
            title: "ERROR",
            description: "There is already an student with this id",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "ERROR",
            description: "There was an error while fetching your request",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
    };

    return () => {
      wsE.close();
      wsC.close();
    };
  }, []);
  const onSubmit = (e: any) => {
    
    e.preventDefault();
    if (
      carreraCodigo?.current?.value &&
      id?.current?.value &&
      nombre?.current?.value &&
      telefono?.current?.value &&
      email?.current?.value &&
      fechaNacimiento?.current?.value &&
      clave?.current?.value
    ) {
      
      wsE.send(
        JSON.stringify({
          action: "CREATE",
          id: parseInt(id.current.value),
          nombre: nombre?.current?.value,
          telefono: telefono.current.value,
          email: email.current.value,
          fechaNacimiento: fechaNacimiento?.current?.value,
          carrera: carreraCodigo.current.value,
          clave: clave.current.value,
        })
      );
      id.current.value = "";
      nombre.current.value = "";
      telefono.current.value = "";
      email.current.value = "";
      fechaNacimiento.current.value = "";
      clave.current.value = "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "80vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form
        onSubmit={onSubmit}
        style={{
          width: "30vw",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <SimpleGrid columns={[2, null, 3]} spacing="40px">
          <FormControl isRequired>
            <FormLabel htmlFor="cedula">Cedula</FormLabel>
            <Input id="cedula" type="number" ref={id} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="nombre">Nombre</FormLabel>
            <Input id="nombre" type="text" ref={nombre} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="tel">Telefono</FormLabel>
            <Input id="tel" type="text" ref={telefono} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input id="email" type="email" ref={email} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="fecha">F.Nacimiento</FormLabel>
            <Input id="fecha" type="date" ref={fechaNacimiento} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="Carrera">Carrera</FormLabel>
            <Select placeholder="Carreras disponibles" ref={carreraCodigo}>
              {carrera.map((cur, index) => (
                <option key={index} value={cur.codigo}>
                  {`${cur.codigo}-${cur.nombre}`}
                </option>
              ))}
            </Select>
          </FormControl>
          <Box width="30vw" height="80px">
            <FormControl isRequired>
              <FormLabel htmlFor="clave">Clave</FormLabel>
              <InputGroup size="md">
                <Input
                  pr="4.5rem"
                  type={show ? "text" : "password"}
                  placeholder="Enter password"
                  ref={clave}
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          </Box>
        </SimpleGrid>
        <ButtonGroup size="sm" d="flex" justifyContent="center">
          <Button type="submit" colorScheme="teal">
            Registrar alumno
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
};

export default AgregarEstudiante;
