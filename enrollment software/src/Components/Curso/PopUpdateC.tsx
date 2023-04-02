import { useEffect, useState, useRef } from "react";
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

interface Props {
  nombre: string;
  creditos: number;
  horas: number;
  id: string;
  open: boolean;
  close: () => void;
  update: (id: string, name: string, creditos: number, horas: number) => void;
}

const PopUpdateC = ({
  nombre,
  creditos,
  horas,
  id,
  open,
  close,
  update,
}: Props) => {
  const [initialName, setInitialName] = useState<string>(nombre);
  const h = useRef<HTMLInputElement>(null);
  const c = useRef<HTMLInputElement>(null);

  const onSubmit = (e: any) => {
    e.preventDefault();
    if (h?.current?.value && c?.current?.value) {
      update(
        id,
        initialName,
        parseInt(c.current.value),
        parseInt(h.current.value)
      );
      close();
    }
  };
  return (
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
                <FormLabel htmlFor="creditos">Creditos</FormLabel>
                <NumberInput defaultValue={creditos} min={0}>
                  <NumberInputField ref={c} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="horas">Horas</FormLabel>
                <NumberInput defaultValue={horas} min={0}>
                  <NumberInputField ref={h} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
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
  );
};

export default PopUpdateC;
