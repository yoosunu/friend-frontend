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
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
  ToastId,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";
import { GiPear } from "react-icons/gi";
import LoginModal from "./loginModal";
import SignUpModal from "./SignUpModal";
import NotificationButton from "./PushButton";
import { Link } from "react-router-dom";
import useUser from "../lib/useUser";
import { logOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";

export default function HomeHeader() {
  const { userLoading, isLoggedIn, user } = useUser();
  const {
    isOpen: isLoginOpen,
    onClose: OnLoginClose,
    onOpen: OnLoginOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const logoColor = useColorModeValue("green.500", "green.200");
  const Icon = useColorModeValue(FaMoon, FaSun);
  const toast = useToast();
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();
  const mutation = useMutation({
    mutationFn: logOut,
    onMutate: () => {
      toastId.current = toast({
        status: "loading",
        title: "Wait please...",
        description: "Login out...",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries({ queryKey: ["me"] });
        toast.update(toastId.current, {
          status: "success",
          title: "Done!",
          description: "LogOut succeed.",
        });
      }
    },
    onError: () => {
      toast({
        status: "success",
        title: "Done!",
        description: "LogOut succeed.",
      });
    },
  });
  const onLogOut = () => {
    mutation.mutate();
  };

  return (
    <Stack
      justifyContent={"space-between"}
      alignItems={"center"}
      spacing={{
        sm: 3,
        md: 0,
      }}
      py={"5"}
      px={40}
      borderBottomWidth={1}
      borderBottomColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
    >
      <Link to={"/"}>
        <Box color={logoColor}>
          <HStack alignItems={"center"}>
            <GiPear size={"48px"} />
            <Text as={"b"} fontSize={"28px"} fontStyle={"oblique"}>
              Apot
            </Text>
          </HStack>
        </Box>
      </Link>
      <HStack spacing={2}>
        <IconButton
          // onClick={}
          variant="ghost"
          aria-label="Toggle dark mode"
          icon={<NotificationButton />}
        ></IconButton>
        <IconButton
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle dark mode"
          icon={<Icon />}
        ></IconButton>
        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button bgColor={"gray.300"} onClick={OnLoginOpen}>
                Log in
              </Button>
              <Button onClick={onSignUpOpen} colorScheme="green">
                Sign Up
              </Button>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Avatar
                  border={"1px"}
                  name={user?.name}
                  src={user?.profile_image}
                  size={"md"}
                />
              </MenuButton>
              <MenuList>
                {user?.is_host === true ? (
                  <Link to={"/notifications"}>
                    <MenuItem>Notifications</MenuItem>
                  </Link>
                ) : null}
                {user?.is_host === true ? (
                  <Link to={"/items/upload"}>
                    <MenuItem>Upload Item</MenuItem>
                  </Link>
                ) : null}
                <Link to={"/users/me"}>
                  <MenuItem>profile</MenuItem>
                </Link>
                <Link to={"/wishlist"}>
                  <MenuItem>wishlist</MenuItem>
                </Link>
                <MenuItem onClick={onLogOut}>Log out</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <LoginModal isOpen={isLoginOpen} onClose={OnLoginClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
