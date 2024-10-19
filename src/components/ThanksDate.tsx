import { Box, Grid, Text, HStack, Heading } from "@chakra-ui/react";
import { FaUserTie } from "react-icons/fa";
import { Link } from "react-router-dom";

interface ITDProps {
  id: string;
  user: string;
  preview: string;
  created_at: string;
}

export default function ThanksDate({
  id,
  user,
  preview,
  created_at,
}: ITDProps) {
  return (
    <Link to={`/thanks/${id}`}>
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
            {preview}
          </Heading>
          <HStack
            _hover={{
              color: "red.500",
            }}
            spacing={1}
          >
            <FaUserTie size={15} />
            <Text>{user}</Text>
          </HStack>
          <Text>{created_at}</Text>
        </Grid>
      </Box>
    </Link>
  );
}
