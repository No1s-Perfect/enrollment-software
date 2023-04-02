import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
interface Props {
  nombre: string;
  titulo: string;
  id: string;
  open: boolean;
  close: () => void;
  update: (id: string, nombre: string, titulo: string) => void;
}
const PopUpdate = ({ nombre, titulo, id, update, open, close }: Props) => {
  const [initialName, setInitialName] = useState<string>("");
  const [initialTit, setInitialTit] = useState<string>("");
  const onSubmit = (e: any) => {
    e.preventDefault();
    update(id, initialName, initialTit);
    close();
  };
  useEffect(() => {
    setInitialName(nombre);
    setInitialTit(titulo);
  }, [open]);
  return (
    <>
      <PopoverContent>
        <PopoverHeader>Editar carrera {nombre}</PopoverHeader>
        <PopoverCloseButton />
        <PopoverBody>
          <Box>
            <div style={{ padding: "0.75em" }}>
              <form onSubmit={onSubmit}>
                <FormControl isRequired>
                  <FormLabel htmlFor="nombre">Nombre</FormLabel>
                  <Input
                    id="nombre"
                    type="text"
                    value={initialName}
                    onChange={(e) => setInitialName(e.target.value)}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="carrera">Titulo</FormLabel>
                  <Input
                    id="carrera"
                    type="text"
                    value={initialTit}
                    onChange={(e) => setInitialTit(e.target.value)}
                  />
                </FormControl>
                <PopoverFooter d="flex" justifyContent="center">
                  {" "}
                  <ButtonGroup size="sm">
                    <Button type="submit" colorScheme="red">
                      Guardar
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </form>
            </div>
          </Box>
        </PopoverBody>
      </PopoverContent>
    </>
  );
};

export default PopUpdate;
