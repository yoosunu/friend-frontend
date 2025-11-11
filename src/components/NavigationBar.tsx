import {
  Button,
  HStack,
  Stack,
  useDisclosure,
  Text,
  useBreakpointValue,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  Box,
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
      py={{ base: 0, md: 0 }}
      px={{ base: 40, md: 40 }}
      borderBottomWidth={1}
      borderBottomColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
    >
      <Drawer
        placement="top"
        size={{ base: "full", md: "lg" }}
        onClose={onClose}
        isOpen={isOpen}
      >
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
          <Button
            onClick={onOpen}
            colorScheme="green"
            py={{ base: 1, md: 3 }}
            px={{ base: 3, md: 5 }}
            fontSize={{ base: "12px", md: "16px" }}
            size="sm"
            minW="auto"
            minH="auto"
          >
            <Text mr={{ base: 1, md: 2 }}>Menu</Text>
            <Box w={{ base: 3, md: 20 }} h={{ base: 4, md: 20 }}>
              <FaBars size={"100%"} />
            </Box>
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
          <Link to={"/thanks"}>
            <Button colorScheme="green">Thanks</Button>
          </Link>
          <Link to={"/todos"}>
            <Button colorScheme="green">Todos</Button>
          </Link>
          <Link to={"/weathers"}>
            <Button colorScheme="green">Weathers</Button>
          </Link>
          <Link to={"/friend"}>
            <Button isDisabled colorScheme="red">
              Friend
            </Button>
          </Link>
        </HStack>
      )}
    </Stack>
  );
}
