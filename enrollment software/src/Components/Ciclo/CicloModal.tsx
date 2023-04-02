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
    Select,
  } from '@chakra-ui/react';
  import { useToast } from "@chakra-ui/react";
import { Ciclo } from "../../Interfaces/Ciclo";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ciclo: Ciclo;
    update:(ciclo:Ciclo) => void;
    deleteCiclo:(id:number) => void;
}

const ProfesorModal = ({
  isOpen,
  onClose,
  ciclo,
  update,
  deleteCiclo
}: Props) => {
    const [form, setForm] = useState<Ciclo>(ciclo);
    const toast = useToast();
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }); 
    };
    const handleUpdate = () =>{
        if( form.numero === 3 ||
            form.fechaInicio === "" ||
            form.fechaFin === "",
            form.activo === 3){
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
        deleteCiclo(form.id);
    }
    return (
        <>
                
          <Modal isOpen={isOpen} size={'lg'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Ciclo {ciclo.numero}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                    <FormControl>
                    <FormLabel htmlFor="id">Identificación del ciclo</FormLabel>
                    <Input
                        name="id"
                        type="text"
                        placeholder="Escriba la identificación del profesor"
                        value={form.id}
                        onChange={e => handleChange(e)}
                        disabled
                    />
                    <FormLabel htmlFor="nombre">Numero de Ciclo</FormLabel>
                    <Select 
                        name="numero"
                        onChange={e => handleChange(e)}
                        value={form.numero}
                        required
                    >
                        <option value={3}>Seleccionar...</option>
                        <option value={1}>Primer ciclo</option>
                        <option value={2}>Segundo ciclo</option>
                    </Select>
                    <FormLabel htmlFor="creditos">Fecha Inicio</FormLabel>
                    <Input
                        name="fechaInicio"
                        type="date"
                        placeholder="Escriba el numero de telefono"
                        value={form.fechaInicio}
                        onChange={handleChange}
                        required
                    />
                    <FormLabel htmlFor="horas">Fecha Fin</FormLabel>
                    <Input
                        name="fechaFin"
                        type="date"
                        placeholder="Escriba el email del profesor"
                        value={form.fechaFin}
                        onChange={e => handleChange(e)}
                        required
                    />
                    <FormLabel htmlFor="nombre">Es el ciclo activo?</FormLabel>
                    <Select 
                        name="activo"
                        onChange={e => handleChange(e)}
                        value={form.activo}
                        required
                    >
                        <option value={3}>Seleccionar...</option>
                        <option value={1}>Activo</option>
                        <option value={2}>Inactivo</option>
                    </Select>
                    </FormControl>
                    <ModalFooter>
                        <Button 
                            textAlign="center"
                            colorScheme="teal"
                            size="md"
                            onClick={handleUpdate}
                        >
                            Actualizar Ciclo
                        </Button>
                        <Button 
                            textAlign="center"
                            colorScheme="red"
                            size="md"
                            className="p5"
                            onClick={handleDelete}
                        >
                            Eliminar Ciclo
                        </Button>
                    </ModalFooter>
              </ModalBody>
    
            </ModalContent>
          </Modal>
        </>
      )
};

export default ProfesorModal;