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
  useToast,
  VStack,
} from "@chakra-ui/react";
import SocialLogin from "./SocialLogin";
import { FaLock, FaUser, FaEnvelope } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { ISignUpError, ISignUpSuccess, ISignUpVars, signUp } from "../api";

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ISignUpForm {
  username: string;
  password: string;
  email: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignUpForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<ISignUpSuccess, ISignUpError, ISignUpVars>({
    mutationFn: signUp,
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        title: "Signed Up!",
        status: "success",
        description: data.ok,
      });
      reset();
      onClose();
      queryClient.refetchQueries({ queryKey: ["me"] });
    },
    onError: (error) => {
      toast({
        title: "SignUp Failed",
        status: "error",
        description: error.error,
      });
    },
  });
  const onSubmit = ({ username, password, email }: ISignUpForm) => {
    mutation.mutate({ username, password, email });
  };
  return (
    <Modal motionPreset="slideInRight" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign Up</ModalHeader>
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
                variant={"filled"}
                placeholder="Username"
                required
                {...register("username", {
                  required: true,
                })}
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
                variant={"filled"}
                type="password"
                placeholder="Password"
              />
            </InputGroup>

            <InputGroup>
              <InputLeftElement
                children={
                  <Box color={"gray.500"}>
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.email?.message)}
                required
                {...register("email", {
                  required: true,
                })}
                variant={"filled"}
                type="email"
                placeholder="Email"
              />
            </InputGroup>
          </VStack>
          <Button
            // isLoading={mutation.status === "pending"}
            type="submit"
            marginTop={4}
            width={"100%"}
            colorScheme="green"
          >
            Sign Up
          </Button>
          <SocialLogin />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
