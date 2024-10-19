import { useQuery } from "@tanstack/react-query";
import { ITodos } from "../types";
import { getTodos } from "../../api";
import { Box, Button, Grid, Spinner, VStack } from "@chakra-ui/react";
import Todo from "../Todo";

export default function Todos() {
  const { isLoading, data } = useQuery<ITodos[]>({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  return (
    <VStack
      px={{
        // base: 24,
        lg: 40,
      }}
    >
      <Grid
        borderColor={"green.400"}
        rounded={"2xl"}
        py={20}
        mt={10}
        px={{
          // base: 24,
          lg: 80,
        }}
        templateColumns={{
          sm: "1fr",
          md: "1fr 1fr",
          lg: "repeat(3, 1fr)",
        }}
      >
        {isLoading ? <Spinner size={"xl"} /> : null}
        {data === undefined && !isLoading ? (
          <Button colorScheme={"blue"}>Add New</Button>
        ) : (
          data?.map((todo) => (
            <Box key={todo.id} mb={20}>
              <Todo
                id={todo.id}
                name={todo.name}
                everydays={todo.everydays}
                plans={todo.plans}
              />
            </Box>
          ))
        )}
      </Grid>
    </VStack>
  );
}
