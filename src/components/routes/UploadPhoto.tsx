import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Protectedpage from "../ProtectedPage";
import HostOnlyPage from "../HostOnlyPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getItem,
  IPhotoUploadError,
  IPhotoUploadSuccess,
  IPhotoUploadVars,
  postPhotos,
} from "../../api";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IItemDetail } from "../types";

export default function UploadPhoto() {
  const { itemId } = useParams();
  const { isLoading, data: itemData } = useQuery<IItemDetail>(
    ["item", itemId],
    getItem
  );
  const uploadURL = `http://127.0.0.1:8000/api/v1/items/${itemId}/photos`;
  const { register, handleSubmit } = useForm<IPhotoUploadVars>();
  const toast = useToast();
  const navigate = useNavigate();
  const mutation = useMutation(postPhotos, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Upload Complete.",
      });
      navigate(`/items/${itemId}`);
    },
    onError: (error) => {
      toast({
        status: "error",
        title: `Failed`,
        description: ``,
      });
      navigate(``);
    },
  });
  const onSubmit = ({ file, description }: IPhotoUploadVars) => {
    mutation.mutate({
      file,
      // uploadURL,
      description,
    });
  };
  return (
    <Protectedpage>
      <HostOnlyPage>
        <Box mt={4} pt={16}>
          <Container>
            <Heading mb={10} textAlign={"center"}>
              Upload Photos
            </Heading>
            <VStack
              as={"form"}
              onSubmit={handleSubmit(onSubmit)}
              rounded={"xl"}
              spacing={8}
              shadow={"2xl"}
              p={{
                base: 10,
              }}
            >
              <FormControl>
                <Box mb={4}>
                  <Text as={"b"}>{!isLoading ? itemData?.title : null}</Text>
                </Box>
                <Box>
                  <Text noOfLines={1}>
                    {!isLoading ? itemData?.description : null}
                  </Text>
                </Box>
              </FormControl>
              <FormControl>
                <FormLabel>Screenshots</FormLabel>
                <Input
                  {...register("file", { required: true })}
                  type="file"
                  accept="image/*"
                  fontSize={12}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  placeholder="Not required"
                  {...register("description", { required: false })}
                  type="text"
                  fontSize={12}
                />
              </FormControl>
              {mutation.isError ? <Text color={"red.500"}></Text> : null}
              <Button
                type="submit"
                mt={8}
                size={"md"}
                w={"100%"}
                colorScheme="blue"
              >
                Upload Photos
              </Button>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </Protectedpage>
  );
}
