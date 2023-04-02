import { useEffect, useMemo, useState } from "react";
import { errors } from "../../Constants/Error";
import { Usuario } from "../../Interfaces/Usuario";
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  useToast,
  Popover,
  PopoverTrigger,
  Portal,
} from "@chakra-ui/react";
import PopAddAdmin from "./PopAddAdmin";
import Eliminar from "./Eliminar";
const Admin = () => {
  const wsM = useMemo(() => {
    const connection = { url: "localhost:8080/server" };
    const ws = new WebSocket(`ws://${connection.url}/usuario`);
    return ws;
  }, []);

  const [admin, setAdmins] = useState<Usuario[]>([]);

  const toast = useToast();

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
        setAdmins(
          data.view.filter((user: Usuario) => user.rol === 3) as Usuario[]
        );
      }
      if (data.action === "ERROR") {
        const error = data.message.split(":")[0];
        if (error === errors.pkError) {
          toast({
            title: "ERROR",
            description: "There is already a user with this id",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } else {
          toast({
            title: "ERROR",
            description: "There was an error while fetching your request",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      }
      if (
        data.action === "UPDATE" ||
        data.action === "CREATE" ||
        data.action === "DELETE"
      ) {
        toast({
          title: "Sucess!",
          description: `Your data was ${data.action.toLowerCase()}d`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    return () => wsM.close();
  }, []);

  const addAdmin = (id: string, nombre: string, clave: string) =>
    wsM.send(
      JSON.stringify({
        action: "CREATE",
        id: parseInt(id),
        nombre: nombre,
        clave: clave,
        rol: 3,
      })
    );

  const editAdmin = (id: string, nombre: string, clave: string) =>
    wsM.send(
      JSON.stringify({
        action: "UPDATE",
        id: parseInt(id),
        nombre: nombre,
        clave: clave,
        rol: 3,
      })
    );

  const deleteAdmin = (id: string) =>
    wsM.send(
      JSON.stringify({
        action: "DELETE",
        id: parseInt(id),
      })
    );

  return (
    <div
      style={{
        display: "flex",
        width: "100vw",
        height: "90vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "60vw",
          borderWidth: "1px",
          borderRadius: "12px",
          padding: "0.75em",
        }}
      >
        <TableContainer>
          <Table variant="striped" colorScheme="linkedin">
            <TableCaption>
              {" "}
              <Popover closeOnBlur={false} placement="left" isLazy>
                {({ isOpen, onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Button colorScheme="teal" variant="ghost">
                        Click aca para agregar un admin
                      </Button>
                    </PopoverTrigger>
                    <Portal>
                      {isOpen && (
                        <PopAddAdmin
                          close={onClose}
                          cb={addAdmin}
                          titulo="Agregar Admin"
                          idAdmin=""
                          nombreAdmin=""
                          claveAdmin=""
                        />
                      )}
                    </Portal>
                  </>
                )}
              </Popover>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>Cedula</Th>
                <Th>Nombre</Th>
                <Th>Clave</Th>
                <Th>Eliminar</Th>
                <Th>Editar</Th>
              </Tr>
            </Thead>
            <Tbody>
              {admin.map((ad, index) => (
                <Tr key={index}>
                  <Td>{ad.id}</Td>
                  <Td>{ad.nombre}</Td>
                  <Td>{ad.clave}</Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left" isLazy>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              variant="outline"
                              colorScheme="red"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<DeleteIcon />}
                            />
                          </PopoverTrigger>
                          <Portal>
                            {isOpen && (
                              <Eliminar
                              onClose={onClose}
                                titulo="Admin"
                                borrarAdmin={deleteAdmin}
                                idAdmin={ad.id.toString()}
                              />
                            )}
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                  <Td>
                    <Popover closeOnBlur={false} placement="left" isLazy>
                      {({ isOpen, onClose }) => (
                        <>
                          <PopoverTrigger>
                            <IconButton
                              variant="outline"
                              colorScheme="teal"
                              aria-label="Call Sage"
                              fontSize="20px"
                              icon={<EditIcon />}
                            />
                          </PopoverTrigger>
                          <Portal>
                            {isOpen && (
                              <PopAddAdmin
                                close={onClose}
                                cb={editAdmin}
                                titulo="Editar admin"
                                idAdmin={ad.id.toString()}
                                nombreAdmin={ad.nombre}
                                claveAdmin={ad.clave}
                              />
                            )}
                          </Portal>
                        </>
                      )}
                    </Popover>
                  </Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Cedula</Th>
                <Th>Nombre</Th>
                <Th>Clave</Th>
                <Th>Eliminar</Th>
                <Th>Editar</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default Admin;
