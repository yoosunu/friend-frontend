import {
  Box,
  VStack,
  Text,
  Spinner,
  HStack,
  Button,
  useToast,
  Modal,
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalOverlay,
  ModalBody,
  Container,
  Input,
  ModalFooter,
  FormControl,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ITDs, ITks } from "../types";
import { deleteTk, getTDs, getTks, postTk } from "../../api";
import { Link, useParams } from "react-router-dom";
import { FaEllipsisV, FaPlus } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

export interface ITkDelete {
  id: string;
  tkId: string;
  payload: string;
}

export default function ThanksDatesDetail() {
  const [isPosted, setIsPosted] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();
  const { register: registerPost, handleSubmit: handleSubmitPost } =
    useForm<ITks>();
  const { register: registerDelete, handleSubmit: handleSubmitDelete } =
    useForm<ITkDelete>();
  const {
    isOpen: isOpenPost,
    onClose: onClosePost,
    onOpen: onOpenPost,
  } = useDisclosure();

  let tkPreview: string[] = [];
  let tkCreated: string[] = [];
  let tkId: string[] = [];
  let tkIdFirst: string = "";
  let tkPreviewFirst: string = "";
  let tkCreatedFirst: string = "";
  let formattedDate: string = "";
  let ThatTd: ITDs | undefined;
  let defaultTk: ITks | undefined;

  const { isLoading: isLoadingTd, data: TDs } = useQuery<ITDs[]>({
    queryKey: ["thanksDates"],
    queryFn: getTDs,
  });

  const { tdId } = useParams();
  const { isLoading, data } = useQuery<ITks[]>([`tks`, tdId], getTks);
  if (!isLoading) {
    tkId = data!.map((tk) => tk.thanksDate.id);
    tkPreview = data!.map((tk) => tk.thanksDate.preview);
    tkCreated = data!.map((tk) => tk.thanksDate.created_at);
    tkIdFirst = tkId[0];
    tkPreviewFirst = tkPreview[0];
    tkCreatedFirst = tkCreated[0];
    const date = new Date(tkCreatedFirst);
    formattedDate = date.toLocaleDateString();
  }

  if (!isLoadingTd) {
    ThatTd = TDs!.find((t) => Number(t.id) === Number(tdId));
  }
  if (!isLoading) {
    defaultTk = data!.find((t) => t.payload === "Always Love U.");
  }

  const mutationPost = useMutation<any, any, ITks>(postTk, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["tks"]);
      onClosePost();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong.",
      });
    },
  });
  const mutationDelete = useMutation<any, any, ITkDelete>(deleteTk, {
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Thank added.",
      });
      queryClient.invalidateQueries(["tks"]);
      window.location.reload();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong.",
      });
    },
  });
  const onSubmitPost = (data: ITks) => {
    mutationPost.mutate(data);
  };
  const onSubmitDelete = (data: ITkDelete) => {
    mutationDelete.mutate(data);
  };

  useEffect(() => {
    if (!isLoading && data?.length === 0 && !isPosted) {
      mutationPost.mutate({
        payload: "Always Love U.",
        id: `${ThatTd!.id}`,
        thanksDate: ThatTd!,
      });
      setIsPosted(true);
    }
  }, [isLoading, data, ThatTd]);

  useEffect(() => {
    if (!isLoading && data?.length! > 1) {
      mutationDelete.mutate({
        id: `${ThatTd!.id}`,
        tkId: `${defaultTk!.id}`,
        payload: `${defaultTk!.payload}`,
      });
    }
  }, [isLoading, data, ThatTd, defaultTk]);

  return (
    <Container mt={{ lg: 20, base: 10 }} px={{ lg: 0, base: 4 }}>
      <VStack rounded={"3xl"} p={8} border={"2px"} borderColor={"green.400"}>
        {data === null ? (
          <Box>
            <Text>No Thanks</Text>
          </Box>
        ) : isLoading ? (
          <Spinner />
        ) : (
          <Box w={"100%"}>
            <HStack display={"flex"} justifyContent={"space-between"} mb={10}>
              <Box>
                <Text>{tkPreviewFirst}</Text>
              </Box>
              <Box>
                <Text>{formattedDate}</Text>
              </Box>
              <Box>
                <Button onClick={onOpenPost} colorScheme="green">
                  <Text mr={1}> Add new</Text> <FaPlus size={12} />
                </Button>
              </Box>
            </HStack>
            {data?.map((tk) => (
              <HStack w={"100%"} key={tk.id}>
                <Box
                  w={"100%"}
                  py={1.5}
                  display={"flex"}
                  justifyContent={"center"}
                  borderBottom={"1px"}
                  borderColor={"green.300"}
                >
                  <Text>{tk.payload}</Text>
                </Box>
                <Menu>
                  <MenuButton>
                    <FaEllipsisV />
                  </MenuButton>
                  <MenuList>
                    <FormControl>
                      <Input
                        type="hidden"
                        {...registerDelete("id", { required: true })}
                        value={tdId}
                      />
                    </FormControl>
                    <FormControl>
                      <Input
                        type="hidden"
                        {...registerDelete("tkId", { required: true })}
                        value={tk.id}
                      />
                    </FormControl>
                    <MenuItem onClick={handleSubmitDelete(onSubmitDelete)}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </HStack>
            ))}
          </Box>
        )}
      </VStack>
      <Modal
        aria-hidden={false}
        useInert={false}
        isOpen={isOpenPost}
        onClose={onClosePost}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth={"1px"}>
            Add Thank
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody>
            <Box mt={3} mb={5}>
              <Text as={"b"}>Payload</Text>
            </Box>
            <FormControl>
              <Input
                {...registerPost("payload", { required: true })}
                placeholder="Always thank U!"
              />
            </FormControl>
            <FormControl>
              <Input
                type="hidden"
                {...registerPost("id", { required: true })}
                value={tkIdFirst!}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter mt={2}>
            <Button
              onClick={handleSubmitPost(onSubmitPost)}
              colorScheme="green"
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
