import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Spinner,
  Checkbox,
  Grid,
  HStack,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteChatRoom,
  getChats,
  getUsers,
  IDeleteChatRoomVar,
  IPostChatRoomSuccess,
  IPostChatRoomVars,
  postChatRoom,
} from "../../api";
import { IChatRooms } from "../types";
import Chat from "../Chat";
import ChatSkeleton from "../skeleton/ChatSkeleton";
import { useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useUser from "../../lib/useUser";
import { useEffect } from "react";

interface IUser {
  id: string;
  name: string;
  profile_image: string;
}

export default function Chats() {
  const queryClient = useQueryClient();
  const { userLoading, isLoggedIn, user: me } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { isLoading: isUserLoading, data: users } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: getUsers,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isInfoOpen,
    onOpen: onInfoOpen,
    onClose: onInfoClose,
  } = useDisclosure();
  const { register, handleSubmit, watch } = useForm<IPostChatRoomVars>();
  const { register: deleteRegister, handleSubmit: handleDeleteSubmit } =
    useForm<IDeleteChatRoomVar>();
  const { isLoading, data } = useQuery<IChatRooms[]>({
    queryKey: ["chatRooms"],
    queryFn: getChats,
  });
  const mutation = useMutation<IPostChatRoomSuccess, any, IPostChatRoomVars>({
    mutationFn: postChatRoom,
    onMutate: () => {},
    onSuccess: (data: any) => {
      navigate(`@${data.name}`);
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: `something wrong`,
      });
    },
  });

  const onSubmit = (data: IPostChatRoomVars) => {
    mutation.mutate(data);
  };

  const deleteMutation = useMutation<any, any, IDeleteChatRoomVar>({
    mutationFn: deleteChatRoom,
    onMutate: () => {},
    onSuccess: () => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Chat room deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["chatRooms"] });
      onInfoClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: `something wrong`,
      });
    },
  });

  const onDeleteSubmit = (data: IDeleteChatRoomVar) => {
    deleteMutation.mutate(data);
  };

  return (
    <>
      <VStack
        py={20}
        mt={10}
        px={{
          base: 10,
          lg: 40,
        }}
      >
        {isLoading ? (
          <>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </>
        ) : null}
        <Button onClick={onOpen} colorScheme={"green"}>
          Add New<Box px={1}></Box> <FaPlus />
        </Button>
        {data && data.length === 0 && !isLoading ? (
          <Text>No ChatRoom</Text>
        ) : (
          data?.map((chat) => (
            <Box key={chat.id} w={"100%"} onClick={onInfoOpen}>
              <Chat
                id={chat.id}
                name={chat.name}
                lastChat={chat.lastChat}
                owner={chat.owner.name}
                hmp={chat.hmp}
              />
              <Drawer
                aria-hidden={false}
                useInert={false}
                placement="bottom"
                size={"lg"}
                onClose={onInfoClose}
                isOpen={isInfoOpen}
              >
                <DrawerOverlay />
                <DrawerContent>
                  <DrawerHeader borderBottomWidth="1px">
                    ChatRoom Info
                  </DrawerHeader>
                  <DrawerBody>
                    <VStack alignItems={"flex-start"}>
                      <Box>
                        <Text as={"b"}>Name</Text>
                      </Box>
                      <Box mb={8}>
                        <Text>{chat.name}</Text>
                      </Box>
                      <Box>
                        <Text as={"b"}>People</Text>
                      </Box>
                      <Box mb={8}>
                        {chat.people.map((p) => (
                          <Box key={p.length}>{`${p} `}</Box>
                        ))}
                      </Box>
                      <Box>
                        <Text as={"b"}>Owner</Text>
                      </Box>
                      <Box>
                        <Text>{chat.owner.name}</Text>
                      </Box>
                    </VStack>
                    <HStack mb={6}>
                      <Button
                        w={"100%"}
                        colorScheme="green"
                        mt={10}
                        onClick={() => navigate(`@${chat.name}`)}
                      >
                        Go to chat
                      </Button>
                      <Button
                        w={"100%"}
                        colorScheme="red"
                        mt={10}
                        onClick={handleDeleteSubmit(onDeleteSubmit)}
                      >
                        Delete
                      </Button>
                    </HStack>
                    <FormControl>
                      <Input
                        type="hidden"
                        {...deleteRegister("name", {
                          required: true,
                          value: chat.name,
                        })}
                      />
                    </FormControl>
                  </DrawerBody>
                </DrawerContent>
              </Drawer>
            </Box>
          ))
        )}
      </VStack>
      <Modal
        aria-hidden={false}
        useInert={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add ChatRoom</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <FormControl mb={10}>
              <FormLabel>Name</FormLabel>
              <Input
                {...register("name", { required: false })}
                placeholder="name of the chatroom"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Users</FormLabel>
              {isUserLoading ? (
                <Spinner />
              ) : (
                <Grid templateColumns={"1fr 1fr"} gap={4}>
                  {users?.map((user) => (
                    <Checkbox
                      key={user.id}
                      {...register("users", { required: false })}
                      value={user.id}
                    >
                      <Text color={me?.name === user.name ? "blue" : undefined}>
                        {user.name}
                      </Text>
                    </Checkbox>
                  ))}
                </Grid>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit(onSubmit)}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
