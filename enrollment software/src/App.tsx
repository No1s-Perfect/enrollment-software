import { ChakraProvider, theme } from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Carrera from "./Components/Carrera/Carrera";

import AgregarEstudiante from "./Components/Estudiantes/AgregarEstudiante";
import { Ciclo } from "./Components/Ciclo/Ciclo";
import { Cursos } from "./Components/Cursos/Cursos";
import Historial from "./Components/Estudiantes/Historial";
import SearchStudent from "./Components/Estudiantes/SearchStudent";
import Nav from "./Components/Navbar/Nav";


import Home from "./Components/Home/Home";
import Admin from "./Components/Administrador/Admin";
import Matriculador from "./Components/Matriculador/Matriculador";
import GrupoMatricula from "./Components/GrupoMatricula/GrupoMatricula";
import Login from "./Components/Login/Login";
import { loginData, MyLoginContext } from "./Components/Login/LoginContext";
import { useState } from "react";

import CursosCarrera from "./Components/Curso/CursosCarrera";
import Matricula from "./Components/Matricula/Matricula";
import OfertaAcademica from "./Components/OfertaAcademica/OfertaAcademica";
import { Profesor } from "./Components/Profesor/Profesor";
import GrupoProfesor from "./Components/Profesor/GrupoProfesor";
import useLocalStorage from "./Components/Navbar/useLocalStorage";
export const App = () => {
  const [user, setUser] = useLocalStorage(null);
  return (
    <ChakraProvider>
      <BrowserRouter>
        <MyLoginContext.Provider value={{ user, setUser }}>
          <Nav />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/oferta-academica" element={<OfertaAcademica />} />
            <Route path="/buscar-estudiante" element={<SearchStudent />} />
            <Route path="/historial/:id" element={<Historial />} />
            <Route path="/carreras" element={<Carrera />} />
            <Route path="/curso-carrera/:id" element={<CursosCarrera />} />
            <Route path="/agregar-estudiante" element={<AgregarEstudiante />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/profesor" element={<Profesor />} />
            <Route path="/ciclo" element={<Ciclo />} />
            <Route path="/seguridad/admin" element={<Admin />} />
            <Route path="/seguridad/matriculador" element={<Matriculador />} />
            <Route path="/grupo/:id" element={<GrupoMatricula />} />
            <Route path="/mis-grupos" element={<GrupoProfesor />} />
            <Route path="/matricula/:id/:carrera" element={<Matricula />} />
          </Routes>
        </MyLoginContext.Provider>
      </BrowserRouter>
    </ChakraProvider>
  );
};
