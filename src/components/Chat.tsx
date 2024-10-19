import { Box, Grid, Text, HStack, Heading, VStack } from "@chakra-ui/react";
import { FaCrown, FaUserTie } from "react-icons/fa";

interface IChatProps {
  id: string;
  owner: string;
  name: string;
  lastChat: string;
  hmp: number;
}

export default function Chat({ id, owner, name, lastChat, hmp }: IChatProps) {
  return (
    <Box
      shadow={"xl"}
      w={"100%"}
      cursor={"pointer"}
      rounded={"xl"}
      px={10}
      py={8}
    >
      <Grid templateColumns={"10fr 1fr"}>
        <Heading as={"b"} noOfLines={1} fontSize={"lg"} mb={4}>
          {name}
        </Heading>
        <VStack>
          <HStack
            _hover={{
              color: "red.500",
            }}
            spacing={1}
          >
            <FaCrown size={15} />
            <Text>{owner}</Text>
          </HStack>
          <HStack
            _hover={{
              color: "red.500",
            }}
            spacing={1}
          >
            <FaUserTie size={15} />
            <Text>{hmp}</Text>
          </HStack>
        </VStack>
      </Grid>
      <Text fontSize={"s"} noOfLines={1}>
        {lastChat}
      </Text>
    </Box>
  );
}
