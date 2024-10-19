import { HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { GiPear } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Stack
      mt={40}
      bg={"gray.700"}
      justifyContent={"space-between"}
      alignItems={"center"}
      spacing={{
        sm: 3,
        md: 0,
      }}
      py={"50"}
      px={40}
      borderTop={"1px"}
      //   borderTopColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
    >
      <HStack alignItems={"flex-end"}>
        <GiPear size={"150px"} />
        <Text fontSize={"35px"} pb={4} as={"b"} fontStyle={"oblique"}>
          APOT
        </Text>
      </HStack>
      <VStack alignItems={"flex-start"}>
        <Text color={"gray.100"}>© 2024 Jasper</Text>
        <Text color={"gray.100"}>Designed By: Jasper</Text>
        <Text color={"gray.100"}>Programmed By: Jasper</Text>
      </VStack>
      <Link to={"https://github.com/yoosunu"}>
        <HStack
          px={"10px"}
          w={"210px"}
          h={"50px"}
          border={"1px"}
          color={"gray.100"}
          rounded={20}
        >
          <FaGithub size={"30"} />
          <Text>wanna more details?</Text>
        </HStack>
      </Link>
    </Stack>
  );
}
