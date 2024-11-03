import { Box, Divider, Text, Button, VStack, HStack } from "@chakra-ui/react";
import { FaComment, FaGithub } from "react-icons/fa";

export default function SocialLogin() {
  const kakaoParams = {
    client_id: "d61bd1307b18eb8a40650bfed90a8131",
    redirect_uri: "http://backend.apot.pro/social/kakao",
    response_type: "code",
  };
  const params = new URLSearchParams(kakaoParams).toString();
  return (
    <Box>
      <HStack my={8}>
        <Divider />
        <Text
          color={"gray.500"}
          fontSize={"xs"}
          as={"b"}
          textTransform={"uppercase"}
        >
          Or
        </Text>
        <Divider />
      </HStack>
      <VStack>
        <Button
          as={"a"}
          href="https://github.com/login/oauth/authorize?client_id=Ov23liEyST7si3OeL9D7&scope=read:user,user:email"
          width={"100%"}
          leftIcon={<FaGithub />}
        >
          Continue with Github
        </Button>
        <Button
          isDisabled={true}
          // as={"a"}
          // href={`https://kauth.kakao.com/oauth/authorize?${params}`}
          width={"100%"}
          colorScheme="yellow"
          leftIcon={<FaComment />}
        >
          Continue with Kakao
        </Button>
      </VStack>
    </Box>
  );
}
