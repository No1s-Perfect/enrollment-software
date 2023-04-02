import { Ciclo } from "./Ciclo";


export interface Matricula{
    grupo:number;
    alumno:number;
    id:number;
    nota:number;
    nombreCurso?:string
    ciclo:Ciclo
}