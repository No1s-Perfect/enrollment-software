import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Spinner,
    Heading,
    Select
  } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { Curso } from "../../Interfaces/Curso";
import { Carrera } from "../../Interfaces/Carrera";

const initialFrom = {
    id:"",
    nombre:"",
    creditos:0,
    horas:0,
    carrera:"",
}
const AgregarCursos = () => {
    const [form, setForm] = useState<Curso>(initialFrom);
    const [carrera, setCarrera] = useState<Carrera[]>([]);
    const [fetching, setFetching] = useState<boolean>(false);
    const toast = useToast();
    const ws = useMemo(() => {
      const connection = { url: "localhost:8080/server" };
      const ws = new WebSocket(`ws://${connection.url}/curso`);
      return ws;
    }, []);
    const wsC = useMemo(() => {
      const connection = { url: "localhost:8080/server" };
      const wsC = new WebSocket(`ws://${connection.url}/carrera`);
      return wsC;
    }, []);
    useEffect(() => {
      wsC.onopen = () => {
        wsC.send(
          JSON.stringify({
            action: "VIEW_ALL",
          })
        );
      };
      wsC.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.action === "VIEW_ALL") {
          const { view } = data;
          setCarrera(view);
        }
        if (data.action === "ERROR") {
          setFetching(false);
          toast({
            title: "ERROR",
            description: "There was an error while fetching your request",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      };
      return () => wsC.close();
    }, []);
    
    const handleChange = (e: any) => {  
      setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    
    const handleSubmit = (e: any) =>{
        e.preventDefault();
        setFetching(true);
        if( form.id === "" ||
            form.nombre === "" ||
            form.creditos === 0 ||
            form.horas === 0 ||
            form.carrera === ""){
              toast({
                title: "Por favor complete todos los campos",
                status: "error",
                duration: 2000,
                isClosable: true,
              });
        }else{
            ws.send(
              JSON.stringify({
                action: "CREATE",
                id: form.id,
                name: form.nombre,
                creditos: form.creditos,
                horas: form.horas,
                carrera: form.carrera
              })
            );
          ws.onmessage = (event) => {
              let data = JSON.parse(event.data);
              if (data.action === "CREATE") {
                toast({
                    title: "Curso Agregado!",
                    description: "El curso se agrego con exito!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setForm(initialFrom);
            }
            if (data.action === "ERROR") {
              setFetching(true);
              if(data.message.split(":")[0] === "ORA-00001"){
                toast({
                  title: 'Error al agregar el curso ' + form.id,
                  description: 'Ya existe un curso con esa Identificación',
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              }else{
                toast({
                  title: "ERROR",
                  description: "El curso no se pudo agregar",
                  status: "error",
                  duration: 5000,
                  isClosable: true,
                });
              }
            }
            setFetching(false);
          };
        }
        setFetching(false);
        return () => ws.close();
    }
    return (
      <div className="form">
        <form onSubmit={handleSubmit}>
        {fetching ? 
          <Spinner size="xl" />:
          <div className="form-fetching">
            <FormControl>
              <Heading textAlign="center">Agregar Cursos</Heading>
              <FormLabel htmlFor="id">Identificación del curso</FormLabel>
              <Input
                name="id"
                type="text"
                placeholder="Escriba el id del curso"
                value={form.id}
                onChange={e => handleChange(e)}
                required
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
              <Button 
                textAlign="center"
                onClick={handleSubmit}
                colorScheme="teal"
                size="md"
              >
                Guardar
              </Button>
            
          </div>          
        }
        
        </form>  
      </div>
    );
}

export default AgregarCursos
