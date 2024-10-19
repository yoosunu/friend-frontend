import { Box, Skeleton } from "@chakra-ui/react";

export default function ThanksDateSkeleton() {
  return (
    <Box w={"100%"}>
      <Skeleton rounded="2xl" height={150} w={"100%"} mb={3} />
    </Box>
  );
}
