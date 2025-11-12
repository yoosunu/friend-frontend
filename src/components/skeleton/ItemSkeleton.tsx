import { Box, HStack, Skeleton } from "@chakra-ui/react";

export default function ItemSkeleton() {
  return (
    <Box>
      <Skeleton rounded="2xl" height={{ base: 150, md: 330 }} mb={3} />
      <HStack justifyContent={"space-between"}>
        <Skeleton rounded="lg" width="60%" height={{ base: 3, md: 5 }} mb={2} />
        <Skeleton rounded="lg" width="15%" height={{ base: 3, md: 5 }} mb={2} />
      </HStack>
      <Skeleton rounded="lg" width="40%" height={{ base: 2, md: 4 }} mb={3} />
      <Skeleton rounded="lg" width="30%" height={{ base: 2.5, md: 4 }} mb={3} />
    </Box>
  );
}
