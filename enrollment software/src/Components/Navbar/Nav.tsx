import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Avatar,
  MenuItem,
  MenuDivider,
  Center,
  MenuList,
  Menu,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import { ColorModeSwitcher } from "../../ColorModeSwitcher";
import { useNavigate } from "react-router-dom";
import { loginData, useLoginContext } from "../Login/LoginContext";
import img from "../Img/mat.png";
import { useEffect, useState } from "react";
const Nav = () => {
  const navigate = useNavigate();
  const { isOpen, onToggle } = useDisclosure();
  const { user, setUser } = useLoginContext();
  const [userName, setUserName] = useState<string>('')

  useEffect(()=>{

    if(user){
      if(user.rol===1){
        setUserName('Estudiante')
      }
      if(user.rol===2){
        setUserName('Profesor')
      }
      if(user.rol===3){
        setUserName('Admin')
      }
      if(user.rol===4){
        setUserName('Matriculador')
      }
    }
  },[user])
  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <img src={img} alt="user_photo" width="70" height="70" />

          <Flex display={{ base: "none", md: "flex" }} align="center" ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>

        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-end"}
          direction={"row"}
          spacing={6}
        >
          <ColorModeSwitcher />

          <Button
            display={{ base: "none", md: "inline-flex" }}
            fontSize={"sm"}
            fontWeight={600}
            onClick={() => {
              if (user && user?.id !== -1) {
                setUser({ id: -1 } as loginData);
                navigate("/");
              } else {
                navigate("/login");
              }
            }}
            color={"white"}
            bg={"pink.400"}
            _hover={{
              bg: "pink.300",
            }}
          >
            {user && user?.id !== -1 ? `${userName} Logout` : "Iniciar sesion"}
          </Button>
        </Stack>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
};

export default Nav;
