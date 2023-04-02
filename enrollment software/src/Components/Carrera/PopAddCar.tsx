import { useRef } from "react";
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

interface Props {
  create: (codigo: string, nombre: string, titulo: string) => void;
  close: () => void;
}
const PopAddCar = ({ create, close }: Props) => {
  const codigo = useRef<HTMLInputElement>(null);
  const nombre = useRef<HTMLInputElement>(null);
  const titulo = useRef<HTMLInputElement>(null);
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (
      codigo?.current?.value &&
      nombre?.current?.value &&
      titulo?.current?.value
    ) {
      create(codigo.current.value, nombre.current.value, titulo.current.value);
      codigo.current.value = "";
      nombre.current.value = "";
      titulo.current.value = "";
      close();
    }
  };
  return (
    <PopoverContent>
      <PopoverHeader>Agregar Curso</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Box>
          <div style={{ padding: "0.75em" }}>
            <form onSubmit={onSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="codigo">Codigo</FormLabel>
                <Input id="codigo" type="text" ref={codigo} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <Input id="nombre" type="text" ref={nombre} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="titulo">Titulo</FormLabel>
                <Input id="titulo" type="text" ref={titulo} />
              </FormControl>
              <PopoverFooter d="flex" justifyContent="center">
                {" "}
                <ButtonGroup size="sm">
                  <Button type="submit" colorScheme="teal">
                    Agregar carrera
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

export default PopAddCar;
