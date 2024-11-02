import {
  Avatar,
  Box,
  Button,
  FormControl,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatDetails, IChatPostVars, postChatDetail } from "../../api";
import { useParams } from "react-router-dom";
import { IChat } from "../types";
import useUser from "../../lib/useUser";
import { useForm } from "react-hook-form";
import { FaPaperPlane } from "react-icons/fa";
import { useEffect } from "react";

export default function ChatDetail() {
  const queryClient = useQueryClient();
  const { chatRoomName } = useParams<{ chatRoomName: string }>();
  const { user, isLoggedIn, userLoading } = useUser();
  const { isLoading, data } = useQuery<IChat[]>({
    queryKey: ["chatDetails", chatRoomName],
    queryFn: getChatDetails,
  });
  const { register, handleSubmit, reset } = useForm<IChatPostVars>();
  const mutation = useMutation({
    mutationFn: postChatDetail,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["chatDetails", chatRoomName],
      });
      reset({ chat: "" });
    },
  });
  const onSubmit = (data: IChatPostVars) => {
    mutation.mutate(data);
  };
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["chatDetails", chatRoomName] });
  }, []);
  return (
    <>
      <VStack
        borderBottom={"1px"}
        borderColor={"green.400"}
        pt={{ base: 0, lg: 20 }}
        mt={10}
        px={{
          base: 6,
          lg: 80,
        }}
        overflowY={"auto"}
        h={{ base: 450, lg: 600 }}
      >
        {isLoading || userLoading ? (
          <Spinner />
        ) : (
          data?.map((chat) => (
            <Box
              key={chat.id}
              w={"100%"}
              display="flex"
              justifyContent={
                chat.user.name === user?.name ? "flex-end" : "flex-start"
              }
            >
              <HStack>
                {chat.user.name === user?.name ? (
                  <Box mb={2}>
                    <Text fontSize={12}>{chat.created_at}</Text>
                  </Box>
                ) : null}
                <Box
                  mb={10}
                  rounded={"3xl"}
                  shadow={"xl"}
                  bgColor={
                    chat.user.name === user?.name ? "green.400" : undefined
                  }
                >
                  <HStack
                    pl={chat.user.name === user?.name ? 4 : 0}
                    pr={chat.user.name === user?.name ? 0 : 4}
                  >
                    {chat.user.name === user?.name ? null : (
                      <Avatar
                        border={"1px"}
                        name={chat.user.name}
                        src={chat.user.profile_image}
                        size={"md"}
                      />
                    )}

                    <Box>
                      <Text
                        color={
                          chat.user.name === user?.name ? "black" : undefined
                        }
                      >
                        {chat.chat}
                      </Text>
                    </Box>

                    {chat.user.name === user?.name ? (
                      <Avatar
                        border={"1px"}
                        name={chat.user.name}
                        src={chat.user.profile_image}
                        size={"md"}
                      />
                    ) : null}
                  </HStack>
                </Box>
                {chat.user.name === user?.name ? null : (
                  <Box mb={2}>
                    <Text fontSize={12}>{chat.created_at}</Text>
                  </Box>
                )}
              </HStack>
            </Box>
          ))
        )}
      </VStack>
      <Box
        px={{
          base: 6,
          lg: 80,
        }}
      >
        <FormControl mt={{ base: 4, lg: 16 }}>
          <HStack>
            <Input
              border={"1px"}
              borderColor={"green.400"}
              rounded={"3xl"}
              {...register("chat", { required: true })}
              placeholder=""
              type="text"
            />
            <Button
              onClick={handleSubmit(onSubmit)}
              rounded={"3xl"}
              colorScheme="green"
            >
              <FaPaperPlane />
            </Button>
          </HStack>
        </FormControl>
        <FormControl>
          <Input
            type="hidden"
            {...register("chatRoomName", { value: chatRoomName })}
          />
        </FormControl>
      </Box>
    </>
  );
}
