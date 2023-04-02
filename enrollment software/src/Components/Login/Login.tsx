import { useEffect, useMemo, useRef, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Avatar,
  FormControl,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import { useLoginContext } from "./LoginContext";
import { Usuario } from "../../Interfaces/Usuario";
import { useNavigate } from "react-router-dom";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const cedula = useRef<HTMLInputElement>(null);
  const clave = useRef<HTMLInputElement>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const { setUser } = useLoginContext();
  const navigate = useNavigate()
  const toast = useToast();
  const handleShowClick = () => setShowPassword(!showPassword);
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/usuario`);
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
        
        setUsuarios(data.view as Usuario[]);
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

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (cedula?.current?.value && clave?.current?.value) {
      const usuarioEncontrado =
        usuarios.find(
          (user) =>
            user.id.toString() === cedula?.current?.value &&
            user.clave === clave?.current?.value
        ) ?? false;
      if (!usuarioEncontrado) {
        toast({
          title: "ERROR",
          description: "Cedula or password are incorrect",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      toast({
        title: "Welcome",
        description: "Welcome to Matri-Fast",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setUser(usuarioEncontrado);
      navigate('/')
    }
  };
  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Bienvenid@</Heading>
        <Box minW={{ base: "70%", md: "468px" }}>
          <form onSubmit={onSubmit}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Input type="text" ref={cedula} placeholder="Cedula" />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Input
                    ref={clave}
                    type={showPassword ? "text" : "password"}
                    placeholder="Clave"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Login;
