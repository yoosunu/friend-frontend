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
      py={{ base: 5, md: "5" }}
      px={{ base: 5, md: 40 }}
      borderBottomWidth={1}
      borderBottomColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
    >
      <Link to={"/"}>
        <HStack alignItems={"center"} color={logoColor}>
          <GiPear size={"48px"} />
          <Text
            as={"b"}
            fontSize={{ base: 24, md: "28px" }}
            fontStyle={"oblique"}
          >
            Apot
          </Text>
        </HStack>
      </Link>
      <HStack spacing={2} paddingBottom={0}>
        {!userLoading ? (
          !isLoggedIn ? null : (
            <IconButton
              // onClick={}
              variant="ghost"
              aria-label="Toggle dark mode"
              icon={<NotificationButton />}
            ></IconButton>
          )
        ) : null}
        <IconButton
          padding={4}
          fontSize={16}
          size={"100%"}
          onClick={toggleColorMode}
          variant="ghost"
          aria-label="Toggle dark mode"
          icon={<Icon />}
        ></IconButton>
        {!userLoading ? (
          !isLoggedIn ? (
            <>
              <Button
                w={{ base: 15, md: 24 }}
                h={{ base: 7, md: 10 }}
                bgColor={"gray.300"}
                onClick={OnLoginOpen}
              >
                <Text fontSize={{ base: 8, md: 16 }}>Log in</Text>
              </Button>

              <Button
                w={{ base: 15, md: 24 }}
                h={{ base: 7, md: 10 }}
                onClick={onSignUpOpen}
                colorScheme="green"
              >
                <Text fontSize={{ base: 8, md: 16 }}>Sign Up</Text>
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
