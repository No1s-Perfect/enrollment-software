import { useState, useRef } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@chakra-ui/react";

interface Props {
  titulo: string;
  close: () => void;
  idAdmin: string;
  cb: (id: string, nombre: string, clave: string) => void;
  nombreAdmin: string;
  claveAdmin: string;
}
const PopAddAdmin = ({
  titulo,
  close,
  idAdmin,
  cb,
  nombreAdmin,
  claveAdmin,
}: Props) => {
  const [nombre, setNombre] = useState(nombreAdmin);
  const [id, setId] = useState(idAdmin);
  const [clave, setClave] = useState(claveAdmin);
  const [show, setShow] = useState(false);

  const onSubmit = (e: any) => {
    e.preventDefault();
    cb(id, nombre, clave);
    setNombre("");
    setClave("");
    setId("");
    close();
  };

  return (
    <PopoverContent>
      <PopoverHeader>Info </PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Box>
          <div style={{ padding: "0.75em" }}>
            <form onSubmit={onSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="id">Cedula</FormLabel>
                <Input
                  id="id"
                  type="text"
                  value={id}
                  disabled={titulo !== "Agregar Admin"}
                  onChange={(e) => setId(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="clave">Clave</FormLabel>
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
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
              <PopoverFooter d="flex" justifyContent="center">
                {" "}
                <ButtonGroup size="sm">
                  <Button
                    type="submit"
                    colorScheme={titulo === "Agregar Admin" ? "teal" : "red"}
                  >
                    {titulo === "Agregar Admin" ? "Agregar" : "Guardar"}
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </form>
          </div>
        </Box>
      </PopoverBody>
    </PopoverContent>
  );
};

export default PopAddAdmin;
