import { useEffect, useState, useRef } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    FormControl,
    FormLabel,
    Input,
    Heading,
    Select
  } from '@chakra-ui/react';
  import { useToast } from "@chakra-ui/react";
import { Curso } from "../../Interfaces/Curso";
import { Carrera } from "../../Interfaces/Carrera";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    curso: Curso;
    carrera: Carrera[];
    update:(curso:Curso) => void;
    deleteCurso:(id:String) => void;
}

const CursosModal = ({
  isOpen,
  onClose,
  curso,
  carrera,
  update,
  deleteCurso
}: Props) => {
    const [form, setForm] = useState<Curso>(curso);
    const toast = useToast();
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }); 
    };
    const handleUpdate = () =>{
        if( form.nombre === "" ||
            form.creditos === 0 ||
            form.horas === 0 ||
            form.carrera === ""){
              toast({
                title: "Por favor complete todos los campos",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
        }
        update(form);
    }
    const handleDelete = () =>{
        deleteCurso(form.id);
    }
    return (
        <>
                
          <Modal isOpen={isOpen} size={'lg'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{curso.nombre}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                    <FormControl>
                    <FormLabel htmlFor="id">Identificación del curso</FormLabel>
                    <Input
                        name="id"
                        type="text"
                        placeholder="Escriba el id del curso"
                        value={form.id}
                        onChange={e => handleChange(e)}
                        disabled
                    />
                    <FormLabel htmlFor="nombre">Nombre</FormLabel>
                    <Input
                        name="nombre"
                        type="text"
                        placeholder="Escriba el nombre del curso"
                        value={form.nombre}
                        onChange={e => handleChange(e)}
                        required
                    />
                    <FormLabel htmlFor="creditos">Créditos</FormLabel>
                    <Input
                        name="creditos"
                        type="number"
                        placeholder="Escriba la cantidad de créditos"
                        value={form.creditos}
                        onChange={handleChange}
                        required
                    />
                    <FormLabel htmlFor="horas">Horas</FormLabel>
                    <Input
                        name="horas"
                        type="number"
                        placeholder="Escriba la cantidad de horas"
                        value={form.horas}
                        onChange={e => handleChange(e)}
                        required
                    />
                    <FormLabel htmlFor="carrera">Carrera</FormLabel>
                    <Select 
                        name="carrera"
                        onChange={e => handleChange(e)}
                        value={form.carrera}
                        required
                    >
                        <option value="" hidden>Seleccionar...</option>
                        {carrera !== null &&
                        carrera.map((el) =>
                            <option
                            key={el.codigo}
                            value={el.codigo}
                            >
                            {el.nombre} - {el.titulo}
                            </option>
                        )

                        }
                    </Select>
                    </FormControl>
                    <ModalFooter>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={handleUpdate}
                        >
                            Actualizar Curso
                        </Button>
                        <Button 
                            textAlign="center"
                            colorScheme="red"
                            size="md"
                            className="p5"
                            onClick={handleDelete}
                        >
                            Eliminar Curso
                        </Button>
                    </ModalFooter>
              </ModalBody>
    
            </ModalContent>
          </Modal>
        </>
      )
};

export default CursosModal;