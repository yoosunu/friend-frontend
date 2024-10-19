import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  HStack,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import Protectedpage from "../ProtectedPage";
import HostOnlyPage from "../HostOnlyPage";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getItem,
  getTags,
  IItemPostSuccess,
  IItemPutError,
  IItemPutVars,
  putItem,
} from "../../api";
import { IItemDetail, IItemTagsTag } from "../types";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { FaExchangeAlt } from "react-icons/fa";

export default function PutItem() {
  const toast = useToast();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const { register, handleSubmit } = useForm<IItemPutVars>();
  const { isLoading, data } = useQuery<IItemDetail>(["item", itemId], getItem);
  const { isLoading: isTagLoading, data: tags } = useQuery<IItemTagsTag[]>({
    queryKey: ["tags"],
    queryFn: getTags,
  });
  let dts: number[] = [];
  let ts: number[] = [];
  if (!isLoading && !isTagLoading) {
    dts = data?.tags.map((d) => d.id) || [];
    ts = tags?.map((t) => t.id) || [];
  }
  const mutation = useMutation<IItemPostSuccess, IItemPutError, IItemPutVars>(
    (updatedData) => putItem(updatedData),
    {
      onMutate: (updatedData) => {
        toast({
          status: "loading",
          title: "putting...",
          description: `wait a moment please... `,
        });
      },
      onSuccess: (data) => {
        toast({
          status: "success",
          title: "Succeed",
          description: "Put Complete.",
        });

        navigate(`/items/${data.id}`);
      },
      onError: (error) => {
        toast({
          status: "error",
          title: "Failed",
          description: `${error.error}`,
        });
      },
    }
  );
  const onSubmit = (data: IItemPutVars) => {
    const filteredData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== "" && value !== undefined && value !== null) {
        acc[key as keyof IItemPutVars] = value;
      }
      return acc;
    }, {} as Partial<IItemPutVars>);
    const tagsAsNumbers = Array.isArray(filteredData.tags)
      ? filteredData.tags.map((tag) => Number(tag))
      : [];

    mutation.mutate({ itemId: itemId!, ...filteredData, tags: tagsAsNumbers });
  };
  return (
    <Protectedpage>
      <HostOnlyPage>
        {isLoading ? null : (
          <Box px={{ lg: 80, sm: 0 }}>
            <Stack
              direction={{
                sm: "column",
                md: "row",
              }}
              align="center"
              justify="center"
            >
              <Box
                mt={4}
                pt={16}
                h={"100%"}
                w={{ lg: "50%", sm: "100%" }}
                mb={{ lg: 0, sm: 20 }}
              >
                <Heading mb={10} textAlign={"center"}>
                  Initial
                </Heading>
                <VStack
                  rounded={"xl"}
                  spacing={8}
                  shadow={"2xl"}
                  p={{
                    base: 10,
                    sm: 30,
                  }}
                >
                  <FormControl mb={4}>
                    <FormLabel>Title</FormLabel>
                    <Text>{!isLoading ? data?.title : ""}</Text>
                  </FormControl>
                  <FormControl mb={8}>
                    <FormLabel>Description</FormLabel>
                    <Text>{!isLoading ? data!.description : ""}</Text>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Language</FormLabel>
                    <Text>{!isLoading ? data?.language : ""}</Text>
                    <FormHelperText>
                      Which Program Language used to make it?
                    </FormHelperText>
                  </FormControl>
                  <FormControl mb={4}>
                    <HStack>
                      <FormLabel>Tags</FormLabel>
                    </HStack>
                    {!isLoading && !isTagLoading ? (
                      <Grid templateColumns={"1fr 1fr"} gap={4}>
                        {!isLoading && !isTagLoading
                          ? tags?.map((tag) => (
                              <Box key={tag.id}>
                                <Checkbox
                                  value={tag.id}
                                  isChecked={dts.includes(tag.id)}
                                >
                                  {tag.tags}
                                </Checkbox>
                              </Box>
                            ))
                          : null}
                      </Grid>
                    ) : null}
                  </FormControl>
                  <FormControl mb={16}>
                    <FormLabel>Tips_payload</FormLabel>
                    <Text>{data?.tips_payload ?? ""}</Text>
                  </FormControl>
                  <FormControl mb={16}>
                    <FormLabel>Tips_highlight</FormLabel>
                    <Text>{data?.tips_highlight ?? ""}</Text>
                  </FormControl>
                  <FormControl mb={16}>
                    <FormLabel>Rules_payload</FormLabel>
                    <Text>{data?.rules_payload ?? ""}</Text>
                  </FormControl>
                  <FormControl mb={16}>
                    <FormLabel>Rules_highlight</FormLabel>
                    <Text>{data?.rules_highlight ?? ""}</Text>
                  </FormControl>
                  <FormControl mb={16}>
                    <FormLabel>File</FormLabel>
                    <Text></Text>
                  </FormControl>
                  {mutation.isError ? (
                    <Text color={"red.500"}>{mutation.error.error}</Text>
                  ) : null}
                  <Button
                    isDisabled
                    // type="submit"
                    mt={8}
                    size={"md"}
                    w={"100%"}
                    colorScheme="blue"
                  >
                    Put
                  </Button>
                </VStack>
              </Box>
              <Box px={20}>
                <FaExchangeAlt size={50} />
              </Box>
              <Box mt={4} pt={16} h={"100%"} w={{ lg: "50%", sm: "100%" }}>
                <Heading mb={10} textAlign={"center"}>
                  Put Item
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
                      {...register("title", { required: false })}
                      placeholder="Name of the item."
                      type="text"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      {...register("description", { required: false })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select {...register("language", { required: false })}>
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
                    <HStack>
                      <FormLabel>Tags</FormLabel>
                    </HStack>
                    {!isLoading && !isTagLoading ? (
                      <Grid templateColumns={"1fr 1fr"} gap={4}>
                        {!isLoading && !isTagLoading
                          ? tags?.map((tag) => (
                              <Box key={tag.id}>
                                <Checkbox
                                  {...register("tags", { required: false })}
                                  value={tag.id}
                                >
                                  {tag.tags}
                                </Checkbox>
                              </Box>
                            ))
                          : null}
                      </Grid>
                    ) : null}
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tips_payload</FormLabel>
                    <Textarea
                      {...register("tips_payload", { required: false })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Tips_highlight</FormLabel>
                    <Textarea
                      {...register("tips_highlight", { required: false })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Rules_payload</FormLabel>
                    <Textarea
                      {...register("rules_payload", { required: false })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Rules_highlight</FormLabel>
                    <Textarea
                      {...register("rules_highlight", { required: false })}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>File</FormLabel>
                    <Input
                      disabled
                      {...register("file", { required: false })}
                      type="text"
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
                    Put
                  </Button>
                </VStack>
              </Box>
            </Stack>
          </Box>
        )}
      </HostOnlyPage>
    </Protectedpage>
  );
}
