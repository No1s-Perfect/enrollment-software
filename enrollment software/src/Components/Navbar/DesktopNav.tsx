import {
  Box,
  Stack,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
} from "@chakra-ui/react";
import { NAV_ITEMS } from "../../Constants/NavBarItems";
import DesktopSubNav from "./DesktopSubNav";
import { Link as ReactRouteLink } from "react-router-dom";
import { useLoginContext } from "../Login/LoginContext";
const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  const { user } = useLoginContext();
  
  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.filter(
        (navItem) => navItem.rol.includes(user?.rol ?? -1)
      ).map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Link
                as={ReactRouteLink}
                to={
                  user?.rol === 1 && navItem.label === "Mi historial"
                    ? `${navItem.href}${user?.id}`
                    : navItem.href ?? "#"
                }
                p={2}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Link>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

export default DesktopNav;
