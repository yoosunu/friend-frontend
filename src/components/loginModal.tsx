import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import SocialLogin from "./SocialLogin";
import { FaLock, FaUser } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  basicLogIn,
  IBasicLoginError,
  IBasicLoginSuccess,
  IBasicLoginVars,
} from "../api";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<
    IBasicLoginSuccess,
    IBasicLoginError,
    IBasicLoginVars
  >({
    mutationFn: basicLogIn,
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        title: "Welcome Back!",
        status: "success",
        description: data.ok,
      });
      reset();
      onClose();
      queryClient.refetchQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      toast({
        title: "LogIn Failed",
        status: "error",
        description: error.error,
      });
    },
  });
  const onSubmit = ({ username, password }: IForm) => {
    mutation.mutate({ username, password });
  };

  return (
    <Modal motionPreset="slideInRight" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Log in</ModalHeader>
        <ModalCloseButton />
        <ModalBody as={"form"} onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaUser />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.username?.message)}
                required
                {...register("username", {
                  required: true,
                })}
                variant={"filled"}
                placeholder="Username"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaLock />
                  </Box>
                }
              />

              <Input
                isInvalid={Boolean(errors.password?.message)}
                required
                {...register("password", {
                  required: true,
                })}
                type="password"
                variant={"filled"}
                placeholder="Password"
              />
            </InputGroup>
          </VStack>
          {mutation.isError ? (
            <Text color={"red.500"} textAlign={"center"} fontSize={"sm"}>
              Wrong username or password.
            </Text>
          ) : null}
          <Button
            // isLoading={mutation.status === "pending"}
            type="submit"
            marginTop={4}
            width={"100%"}
            colorScheme="green"
          >
            Login
          </Button>
          <SocialLogin />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
