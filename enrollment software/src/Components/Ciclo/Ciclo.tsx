import React, {useState} from 'react'
import {
    Tabs, TabList, TabPanels, Tab, TabPanel 
  } from '@chakra-ui/react'
import AgregarCiclo from './AgregarCiclo';
import MantenimientoCiclo from './MantenimientoCiclo';
import "./Ciclo.css";

export const Ciclo = () => {

    return (
        <Tabs isFitted variant='soft-rounded' colorScheme='green'>
        <TabList mb='1em'>
          <Tab>Agregar Ciclo</Tab>
          <Tab>Mantenimiento de Ciclo</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <AgregarCiclo/>
          </TabPanel>
          <TabPanel>
            <MantenimientoCiclo/>
          </TabPanel>
        </TabPanels>
      </Tabs>
  )
}
