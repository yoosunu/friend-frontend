import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { IEveryday, ITodos } from "../types";
import {
  deleteTodo,
  getTodos,
  IDeleteTodoVar,
  IPostTodoVar,
  postTodo,
  putEveryday,
} from "../../api";
import {
  Box,
  Button,
  Spinner,
  VStack,
  Heading,
  useToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import Todo from "../Todo";
import { FaBars, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";

export default function Todos() {
  const {
    isOpen: isTodoPostOpen,
    onOpen: onTodoPostOpen,
    onClose: onTodoPostClose,
  } = useDisclosure();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isLoading, data } = useQuery<ITodos[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  const { register: todoPostRegister, handleSubmit: handleTodoPostSubmit } =
    useForm<IPostTodoVar>();
  const { register: todoDeleteRegister, handleSubmit: handleTodoDeleteSubmit } =
    useForm<IDeleteTodoVar>();

  const mutation = useMutation<any, any, IPostTodoVar>(postTodo, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Todo List created",
      });
      queryClient.invalidateQueries(["todos"]);
      onTodoPostClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "something Wrong",
      });
    },
  });
  const onTodoPostSubmit = (data: IPostTodoVar) => {
    mutation.mutate(data);
  };
  const deleteMutation = useMutation<any, any, IDeleteTodoVar>(deleteTodo, {
    onMutate: () => {},
    onSuccess: () => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Todo List deleted",
      });
      queryClient.invalidateQueries(["todos"]);
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "something Wrong",
      });
    },
  });
  const onTodoDeleteSubmit = (data: IDeleteTodoVar) => {
    deleteMutation.mutate(data);
  };
  return (
    <VStack alignItems={"center"} py={20}>
      <Button onClick={onTodoPostOpen} colorScheme="green" mb={20}>
        Add Todo
        <Box ml={2}>
          <FaPlus />
        </Box>
      </Button>
      {isLoading ? (
        <Spinner size={"xl"} />
      ) : (
        data?.map((todo) => (
          <VStack key={todo.id} alignItems={"center"}>
            <Box
              border={"1px"}
              borderColor={"green.400"}
              rounded={"2xl"}
              mb={10}
            >
              <Menu>
                <VStack>
                  <MenuButton
                    shadow={"xl"}
                    pl={4}
                    pr={4}
                    pb={7}
                    rounded={"2xl"}
                    position={"relative"}
                  >
                    <Heading>{todo.name}</Heading>
                    <Box
                      mt={3}
                      display={"flex"}
                      justifyContent={"center"}
                      right={0}
                      roundedBottom={"xl"}
                      position={"absolute"}
                      w={"100%"}
                      backgroundColor={"green.400"}
                    >
                      <FaBars color="white" />
                    </Box>
                  </MenuButton>
                </VStack>
                <MenuList>
                  <MenuItem
                    onClick={handleTodoDeleteSubmit(onTodoDeleteSubmit)}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
                <FormControl>
                  <Input
                    type="hidden"
                    {...todoDeleteRegister("id", { required: true })}
                    value={todo.id}
                  />
                </FormControl>
              </Menu>
            </Box>
            <Box mb={20}>
              <Todo
                id={todo.id}
                name={todo.name}
                everydays={todo.everydays}
                plans={todo.plans}
              />
            </Box>
          </VStack>
        ))
      )}
      <Modal isOpen={isTodoPostOpen} onClose={onTodoPostClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>name</FormLabel>
              <Input
                {...todoPostRegister("name", { required: true })}
                mb={10}
                placeholder="name of the Todo List"
              />
            </FormControl>
            <Button
              w={"100%"}
              colorScheme="green"
              mr={3}
              onClick={handleTodoPostSubmit(onTodoPostSubmit)}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
