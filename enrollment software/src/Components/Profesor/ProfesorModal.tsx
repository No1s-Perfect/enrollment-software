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
import { Profesor } from "../../Interfaces/Profesor";
import { Usuario } from "../../Interfaces/Usuario";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    profesor: Profesor;
    update:(profesor:Profesor) => void;
    deleteProfesor:(id:number) => void;
}

const ProfesorModal = ({
  isOpen,
  onClose,
  profesor,
  update,
  deleteProfesor,
}: Props) => {
    const [form, setForm] = useState<Profesor>(profesor); 
    const toast = useToast();
    const handleChange = (e: any) => {        
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }); 
    };
    
    const handleUpdate = () =>{
        if( form.nombre === "" ||
            form.telefono === 0 ||
            form.email === "" ||
            form.clave === ""){
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
        deleteProfesor(form.id);
    }
    return (
        <>
                
          <Modal isOpen={isOpen} size={'lg'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{profesor.nombre}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                    <FormControl>
                    <FormLabel htmlFor="id">Identificación del profesor</FormLabel>
                    <Input
                        name="id"
                        type="text"
                        placeholder="Escriba la identificación del profesor"
                        value={form.id}
                        onChange={e => handleChange(e)}
                        disabled
                    />
                    <FormLabel htmlFor="nombre">Nombre</FormLabel>
                    <Input
                        name="nombre"
                        type="text"
                        placeholder="Escriba el nombre del profesor"
                        value={form.nombre}
                        onChange={e => handleChange(e)}
                        required
                    />
                    <FormLabel htmlFor="creditos">Telefono</FormLabel>
                    <Input
                        name="telefono"
                        type="number"
                        placeholder="Escriba el numero de telefono"
                        value={form.telefono}
                        onChange={handleChange}
                        required
                    />
                    <FormLabel htmlFor="horas">Email</FormLabel>
                    <Input
                        name="email"
                        type="email"
                        placeholder="Escriba el email del profesor"
                        value={form.email}
                        onChange={e => handleChange(e)}
                        required
                    />
                    </FormControl>
                    <FormLabel htmlFor="horas">Contraseña</FormLabel>
                    <Input
                        name="clave"
                        type="password"
                        placeholder="Escriba la contraseña del profesor"
                        onChange={e => handleChange(e)}
                        value={form.clave || ""}
                        required
                    />
                    <ModalFooter>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={handleUpdate}
                        >
                            Actualizar Profesor
                        </Button>
                        <Button 
                            textAlign="center"
                            colorScheme="red"
                            size="md"
                            className="p5"
                            onClick={handleDelete}
                        >
                            Eliminar Profesor
                        </Button>
                    </ModalFooter>
              </ModalBody>
    
            </ModalContent>
          </Modal>
        </>
      )
};

export default ProfesorModal;