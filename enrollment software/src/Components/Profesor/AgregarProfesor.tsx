import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Spinner,
    Heading,
  } from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { Profesor } from "../../Interfaces/Profesor";

const initialFrom = {
    id:0,
    nombre:"",
    telefono:0,
    email:"",
    clave:""
}
const AgregarProfesor = () => {
    const [form, setForm] = useState<Profesor>(initialFrom);
    const [fetching, setFetching] = useState<boolean>(false);

    const toast = useToast();
    const ws = useMemo(() => {
      const connection = { url: "localhost:8080/server" };
      const ws = new WebSocket(`ws://${connection.url}/profesor`);
      return ws;
    }, []);

    useEffect(() => {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            action: "VIEW_ALL",
          })
        );
      };
      ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.action === "VIEW_ALL") {
          const { view } = data;
          //setCarrera(view);
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
      return () => ws.close();
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
        
        if( form.id === 0 ||
            form.nombre === "" ||
            form.telefono === 0 ||
            form.email === "" ||
            form.clave === ""){
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
                telefono: form.telefono,
                email: form.email,
                clave: form.clave
              })
            );
          ws.onmessage = (event) => {
              let data = JSON.parse(event.data);
              if (data.action === "CREATE") {
                toast({
                    title: "Profesor Agregado!",
                    description: "El profesor se agrego con exito!",
                    status: "success",
                    duration: 4000,
                    isClosable: true,
                });
                setForm(initialFrom);
            }
            if (data.action === "ERROR") {
              setFetching(true);
              if(data.message.split(":")[0] === "ORA-00001"){
                toast({
                  title: 'Error al agregar el profesor ' + form.id,
                  description: 'Ya existe un profesor con esa Identificación',
                  status: "error",
                  duration: 4000,
                  isClosable: true,
                });
              }else{
                toast({
                  title: "ERROR",
                  description: "El Profesor no se pudo agregar",
                  status: "error",
                  duration: 4000,
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
              <Heading textAlign="center">Agregar Profesor</Heading>
              <FormLabel htmlFor="id">Identificación del profesor</FormLabel>
              <Input
                name="id"
                type="text"
                placeholder="Escriba el id del profesor"
                value={form.id}
                onChange={e => handleChange(e)}
                required
              />
              <FormLabel htmlFor="nombre">Nombre del profesor</FormLabel>
              <Input
                name="nombre"
                type="text"
                placeholder="Escriba el nombre del profesor"
                value={form.nombre}
                onChange={e => handleChange(e)}
                required
              />
              <FormLabel htmlFor="creditos">Numero de telefono</FormLabel>
              <Input
                name="telefono"
                type="number"
                placeholder="Escriba el numero de telefono"
                value={form.telefono}
                onChange={handleChange}
                required
              />
              <FormLabel htmlFor="horas">Email del profesor</FormLabel>
              <Input
                name="email"
                type="email"
                placeholder="Escriba el email del profesor"
                value={form.email}
                onChange={e => handleChange(e)}
                required
              />
              <FormLabel htmlFor="horas">Contraseña</FormLabel>
              <Input
                name="clave"
                type="password"
                placeholder="Escriba la contraseña del profesor"
                onChange={e => handleChange(e)}
                value={form.clave}
                required
              />
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

export default AgregarProfesor;
