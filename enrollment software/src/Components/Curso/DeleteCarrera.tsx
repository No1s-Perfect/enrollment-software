import {
  Box,
  Button,
  ButtonGroup,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
} from "@chakra-ui/react";

interface Props {
  id: string;
  close: () => void;
  deleteCourse: (id: string) => void;
}
const DeleteCarrera = ({ close, id, deleteCourse }: Props) => {
  const deleteCarrera = () => deleteCourse(id);

  return (
    <PopoverContent>
      <PopoverHeader>Borrar curso</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <Box>Esta seguro de borrar este curso?</Box>
      </PopoverBody>
      <PopoverFooter d="flex" justifyContent="flex-end">
        <ButtonGroup>
          <Button variant="outline" onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={deleteCarrera}>
            Borrar
          </Button>
        </ButtonGroup>
      </PopoverFooter>
    </PopoverContent>
  );
};

export default DeleteCarrera;
