import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api";
import { IUser } from "../types";
import {
  Spinner,
  VStack,
  Text,
  Avatar,
  Box,
  Grid,
  Container,
  HStack,
} from "@chakra-ui/react";

export default function Profile() {
  const { isLoading, data } = useQuery<IUser>({
    queryKey: ["me"],
    queryFn: getMe,
  });
  let formattedDate: string = "";
  if (!isLoading) {
    const dateStr = data?.date_joined;
    const date = new Date(dateStr!);
    formattedDate = date.toLocaleDateString();
  }

  return (
    <Box mt={20} px={{ base: 2, lg: 40 }}>
      {isLoading ? (
        <Spinner />
      ) : (
        <Container rounded={"2xl"} p={10} shadow={"2xl"}>
          <HStack>
            <Avatar
              border={"1px"}
              name={data?.name}
              src={data?.profile_image}
              size={"2xl"}
            />
            <VStack ml={20} display={"flex"} alignItems={"flex-start"}>
              <HStack>
                <Text>Name:</Text>
                <Text>{data?.name}</Text>
              </HStack>
              <HStack>
                <Text>Username:</Text>
                <Text>{data?.username}</Text>
              </HStack>
              <HStack>
                <Text>Email:</Text>
                <Text>{data?.email}</Text>
              </HStack>
              <HStack>
                <Text>Joined:</Text>
                <Text>{formattedDate}</Text>
              </HStack>
              <HStack>
                <Text>Gender:</Text>
                <Text>{data?.gender}</Text>
              </HStack>
              <HStack>
                <Text>From:</Text>
                <Text>{data?.language.toUpperCase()}</Text>
              </HStack>
            </VStack>
          </HStack>
        </Container>
      )}
    </Box>
  );
}
