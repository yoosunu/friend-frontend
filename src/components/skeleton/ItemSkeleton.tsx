import { Box, HStack, Skeleton } from "@chakra-ui/react";

export default function ItemSkeleton() {
  return (
    <Box>
      <Skeleton rounded="2xl" height={330} mb={3} />
      <HStack justifyContent={"space-between"}>
        <Skeleton rounded="lg" width="60%" height={5} mb={2} />
        <Skeleton rounded="lg" width="15%" height={5} />
      </HStack>
      <Skeleton rounded="lg" width="40%" height={4} mb={3} />
      <Skeleton rounded="lg" width="30%" height={4} mb={3} />
    </Box>
  );
}