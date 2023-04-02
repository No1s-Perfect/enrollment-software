import { useEffect, useMemo, useState } from "react";
import { Ciclo } from "../../Interfaces/Ciclo";
import { Grupo } from "../../Interfaces/Grupo";
import {
  Button,
  ButtonGroup,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  Select,
} from "@chakra-ui/react";
interface Props {
  carrera: string | undefined;
  cb: (e: any) => void;
  onClose: () => void;
}

const CiclosGrupos = ({ carrera, cb, onClose }: Props) => {
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/grupo`);
    return ws;
  }, []);
  const [ciclos, setCiclos] = useState<Ciclo[]>([]);

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
            .filter((g: Grupo) => g.curso.carrera === carrera)
            .map((c: Grupo) => ({ ...c.ciclo } as Ciclo))
            .reduce((acc: Ciclo[], current: Ciclo) => {
              if (!acc.some((c: Ciclo) => c.id === current.id)) {
                acc.push(current);
              }
              return acc;
            }, [] as Ciclo[])
        );
      }
    };

    return () => wsM.close();
  }, []);
  return (
    <PopoverContent>
      <PopoverHeader>Elejir ciclo</PopoverHeader>
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
          <Select placeholder="Seleccione un ciclo" onChange={cb}>
            {ciclos.map((c, index) => (
              <option key={index} value={`${c.id}:${c.activo}`}>
                {c.activo === 1
                  ? `ACTIVO ${c.numero}-${c.fechaInicio}-${c.fechaFin}`
                  : `${c.numero}-${c.fechaInicio}-${c.fechaFin}`}
              </option>
            ))}
          </Select>
        </div>
      </PopoverBody>
    </PopoverContent>
  );
};

export default CiclosGrupos;
