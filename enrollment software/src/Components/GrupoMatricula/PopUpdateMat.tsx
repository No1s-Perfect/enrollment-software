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
import { useRef } from "react";

interface Props {
  id: number;
  nota: number;
  idMat: number;
  cb: (id: number, nota: number, idMat: number) => void;
  close: () => void;
}
const PopUpdateMat = ({ id, nota, idMat, cb, close }: Props) => {
  const notaRef = useRef<HTMLInputElement>(null);
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (notaRef?.current?.value) {
      cb(id, parseInt(notaRef.current.value), idMat);
      close();
    }
  };
  return (
    <PopoverContent>
      <PopoverHeader>Editar Nota</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Box>
          <div style={{ padding: "0.75em" }}>
            <form onSubmit={onSubmit}>
              <FormControl isRequired>
                <FormLabel htmlFor="id">Id</FormLabel>
                <Input id="id" type="number" disabled value={id} />
              </FormControl>
              <FormControl isRequired>
                <FormLabel htmlFor="creditos">Nota</FormLabel>
                <NumberInput defaultValue={nota} min={0}>
                  <NumberInputField ref={notaRef} />
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

export default PopUpdateMat;
