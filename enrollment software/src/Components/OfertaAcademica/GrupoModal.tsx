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
import { Grupo2 as Grupo} from "../../Interfaces/Grupo";
import { Curso } from "../../Interfaces/Curso";
import { Profesor } from "../../Interfaces/Profesor";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    grupo: Grupo;
    ciclos: Ciclo[];
    cursos: Curso[];
    profesores: Profesor[];
    updateGrupo: (grupo:Grupo) => void;
    deleteGrupo:(id:number) => void;
}

const GrupoModal = ({
  isOpen,
  onClose,
  grupo,
  ciclos,
  cursos,
  profesores,
  updateGrupo,
  deleteGrupo,
}: Props) => {
    const [form, setForm] = useState<Grupo>(grupo);
    const toast = useToast();
    const handleChange = (e: any) => {
        
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        }); 
    };
    const handleUpdate = () =>{
        if( form.horario === ""){
              toast({
                title: "Por favor complete todos los campos",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
        }
        updateGrupo(form);
    }
    const cicloName = (ciclo:number) =>{
        return ciclo === 1 ? "Primer Ciclo" : "Segundo Ciclo"
    }

    const handleDelete = () =>{
        deleteGrupo(form.numeroGrupo);
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
                    <FormLabel htmlFor="id">Numero de grupo</FormLabel>
                    <Input
                        name="id"
                        type="text"
                        placeholder="Escriba el id del curso"
                        value={form.numeroGrupo}
                        onChange={e => handleChange(e)}
                        disabled
                    />
                    <FormLabel htmlFor="nombre">Ciclo</FormLabel>
                    <Select 

                    name="cicloSimple"

                    onChange={e => handleChange(e)}
                    value={form.cicloSimple}
                    required
                    >
                    <option value="" hidden>Seleccionar...</option>
                    {ciclos !== null &&
                    ciclos.map((el) =>
                        <option
                        key={el.id}
                        value={el.id}
                        >
                        {cicloName(el.id)} - {el.fechaInicio.split("-")[0]}
                        </option>
                    )

                    }
                    </Select>
                    <FormLabel htmlFor="creditos">Curso</FormLabel>
                    <Select 
                    name="cursoSimple"
                    onChange={e => handleChange(e)}
                    value={form.cursoSimple}
                    required
                    >
                    <option value="" hidden>Seleccionar...</option>
                    {cursos !== null &&
                    cursos.map((el) =>
                        <option
                        key={el.id}
                        value={el.id}
                        >
                        {el.nombre}
                        </option>
                    )

                    }
                    </Select>
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
                        onClick={()=>handleUpdate()}
                    >
                        Actualizar Grupo
                    </Button>
                    <Button 
                        textAlign="center"
                        colorScheme="red"
                        size="md"
                        className="p5"
                        onClick={()=>handleDelete()}
                    >
                        Eliminar Grupo
                    </Button>
                </ModalFooter>
    
            </ModalContent>
          </Modal>
        </>
      )
};

export default GrupoModal;