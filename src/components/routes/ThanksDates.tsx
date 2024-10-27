import {
  Text,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTDs, postTD } from "../../api";
import { ITDs } from "../types";
import ThanksDate from "../ThanksDate";
import ThanksDateSkeleton from "../skeleton/ThanksDateSkeleton";
import { FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";

export default function ThanksDates() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const { isLoading, data } = useQuery<ITDs[]>({
    queryKey: ["thanksDates"],
    queryFn: getTDs,
  });

  // useDisclosure section
  const { onOpen, onClose, isOpen } = useDisclosure();

  // useForm section
  const { register, handleSubmit } = useForm<ITDs>();

  // mutation section
  const mutationThanksDatePost = useMutation<any, any, ITDs>(postTD, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "succeed",
        description: "ThanksDate posted",
      });
      queryClient.invalidateQueries(["thanksDates"]);
      onClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });

  // onSubmit section
  const onSubmitTdPost = (data: ITDs) => {
    mutationThanksDatePost.mutate(data);
  };

  return (
    <>
      <VStack
        py={20}
        mt={10}
        px={{
          base: 24,
          lg: 40,
        }}
      >
        {data === null ? (
          <Box>
            <Text>No Content</Text>
          </Box>
        ) : isLoading ? (
          <>
            <ThanksDateSkeleton />
            <ThanksDateSkeleton />
            <ThanksDateSkeleton />
          </>
        ) : null}
        <Button onClick={onOpen} colorScheme={"green"}>
          Add New<Box px={1}></Box> <FaPlus />
        </Button>
        {data && data.length === 0 && !isLoading ? (
          <Box mt={10}>
            <Text as={"b"}>No Thanks Add New!</Text>
          </Box>
        ) : (
          data?.map((td) => (
            <Box key={td.id} w={"100%"}>
              <ThanksDate
                id={td.id}
                preview={td.preview}
                user={td.user.name}
                created_at={td.created_at}
              />
            </Box>
          ))
        )}
      </VStack>
      <Modal
        aria-hidden={false}
        useInert={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add ThanksDate</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <ModalBody>
            <FormControl mb={10}>
              <FormLabel>Preview</FormLabel>
              <Input
                {...register("preview", { required: true })}
                placeholder="Title of the ThanksDate"
              />
            </FormControl>
            <FormControl mb={10}>
              <Input
                type="hidden"
                {...register("diary", { required: false })}
                placeholder="Whatever you want"
                value={""}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleSubmit(onSubmitTdPost)}
              colorScheme="green"
              mr={3}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
