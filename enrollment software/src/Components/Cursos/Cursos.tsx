import React, {useState} from 'react'
import {
    Tabs, TabList, TabPanels, Tab, TabPanel 
  } from '@chakra-ui/react'
import AgregarCursos from './AgregarCursos';
import MantenimientoCursos from './MantenimientoCursos';
import "./Cursos.css";

export const Cursos = () => {

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
        <TabList mb='1em'>
          <Tab>Agregar Cursos</Tab>
          <Tab>Mantenimiento de Cursos</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AgregarCursos/>
          </TabPanel>
          <TabPanel>
            <MantenimientoCursos/>
          </TabPanel>
        </TabPanels>
      </Tabs>
  )
}
