import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Protectedpage from "../ProtectedPage";
import HostOnlyPage from "../HostOnlyPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getCategories,
  getTags,
  IItemPostError,
  IItemPostSuccess,
  IItemPostVars,
  postItem,
} from "../../api";
import { ICategory, IItemTagsTag } from "../types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export default function UploadItem() {
  const { register, handleSubmit } = useForm<IItemPostVars>();
  const { isLoading: isTagLoading, data: tags } = useQuery<IItemTagsTag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
  });
  const { isLoading: isCategoryLoading, data: categories } = useQuery<
    ICategory[]
  >({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const toast = useToast();
  const navigate = useNavigate();
  const mutation = useMutation<IItemPostSuccess, IItemPostError, IItemPostVars>(
    postItem,
    {
      onMutate: () => {},
      onSuccess: (data) => {
        toast({
          status: "success",
          title: "Succeed",
          description: "Upload Complete.",
        });
        navigate(`/items/${data.id}`);
      },
      onError: (error) => {
        toast({
          status: "error",
          title: "Failed",
          description: `${error.detail}`,
        });
      },
    }
  );
  const onSubmit = (data: IItemPostVars) => {
    mutation.mutate(data);
  };
  return (
    <Protectedpage>
      <HostOnlyPage>
        <Box mt={4} pt={16}>
          <Container>
            <Heading mb={10} textAlign={"center"}>
              Upload Item
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
                <FormLabel>Title</FormLabel>
                <Input
                  {...register("title", { required: true })}
                  placeholder="Name of the item."
                  type="text"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea {...register("description", { required: true })} />
              </FormControl>
              <FormControl>
                <FormLabel>Language</FormLabel>
                <Select {...register("language", { required: true })}>
                  <option value={"c"}>C</option>
                  <option value={"cpp"}>CPP</option>
                  <option value={"python"}>Python</option>
                  <option value={"javascript"}>Javascript</option>
                  <option value={"dart"}>Dart</option>
                  <option value={"java"}>Java</option>
                  <option value={"etc"}>Etc</option>
                </Select>
                <FormHelperText>
                  Which Program Language used to make it?
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Tags</FormLabel>
                <Grid templateColumns={"1fr 1fr"} gap={4}>
                  {tags?.map((tag) => (
                    <Box key={tag.id}>
                      <Checkbox
                        {...register("tags", { required: true })}
                        value={tag.id}
                      >
                        {tag.tags}
                      </Checkbox>
                    </Box>
                  ))}
                </Grid>
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select {...register("category", { required: true })}>
                  {categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.kind}
                    </option>
                  ))}
                </Select>
                <FormHelperText>How can you define it?</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>File</FormLabel>
                <Input
                  disabled
                  {...register("file", { required: false })}
                  type="file"
                  fontSize={12}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Screenshots</FormLabel>
                <Input
                  disabled
                  {...register("photos", { required: false })}
                  type="file"
                  accept="image/*"
                  fontSize={12}
                />
              </FormControl>
              {mutation.isError ? (
                <Text color={"red.500"}>{mutation.error.error}</Text>
              ) : null}
              <Button
                type="submit"
                mt={8}
                size={"md"}
                w={"100%"}
                colorScheme="blue"
              >
                Upload Item
              </Button>
            </VStack>
          </Container>
        </Box>
      </HostOnlyPage>
    </Protectedpage>
  );
}
