import React, {useState} from 'react'
import {
    Tabs, TabList, TabPanels, Tab, TabPanel 
  } from '@chakra-ui/react'
import AgregarProfesor from './AgregarProfesor';
import MantenimientoProfesor from './MantenimientoProfesor';
import "./Profesor.css";

export const Profesor = () => {

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
        <TabList mb='1em'>
          <Tab>Agregar Profesor</Tab>
          <Tab>Mantenimiento de Profesores</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AgregarProfesor/>
          </TabPanel>
          <TabPanel>
            <MantenimientoProfesor/>
          </TabPanel>
        </TabPanels>
      </Tabs>
  )
}
