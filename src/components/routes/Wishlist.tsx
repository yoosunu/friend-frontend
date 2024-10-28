import {
  Box,
  HStack,
  Spinner,
  Text,
  Img,
  VStack,
  Stack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getWishlist } from "../../api";
import { IWishlist } from "../types";
import { FaStar } from "react-icons/fa";

export default function Wishlist() {
  const { isLoading, data } = useQuery<IWishlist[]>(["wishlist"], getWishlist);
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      mt={20}
      px={{ base: 10, lg: 40 }}
    >
      {isLoading ? (
        <Spinner />
      ) : data?.length === 0 ? (
        "Wishlist is Blank"
      ) : (
        data?.map((wish) => (
          <Stack
            direction={{
              sm: "column",
              md: "row",
            }}
            key={wish.pk}
          >
            {wish.items.map((i) => (
              <Box
                px={{ base: 10, lg: 10 }}
                py={10}
                rounded={"2xl"}
                shadow={"2xl"}
                key={i.id}
              >
                <Stack
                  direction={{
                    sm: "column",
                    md: "row",
                  }}
                  justifyContent={"space-evenly"}
                  alignItems={"center"}
                >
                  <Box
                    maxH={"250"}
                    maxW={"250"}
                    rounded={"3xl"}
                    overflow={"hidden"}
                    mb={{ base: 4 }}
                  >
                    {i.photos.slice(0, 1).map((p) => (
                      <Img
                        key={p.id}
                        rounded={"3xl"}
                        minH={"200"}
                        minW={"200"}
                        src={p.file}
                      />
                    ))}
                  </Box>
                  <VStack textAlign={"center"} maxW={"200"}>
                    <Text>{i.title}</Text>
                    <Text>{i.language}</Text>
                    <Text noOfLines={1}>{i.description}</Text>
                    <HStack>
                      <FaStar />
                      <Text noOfLines={1}>{i.rating}</Text>
                    </HStack>
                  </VStack>
                </Stack>
              </Box>
            ))}
          </Stack>
        ))
      )}
    </Box>
  );
}
