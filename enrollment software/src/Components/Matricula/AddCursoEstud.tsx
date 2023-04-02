import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Grupo } from "../../Interfaces/Grupo";
import { Ciclo } from "../../Interfaces/Ciclo";
interface Props {
  carrera: string | undefined;
  addGrupo: (idGrupo: string) => void;
  
}

const AddCursoEstud = ({ carrera, addGrupo}: Props) => {
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/grupo`);
    return ws;
  }, []);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);
  const grupoSelec = useRef<HTMLSelectElement>(null);
  const [cicloId, setCicloId] = useState<number>(-1);
  useEffect(() => {
    wsM.onopen = () => {
      wsM.send(
        JSON.stringify({
          action: "VIEW_ALL",
        })
      );
    };
    wsM.onmessage = (event) => {
      let data = JSON.parse(event.data);
      if (data.action === "VIEW_ALL") {
        setCiclos(
          data.view
            .map((c: Grupo) => ({ ...c.ciclo } as Ciclo))
            .reduce((acc: Ciclo[], current: Ciclo) => {
              if (!acc.some((c: Ciclo) => c.id === current.id)) {
                acc.push(current);
              }
              return acc;
            }, [] as Ciclo[])
            .sort((a: Ciclo, b: Ciclo) => b.activo - a.activo) as Ciclo[]
        );
        setGrupos(data.view);
      }
    };

  

    return () => wsM.close();
  }, []);

  const prueba = () => {
    if (grupoSelec?.current?.value) {
      addGrupo(grupoSelec?.current?.value);
    }
  };

  return (
    <PopoverContent>
      <PopoverHeader>Agregar Curso</PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            margin: "10px",
          }}
        >
          <Select
            placeholder="Seleccione un ciclo"
            onChange={(e) => setCicloId(parseInt(e.target.value))}
          >
            {ciclos.map((c, index) => (
              <option key={index} value={c.id}>
                {c.activo === 1
                  ? `ACTIVO ${c.numero}-${c.fechaInicio}-${c.fechaFin}`
                  : `${c.numero}-${c.fechaInicio}-${c.fechaFin}`}
              </option>
            ))}
          </Select>

          {cicloId !== -1 && (
            <Select placeholder="Seleccione un grupo" ref={grupoSelec}>
              {grupos
                .filter(
                  (gr: Grupo) =>
                    gr.curso.carrera === carrera && gr.ciclo.id === cicloId
                )
                .map((gr, index) => (
                  <option key={index} value={gr.numeroGrupo}>
                    {gr.curso.nombre}
                  </option>
                ))}
            </Select>
          )}
        </div>
      </PopoverBody>
      <PopoverFooter d="flex" justifyContent="center">
        {" "}
        <ButtonGroup size="sm">
          <Button onClick={prueba} colorScheme="teal">
            Agregar
          </Button>
        </ButtonGroup>
      </PopoverFooter>
    </PopoverContent>
  );
};

export default AddCursoEstud;
