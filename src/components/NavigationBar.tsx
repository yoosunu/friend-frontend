import {
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  Text,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
} from "@chakra-ui/react";
import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HomeNavigationBar() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Stack
      justifyContent={"flex-start"}
      alignItems={"center"}
      spacing={{
        sm: 3,
        md: 0,
      }}
      py={"0"}
      px={40}
      borderBottomWidth={1}
      borderBottomColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
    >
      <Drawer placement="top" size={"lg"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Menu Bar</DrawerHeader>
          <DrawerBody>
            <Grid templateColumns={"repeat(3, 1fr)"} rowGap={4}>
              <Link to={"/"}>
                <Button shadow={"2xl"}>Home</Button>
              </Link>
              <Link to={"/chats"}>
                <Button>Chats</Button>
              </Link>
              <Link to={"/friend"}>
                <Button>Friend</Button>
              </Link>
              <Link to={"/thanks"}>
                <Button>Thanks</Button>
              </Link>
              <Link to={"/todos"}>
                <Button>Todos</Button>
              </Link>
              <Link to={"/weathers"}>
                <Button>Weathers</Button>
              </Link>
            </Grid>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {isMobile ? (
        <HStack>
          <Button onClick={onOpen} colorScheme="green">
            <Text mr={2}>Menu</Text>
            <FaBars />
          </Button>
        </HStack>
      ) : (
        <HStack>
          <Link to={"/"}>
            <Button colorScheme="green">Home</Button>
          </Link>
          <Link to={"/chats"}>
            <Button colorScheme="green">Chats</Button>
          </Link>
          <Link to={"/friend"}>
            <Button colorScheme="green">Friend</Button>
          </Link>
          <Link to={"/thanks"}>
            <Button colorScheme="green">Thanks</Button>
          </Link>
          <Link to={"/todos"}>
            <Button colorScheme="green">Todos</Button>
          </Link>
          <Link to={"/weathers"}>
            <Button colorScheme="green">Weathers</Button>
          </Link>
        </HStack>
      )}
    </Stack>
  );
}
