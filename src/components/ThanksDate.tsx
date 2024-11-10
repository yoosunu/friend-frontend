import {
  Box,
  Grid,
  Text,
  HStack,
  Heading,
  useDisclosure,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ITDs } from "./types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTD } from "../api";

interface ITDProps {
  id: string;
  user: string;
  preview: string;
  created_at: string;
}

export default function ThanksDate({ id, preview, created_at }: ITDProps) {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const dateStr = created_at;
  const created_date = new Date(dateStr!);
  const formattedDate = created_date.toLocaleString();

  const {
    onOpen: onInfoOpen,
    onClose: onInfoClose,
    isOpen: isInfoOpen,
  } = useDisclosure();

  const { register: registerDelete, handleSubmit: handleSubmitDelete } =
    useForm<ITDs>();

  const mutationThanksDateDelete = useMutation<any, any, ITDs>({
    mutationFn: deleteTD,
    onSuccess: () => {
      toast({
        status: "success",
        title: "succeed",
        description: "ThanksDate deleted",
      });
      queryClient.invalidateQueries({ queryKey: ["thanksDates"] });
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });

  const onSubmitTdDelete = (data: ITDs) => {
    mutationThanksDateDelete.mutate(data);
  };
  return (
    <Box
      shadow={"xl"}
      w={"100%"}
      cursor={"pointer"}
      rounded={"xl"}
      px={10}
      py={8}
      onClick={() => {
        onInfoOpen();
      }}
    >
      <Grid templateColumns={{ base: "1fr 1fr", lg: "5fr 1fr" }}>
        <Heading mr={5} mt={0} as={"b"} noOfLines={2} fontSize={"lg"}>
          {preview}
        </Heading>
        <HStack
          _hover={{
            color: "red.500",
          }}
          spacing={1}
        >
          <Text as={"b"}>{formattedDate}</Text>
        </HStack>
      </Grid>
      <Drawer
        aria-hidden={false}
        useInert={false}
        placement="bottom"
        size={"lg"}
        onClose={onInfoClose}
        isOpen={isInfoOpen}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">{preview}</DrawerHeader>
          <DrawerBody>
            <VStack alignItems={"flex-start"}>
              <Box>
                <Text as={"b"}>{formattedDate}</Text>
              </Box>
            </VStack>
            <HStack mb={6}>
              <Button
                w={"100%"}
                colorScheme="green"
                mt={10}
                onClick={() => navigate(`${id}/tks`)}
              >
                Go to thanks
              </Button>
              <Button
                w={"100%"}
                colorScheme="red"
                mt={10}
                onClick={handleSubmitDelete(onSubmitTdDelete)}
              >
                Delete
              </Button>
            </HStack>
            <FormControl>
              <Input
                type="hidden"
                {...registerDelete("id", {
                  required: true,
                  value: id,
                })}
              />
            </FormControl>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
