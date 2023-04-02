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
  borrarAdmin: (id: string) => void;
  idAdmin: string;
  titulo: string;
  onClose: () => void;
}
const Eliminar = ({ borrarAdmin, idAdmin, titulo, onClose }: Props) => {
  return (
    <PopoverContent>
      <PopoverHeader>Eliminar </PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Box>
          <div style={{ padding: "0.75em" }}>
            {" "}
            Esta seguro de proseguir con la acción?
          </div>
        </Box>
      </PopoverBody>
      <PopoverFooter d="flex" justifyContent="flex-end">
        {" "}
        <ButtonGroup size="sm">
          <Button
            onClick={() => {
              if (titulo === "Admin") borrarAdmin(idAdmin);
              onClose();
            }}
            colorScheme="red"
          >
            Eliminar
          </Button>
        </ButtonGroup>
      </PopoverFooter>
    </PopoverContent>
  );
};

export default Eliminar;
