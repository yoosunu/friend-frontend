import { HStack, Stack, Text, VStack, Box } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { GiPear } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <Stack
      mt={{ base: 20, md: 40 }}
      bg={"gray.700"}
      justifyContent={"space-between"}
      alignItems={"center"}
      spacing={{
        sm: 4,
        md: 0,
      }}
      py={{ base: 6, md: 12 }} // px 단위 대신 rem/Chakra responsive
      px={{ base: 4, md: 40 }}
      borderTop={"1px"}
      //   borderTopColor={"green.300"}
      direction={{
        sm: "column",
        md: "row",
      }}
      w="100%"
      mx="auto"
    >
      <HStack alignItems={"flex-end"} padding={6}>
        <Box
          w={{ base: "30px", md: "120px", lg: "150px" }}
          h={{ base: "30px", md: "120px", lg: "150px" }}
        >
          <GiPear size="100%" />
        </Box>
        <Text
          fontSize={{ base: "12px", sm: "25px", md: "35px" }}
          pb={{ base: 2, md: 4 }}
          as={"b"}
          fontStyle={"oblique"}
        >
          APOT
        </Text>
      </HStack>
      <VStack
        padding={6}
        alignItems={"flex-start"}
        spacing={1}
        mt={{ base: 4, md: 0 }}
      >
        <Text color={"gray.100"} fontSize={{ base: "8px", md: "14px" }}>
          © 2024 Jasper
        </Text>
        <Text color={"gray.100"} fontSize={{ base: "8px", md: "14px" }}>
          Designed By: Jasper
        </Text>
        <Text color={"gray.100"} fontSize={{ base: "8px", md: "14px" }}>
          Programmed By: Jasper
        </Text>
      </VStack>
      <Link
        to={"https://github.com/yoosunu"}
        style={{ width: "100%", maxWidth: 210 }}
      >
        <HStack
          px={{ base: 0, md: 4 }}
          py={{ base: 2, md: 3 }}
          w={{ base: "100%", md: "100%" }}
          maxW={{ base: "120px", md: "210px" }}
          h={{ base: "12px", md: "50px" }}
          border={"1px"}
          color={"gray.100"}
          rounded={20}
          justifyContent="center"
        >
          <Box
            w={{ base: "14px", md: "30px" }}
            h={{ base: "14px", md: "30px" }}
          >
            <FaGithub size="100%" />
          </Box>
          <Text fontSize={{ base: "8px", md: "14px" }}>
            wanna more details?
          </Text>
        </HStack>
      </Link>
    </Stack>
  );
}
