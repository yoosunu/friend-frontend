import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../api";
import { IUser } from "../types";
import { Spinner, VStack, Text, Avatar } from "@chakra-ui/react";

export default function Profile() {
  const { isLoading, data } = useQuery<IUser>(["me"], getMe);

  return (
    <VStack>
      {isLoading ? (
        <Spinner />
      ) : (
        <VStack>
          <Text>{data?.name}</Text>
          <Text>{data?.username}</Text>
          <Text>{data?.email}</Text>
          <Text>{data?.is_host}</Text>
          <Text>{data?.date_joined}</Text>
          <Avatar
            border={"1px"}
            name={data?.name}
            src={data?.profile_image}
            size={"2xl"}
          />
          <Text>{data?.gender}</Text>
          <Text>{data?.language}</Text>
        </VStack>
      )}
    </VStack>
  );
}
