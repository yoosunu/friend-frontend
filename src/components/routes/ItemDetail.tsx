import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import {
  deleteReview,
  getItem,
  getItemReviews,
  IReviewDeleteVars,
  IReviewUploadError,
  IReviewUploadVars,
  uploadReview,
} from "../../api";
import {
  Box,
  Grid,
  Heading,
  Skeleton,
  Image,
  GridItem,
  VStack,
  Text,
  HStack,
  Avatar,
  Container,
  Stack,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { IItemDetail, IItemTagsTag, IReview } from "../types";
import { FaStar } from "react-icons/fa";
import { useForm } from "react-hook-form";
import StarRating from "../StarRating";

export default function ItemDetail() {
  const toast = useToast();
  const { itemId } = useParams();

  const { isLoading, data } = useQuery<IItemDetail>([`items`, itemId], getItem);
  const { data: reviewsData, isLoading: isReviewsLoading } = useQuery<
    IReview[]
  >([`items`, itemId, `reviews`], getItemReviews);
  const { register, handleSubmit, setValue } = useForm<IReviewUploadVars>();
  const { handleSubmit: handleDeleteSubmit } = useForm<IReviewDeleteVars>();
  const mutationPost = useMutation<any, IReviewUploadError, IReviewUploadVars>(
    uploadReview,
    {
      onMutate: () => {},
      onSuccess: () => {
        toast({
          status: "success",
          title: "Succeed",
          description: "Upload Complete.",
        });
        window.location.reload();
      },
      onError: (error) => {
        toast({
          status: "error",
          title: "Failed",
          description: `Rating is required`,
        });
      },
    }
  );
  const mutationDelete = useMutation(deleteReview, {
    onMutate: (data) => {},
    onSuccess: (data, variables) => {
      toast({
        status: "success",
        title: "success",
        description: "Review Deleted",
      });
      window.location.reload();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Error occurs. Try later again.",
      });
    },
  });
  const onSubmit = (data: IReviewUploadVars) => {
    mutationPost.mutate({
      itemId: itemId!,
      review: data.review,
      rating: data.rating,
    });
  };

  const onSubmitDelete = ({ itemId, reviewId }: IReviewDeleteVars) => {
    mutationDelete.mutate({ itemId, reviewId });
  };

  return (
    <Box
      mt={10}
      pt={20}
      px={{
        base: 10,
        lg: 80,
      }}
    >
      <Stack
        w={"100%"}
        h={"100%"}
        direction={{
          sm: "column",
          md: "row",
        }}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box w={"50%"} h={"100%"}>
          <Grid
            mt={8}
            rounded={"2xl"}
            overflow={"hidden"}
            gap={4}
            height="80vh"
            templateColumns={"repeat(3, 1fr)"}
            templateRows={"repeat(2, 1fr"}
          >
            {[0, 1, 2, 3].map((index) => (
              <GridItem
                rounded={"2xl"}
                colSpan={index === 0 ? 3 : 1}
                rowSpan={index === 0 ? 3 : 1}
                key={index}
                overflow={"hidden"}
              >
                <Skeleton isLoaded={!isLoading} h={"100%"} w={"100%"}>
                  {data?.photos && data?.photos.length > 0 ? (
                    <Image
                      w={"100%"}
                      h={"100%"}
                      objectFit={"cover"}
                      src={data?.photos[index]?.file}
                    />
                  ) : (
                    <Box></Box>
                  )}
                </Skeleton>
              </GridItem>
            ))}
          </Grid>
        </Box>
        <Box display={"flex"} rounded={"2xl"} w={"50%"} h={"100%"}>
          <VStack py={10} px={40} alignItems={"flex-start"}>
            <Heading mb={10}>{data?.title}</Heading>
            <Text mb={10}>{data?.description}</Text>
            <HStack>
              <Text>Language: </Text>
              <Text as={"b"}>{data?.language}</Text>
            </HStack>
            <Text>{data?.file ? data?.file : null}</Text>
          </VStack>
        </Box>
      </Stack>

      <Box borderTopWidth={1} mt={10}>
        <HStack width={"30%"} justifyContent={"space-between"} mt={1}>
          <VStack alignItems={"flex-start"}>
            <Skeleton isLoaded={!isLoading}>
              <Heading
                justifyContent={"flex-start"}
                width={"100%"}
                fontSize={"2xl"}
              >
                Made by {data?.user.name}
              </Heading>
            </Skeleton>
            <Skeleton isLoaded={!isLoading}>
              <HStack width={"100%"}>
                {data?.tags.map((tag: IItemTagsTag) => (
                  <Box
                    key={tag.id}
                    display="flex"
                    justifyContent={"center"}
                    alignItems={"center"}
                    rounded={"2xl"}
                    bg={"gray.500"}
                    color={"gray.200"}
                    w={16}
                    h={6}
                    pb={1}
                  >
                    <Text fontStyle={"oblique"} as={"b"} fontSize={"14"}>
                      {tag?.tags}
                    </Text>
                  </Box>
                ))}
              </HStack>
            </Skeleton>
          </VStack>
          <Avatar
            name={data?.user.name}
            size={"xl"}
            src={data?.user.profile_image}
          />
        </HStack>
        <Box mt={2} mb={10} fontSize={"2xl"}>
          <HStack borderTopWidth={1} borderBottomWidth={1} py={4}>
            <HStack w={"100%"}>
              <Skeleton isLoaded={!isReviewsLoading}>
                <HStack>
                  <FaStar />
                  <Text as={"b"}>{data?.rating}</Text>
                </HStack>
              </Skeleton>
              <Skeleton isLoaded={!isReviewsLoading}>
                <Text as={"b"}>·</Text>
              </Skeleton>
              <Skeleton isLoaded={!isReviewsLoading}>
                <Text as={"b"}>
                  {reviewsData?.length} review
                  {reviewsData?.length === 1 ? "" : "s"}
                </Text>
              </Skeleton>
            </HStack>
          </HStack>
        </Box>
        <Container maxW={"container.lg"} marginX="none" borderBottomWidth={1}>
          <VStack alignItems={"flex-start"} gap={8}>
            {reviewsData?.map((review, index) => (
              <VStack key={index} alignItems={"flex-start"} pt={2} pb={10}>
                <HStack>
                  <Avatar
                    name={review?.user.name}
                    src={review?.user.profile_image}
                    size={"md"}
                  />
                  <VStack spacing={0} alignItems={"flex-start"}>
                    <Heading fontSize={"md"}>{review?.user.name}</Heading>
                    <HStack spacing={1}>
                      <FaStar size={"12px"}></FaStar>
                      <Text>{review?.rating}</Text>
                    </HStack>
                  </VStack>
                  {review.is_owner ? (
                    <Button
                      onClick={handleDeleteSubmit(() =>
                        onSubmitDelete({
                          itemId: itemId!,
                          reviewId: review.id,
                        })
                      )}
                      size={"xs"}
                      mb={2}
                      colorScheme="green"
                    >
                      Delete
                    </Button>
                  ) : null}
                </HStack>
                <Text>{review?.review}</Text>
              </VStack>
            ))}
          </VStack>
        </Container>
        <VStack alignItems={"flex-start"}>
          <VStack
            w={"70%"}
            alignItems={"flex-start"}
            py={2}
            borderBottomWidth={1}
          >
            <HStack mb={4}>
              <Box mr={6}>
                <Text fontSize={24} as={"b"}>
                  Review upload
                </Text>
              </Box>
              <HStack mt={1}>
                <StarRating setValue={setValue} />
              </HStack>
            </HStack>
            <HStack w={"100%"} alignItems={"center"}>
              <Textarea
                mr={4}
                mb={4}
                placeholder="Anything please."
                {...register("review", {
                  required: true,
                })}
              />

              <Button
                py={10}
                mb={4}
                colorScheme="green"
                onClick={handleSubmit(onSubmit)}
              >
                Submit
              </Button>
            </HStack>
          </VStack>
          <Box py={8}>
            <VStack alignItems={"flex-start"}>
              <Text as={"b"}>Tips</Text>
              <Text>{data?.tips_payload}</Text>
              <Text color={"red.500"}># {data?.tips_highlight}</Text>
            </VStack>
          </Box>
          <Box borderTopWidth={1} py={8}>
            <VStack alignItems={"flex-start"}>
              <Text as={"b"}>Rules</Text>
              <Text>{data?.rules_payload}</Text>
              <Text color={"red.500"}># {data?.rules_highlight}</Text>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}
