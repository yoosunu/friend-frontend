import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <VStack minH="100vh" justifyContent={"center"}>
      <Heading>Page not Found.</Heading>
      <Text>Wrong url or under developing.</Text>
      <Link to="/">
        <Button colorScheme={"twitter"} variant={"solid"}>
          Go Home!
        </Button>
      </Link>
    </VStack>
  );
}
