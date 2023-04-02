import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { Alumno } from "../../Interfaces/Alumno";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { errors } from "../../Constants/Error";
import { useLoginContext } from "../Login/LoginContext";

const SearchStudent = () => {
  const [nombre, setNombre] = useState<string>("");
  const [cedula, setCedula] = useState<string>("");
  const [carrera, setCarrera] = useState<string>("");
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [telefono, setTelefono] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [fecha, setFecha] = useState<string>();
  const [editar, setEditar] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const [clave, setClave] = useState<string>("");
  const toast = useToast();
  const navigator = useNavigate();
  const { user } = useLoginContext();

  const ws = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/alumno`);
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
        setAlumnos(data.view as Alumno[]);
      }
      if (data.action === "UPDATE" || data.action == "DELETE") {
        setFetching(false);
        setEditar(false);
        setDisabled(true);
        toast({
          title: "Sucess!",
          description: `Your data was ${data.action.toLowerCase()}d`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (data.action === "DELETE") {
          navigator("/");
        }
      }
      if (data.action === "ERROR") {
        setFetching(false);
        const error = data.message.split(":")[0];
        if (error === errors.fkError) {
          toast({
            title: "ERROR FK CONSTRAINT",
            description: "This student has some information in other tables",
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

    return () => ws.close();
  }, []);

  const updateForm = (encontrado: any) => {
    setCarrera(encontrado ? encontrado.carrera : "");
    setNombre(encontrado ? encontrado.nombre : "");
    setTelefono(encontrado ? encontrado.telefono : "");
    setEmail(encontrado ? encontrado.email : "");
    setFecha(encontrado ? encontrado.fechaNacimiento : "");
    setClave(encontrado ? encontrado.clave : "");
  };
  const detectChanges = (e: any) => {
    const encontrado: Alumno | boolean =
      alumnos.find((al) => al.id == e.target.value) ?? false;
    updateForm(encontrado);
    setDisabled(encontrado !== false);
    setEditar(false);
    setCedula(e.target.value);
  };
  const showMe = () => {
    if (disabled) {
      setEditar(true);
      setDisabled(false);
    }
  };

  const guardarEdicion = () => {
    setFetching(true);
    ws.send(
      JSON.stringify({
        action: "UPDATE",
        id: cedula,
        nombre: nombre,
        telefono: telefono,
        email: email,
        fechaNacimiento: fecha,
        carrera: carrera,
        clave: clave,
      })
    );
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    guardarEdicion();
  };

  const deleteStudent = () => {
    ws.send(
      JSON.stringify({
        action: "DELETE",
        id: cedula,
      })
    );
  };
  const errorEmail = email === "";
  const errorTelefono = telefono === "";
  const errorHorario = fecha === "";
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
      {!fetching && (
        <form
          style={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={(e) => onSubmit(e)}
        >
          <SimpleGrid columns={[2, null, 3]} spacing="40px">
            <Box height="180px">
              <FormControl isRequired>
                <FormLabel htmlFor="cedula">Cedula</FormLabel>
                <Input
                  id="cedula"
                  type="text"
                  disabled={editar}
                  value={cedula}
                  onChange={(e) => detectChanges(e)}
                />
                {disabled && (
                  <Box>
                    <FormHelperText>
                      Se encontro un estudiante asociado a la cedula digitada.{" "}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "5px",
                        }}
                      >
                        {user && user.rol === 3 && (
                          <>
                            <Button
                              onClick={() => navigator(`/historial/${cedula}`)}
                              colorScheme="teal"
                              variant="link"
                              style={{ alignSelf: "flex-start" }}
                            >
                              Ver historial
                            </Button>
                            <Button
                              onClick={deleteStudent}
                              colorScheme="red"
                              variant="ghost"
                            >
                              Borrar este alumno
                            </Button>
                          </>
                        )}
                      </div>
                    </FormHelperText>
                  </Box>
                )}
              </FormControl>
            </Box>
            <Box height="80px">
              {" "}
              <FormControl isRequired>
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <Input
                  id="nombre"
                  type="text"
                  disabled={disabled}
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </FormControl>
            </Box>
            <Box height="80px">
              {" "}
              <FormControl isRequired>
                <FormLabel htmlFor="carrera">Carrera</FormLabel>
                <Input
                  id="carrera"
                  type="text"
                  value={carrera}
                  disabled={disabled || editar}
                  onChange={(e) => setCarrera(e.target.value)}
                />
              </FormControl>
            </Box>

            {(disabled || editar) && (
              <>
                <Box height="80px">
                  <FormControl isRequired isInvalid={errorTelefono}>
                    <FormLabel htmlFor="telefono">Telefono</FormLabel>
                    <Input
                      id="telefono"
                      value={telefono}
                      disabled={disabled}
                      onChange={(e) => setTelefono(e.target.value)}
                      type="text"
                    />
                    {errorTelefono && (
                      <FormErrorMessage>
                        Telefono es requerido.
                      </FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box height="80px">
                  <FormControl isRequired isInvalid={errorEmail}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input
                      id="email"
                      value={email}
                      disabled={disabled}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                    />
                    {errorEmail && (
                      <FormErrorMessage>Email es requerido</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box height="80px">
                  <FormControl isRequired isInvalid={errorHorario}>
                    <FormLabel htmlFor="fecha">F.Nacimiento</FormLabel>
                    <Input
                      id="fecha"
                      value={fecha}
                      disabled={disabled}
                      onChange={(e) => setFecha(e.target.value)}
                      type="date"
                    />
                    {errorHorario && (
                      <FormErrorMessage>Fecha es requerid</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
                <Box width="30vw" height="80px">
                  <FormControl isRequired>
                    <FormLabel htmlFor="clave">Clave</FormLabel>
                    <InputGroup size="md">
                      <Input
                        pr="4.5rem"
                        disabled={disabled}
                        type={show ? "text" : "password"}
                        placeholder="Enter password"
                        value={clave}
                        onChange={(e) => setClave(e.target.value)}
                      />
                      <InputRightElement width="4.5rem">
                        <Button
                          h="1.75rem"
                          size="sm"
                          onClick={() => setShow(!show)}
                        >
                          {show ? "Hide" : "Show"}
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                </Box>
              </>
            )}
          </SimpleGrid>

          <div
            style={{
              flex: 3,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 10,
            }}
          >
            {!editar && (
              <Button
                onClick={editar ? guardarEdicion : showMe}
                colorScheme="teal"
                size="md"
                disabled={(user && user.rol === 4) ?? false}
              >
                {editar ? "Guardar" : disabled ? "Habilitar edicion" : "Buscar"}
              </Button>
            )}
            {disabled && (
              <Button
                onClick={() => navigator(`/matricula/${cedula}/${carrera}`)}
                colorScheme="teal"
                size="md"
              >
                Matricular
              </Button>
            )}
            {editar && (
              <Button type="submit" colorScheme="teal" size="md">
                Guardar
              </Button>
            )}
          </div>
        </form>
      )}
      {fetching && <Spinner size="xl" />}
    </div>
  );
};

export default SearchStudent;
