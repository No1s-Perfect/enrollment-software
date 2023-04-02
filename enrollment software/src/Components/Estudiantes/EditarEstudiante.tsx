import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { useRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const EditarEstudiante = () => {
  const { id } = useParams();
  const { nombreStud } = useParams();
  const { nombreCarrera } = useParams();
  const [nombre, setNombre] = useState<string | undefined>(nombreStud);
  const [carrera, setCarrera] = useState<string | undefined>(nombreCarrera);
  const [telefono, setTelefono] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [fecha, setFecha] = useState<string>();
  useEffect(() => {

  }, []);
  return (
    <div
      style={{
        display: "flex",
        height: "80vh",
        width: "100vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "30vw",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <FormControl>
          <FormLabel htmlFor="nombre">Nombre</FormLabel>
          <Input disabled value={nombre} id="nombre" type="text" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="carrera">Carrera</FormLabel>
          <Input disabled value={carrera} id="carrera" type="text" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="telefono">Telefono</FormLabel>
          <Input
            id="telefono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            type="text"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="fecha">Fecha Nacimiento</FormLabel>
          <Input
            id="fecha"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            type="date"
          />
        </FormControl>
      </div>
    </div>
  );
};
export default EditarEstudiante;
