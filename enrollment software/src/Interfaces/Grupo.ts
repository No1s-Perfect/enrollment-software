import { Ciclo } from "./Ciclo";

export interface CursitoParti {
  carrera: string;
  id: string;
  nombre: string;
}
export interface Grupo {
  numeroGrupo: number;
  curso: CursitoParti;
  ciclo: Ciclo;
  horario: string;
  profesor: number;
}
export interface Grupo2 {
  numeroGrupo: number;
  cicloSimple: number;
  cursoSimple: string;
  horario: string;
  profesor: number;
}
