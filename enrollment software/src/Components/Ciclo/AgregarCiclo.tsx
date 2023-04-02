import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Spinner,
  Heading,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState, useMemo } from "react";
import { useToast } from "@chakra-ui/react";
import { Ciclo } from "../../Interfaces/Ciclo";

const initialFrom = {
  id: 0,
  numero: 3,
  fechaInicio: "",
  fechaFin: "",
  activo: 3,
};
const AgregarCiclo = () => {
  const [form, setForm] = useState<Ciclo>(initialFrom);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const [fetching, setFetching] = useState<boolean>(false);
  const toast = useToast();
  const ws = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/ciclo`);
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
        setCiclos(view);
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
    if (e.target.name === "numero") {
      setForm({
        ...form,
        [e.target.name]: parseInt(e.target.value, 10),
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setFetching(true);
    validarCicloActivo();
    if (
      (form.numero === 3 || form.fechaInicio === "" || form.fechaFin === "",
      form.activo === 3)
    ) {
      toast({
        title: "Por favor complete todos los campos",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    } else {
      ws.send(
        JSON.stringify({
          action: "CREATE",
          numero: form.numero,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          activo: form.activo,
        })
      );
      ws.onmessage = (event) => {
        let data = JSON.parse(event.data);
        if (data.action === "CREATE") {
          toast({
            title: "Ciclo Agregado!",
            description: "El ciclo se agrego con exito!",
            status: "success",
            duration: 4000,
            isClosable: true,
          });
          setForm(initialFrom);
        }
        if (data.action === "ERROR") {
          setFetching(true);
          if (data.message.split(":")[0] === "ORA-00001") {
            toast({
              title: "Error al agregar el ciclo " + form.id,
              description: "Ya existe un ciclo con esa Identificación",
              status: "error",
              duration: 4000,
              isClosable: true,
            });
          } else {
            toast({
              title: "ERROR",
              description: "El Ciclo no se pudo agregar",
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
  };

  const validarCicloActivo = () => {
    const cicloActivo = ciclos.find((c) => c.activo === 1);
    if (cicloActivo && form.activo == 1) {
      ws.send(
        JSON.stringify({
          action: "UPDATE",
          id: cicloActivo.id,
          numero: cicloActivo.numero,
          fechaInicio: cicloActivo.fechaInicio,
          fechaFin: cicloActivo.fechaFin,
          activo: 2,
        })
      );
    }
  };
  return (
    <div className="form">
      <form onSubmit={handleSubmit}>
        {fetching ? (
          <Spinner size="xl" />
        ) : (
          <div className="form-fetching">
            <FormControl>
              <Heading textAlign="center">Agregar ciclo</Heading>
              <FormLabel htmlFor="id">Identificación del profesor</FormLabel>
              <Select
                name="numero"
                onChange={(e) => handleChange(e)}
                value={form.numero}
                required
              >
                <option value={3}>Seleccionar...</option>
                <option value={1}>Primer ciclo</option>
                <option value={2}>Segundo ciclo</option>
              </Select>
              <FormLabel htmlFor="nombre">Fecha de inicio del ciclo</FormLabel>
              <Input
                name="fechaInicio"
                type="date"
                placeholder="Escriba el nombre del profesor"
                value={form.fechaInicio}
                onChange={(e) => handleChange(e)}
                required
              />
              <FormLabel htmlFor="creditos">Fecha de fin del ciclo</FormLabel>
              <Input
                name="fechaFin"
                type="date"
                placeholder="Escriba el numero de telefono"
                value={form.fechaFin}
                onChange={handleChange}
                required
              />
              <FormLabel htmlFor="nombre">Es el ciclo activo?</FormLabel>
              <Select
                name="activo"
                onChange={(e) => handleChange(e)}
                value={form.activo}
                required
              >
                <option value={3}>Seleccionar...</option>
                <option value={1}>Activo</option>
                <option value={2}>Inactivo</option>
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
        )}
      </form>
    </div>
  );
};

export default AgregarCiclo;
