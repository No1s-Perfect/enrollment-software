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
    Td,
    TableContainer,
    Tr,
    TableCaption,
    Thead,
    Table,
    Th,
    Tbody,
    GridItem,
    useDisclosure
  } from '@chakra-ui/react';
  import { useToast } from "@chakra-ui/react";
import { Ciclo } from "../../Interfaces/Ciclo";
import { Grupo2 as Grupo } from "../../Interfaces/Grupo";
import { Curso } from "../../Interfaces/Curso";
import { Profesor } from "../../Interfaces/Profesor";


const initialFrom = {
    numeroGrupo: 0,
    cicloSimple: 0,
    cursoSimple: "",
    horario: "",
    profesor:0
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ciclo: string;
    profesores: Profesor[];
    crearGrupo: (grupo:Grupo) => void;
    curso: string;
}

const AgregarGrupoModal = ({
  isOpen,
  onClose,
  ciclo,
  profesores,
  crearGrupo,
  curso,
}: Props) => {
    const [form, setForm] = useState<Grupo>(initialFrom);
    const toast = useToast();
    const handleChange = (e: any) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }); 
    };

    const crear = () =>{
        if( form.horario === "" ||
            form.profesor === 0){
              toast({
                title: "Por favor complete todos los campos",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
        }else{
            form.cicloSimple = parseInt(ciclo);
            form.cursoSimple = curso;
            crearGrupo(form);
        }
    }
    return (
        <>      
          <Modal isOpen={isOpen} size={'md'} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Grupo</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <FormControl>
                    <FormLabel htmlFor="horas">Horario</FormLabel>
                    <Input
                        name="horario"
                        type="time"
                        placeholder="Escriba la cantidad de horas"
                        value={form.horario}
                        onChange={e => handleChange(e)}
                        required
                    />
                    <FormLabel htmlFor="horas">Profesor</FormLabel>
                    <Select 
                    name="profesor"
                    onChange={e => handleChange(e)}
                    value={form.profesor}
                    required
                    >
                    <option value="" hidden>Seleccionar...</option>
                    {profesores !== null &&
                    profesores.map((el) =>
                        <option
                        key={el.id}
                        value={el.id}
                        >
                        {el.nombre}
                        </option>
                    )

                    }
                    </Select>
                    </FormControl>
              </ModalBody>
                <ModalFooter>
                    <Button 
                        textAlign="center"
                        colorScheme="green"
                        size="md"
                        className="p5"
                        onClick={()=>crear()}
                    >
                        Agregar Grupo
                    </Button>
                   
                </ModalFooter>
    
            </ModalContent>
          </Modal>
        </>
      )
};

export default AgregarGrupoModal;