import { Box, VStack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { getTDs } from "../../api";
import { ITDs } from "../types";
import ThanksDate from "../ThanksDate";
import ThanksDateSkeleton from "../skeleton/ThanksDateSkeleton";

export default function ThanksDates() {
  const { isLoading, data } = useQuery<ITDs[]>({
    queryKey: ["thanksDates"],
    queryFn: getTDs,
  });
  return (
    <VStack
      py={20}
      mt={10}
      px={{
        base: 24,
        lg: 40,
      }}
    >
      {isLoading ? (
        <>
          <ThanksDateSkeleton />
          <ThanksDateSkeleton />
          <ThanksDateSkeleton />
        </>
      ) : null}
      {data?.map((thanksDate) => (
        <Box key={thanksDate.id} w={"100%"}>
          <ThanksDate
            id={thanksDate.id}
            preview={thanksDate.preview}
            user={thanksDate.user.name}
            created_at={thanksDate.created_at}
          />
        </Box>
      ))}
    </VStack>
  );
}
