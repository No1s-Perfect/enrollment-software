import { useState, useEffect, useRef, useMemo, useCallback } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { errors } from "../../Constants/Error";
interface Props {
  codigo: string;
  close: () => void;
}
const PopAdd = ({ codigo, close }: Props) => {
  const id = useRef<HTMLInputElement>(null);
  const nombre = useRef<HTMLInputElement>(null);
  const creditos = useRef<HTMLInputElement>(null);
  const horas = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/curso`);
    return ws;
  }, []);
  const onSubmit = (e: any) => {
    e.preventDefault();

    if (
      id?.current?.value &&
      nombre?.current?.value &&
      creditos?.current?.value &&
      horas?.current?.value
    ) {
      wsM.send(
        JSON.stringify({
          action: "CREATE",
          id: id.current.value,
          name: nombre.current.value,
          creditos: parseInt(creditos.current.value),
          horas: parseInt(horas.current.value),
          carrera: codigo,
        })
      );
    }
  };

  useEffect(() => {
    wsM.onmessage = (event) => {
      let data = JSON.parse(event.data);

      if (data.action === "ERROR") {
        const error = data.message.split(":")[0];
        if (error === errors.pkError) {
          toast({
            title: "ERROR",
            description: "There is already a course with this id",
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
      if (data.action === "CREATE") {
        wipeData();
        toast({
          title: "Sucess!",
          description: "Your course was added",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        close()
      }
    };
    return () => wsM.close();
  }, []);

  const wipeData = () => {
    if (
      id?.current?.value &&
      nombre?.current?.value &&
      creditos?.current?.value &&
      horas?.current?.value
    ) {
      id.current.value = "";
      nombre.current.value = "";
      creditos.current.value = "";
      horas.current.value = "";
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
                <FormLabel htmlFor="id">Id</FormLabel>
                <Input id="id" type="text" ref={id} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="nombre">Nombre</FormLabel>
                <Input id="nombre" type="text" ref={nombre} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="creditos">Creditos</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField ref={creditos} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="creditos">Horas</FormLabel>
                <NumberInput defaultValue={0} min={0}>
                  <NumberInputField ref={horas} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <PopoverFooter d="flex" justifyContent="center">
                {" "}
                <ButtonGroup size="sm">
                  <Button type="submit" colorScheme="teal">
                    Agregar curso
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

export default PopAdd;
