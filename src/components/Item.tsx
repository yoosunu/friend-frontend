import {
  Box,
  Grid,
  Img,
  VStack,
  Text,
  HStack,
  useColorModeValue,
  Button,
  useToast,
  IconButton,
  chakra,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  FaCameraRetro,
  FaHeart,
  FaPencilAlt,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  addWish,
  IToggleLikeError,
  IToggleLikeSuccess,
  IToggleLikeVar,
} from "../api";
import { useEffect, useState } from "react";

interface IItemProps {
  imageUrl: string;
  title: string;
  rating: number;
  description: string;
  language: string;
  id: string;
  is_owner: boolean;
  is_liked: boolean;
  tips_payload: string;
  tips_highlight: string;
  rules_payload: string;
  rules_highlight: string;
}

export default function Item({
  imageUrl,
  title,
  rating,
  description,
  language,
  id,
  is_owner,
  is_liked,
}: IItemProps) {
  const currentValue = is_liked;
  const gray = useColorModeValue("gray.600", "gray.300");
  const [liked, setLiked] = useState(is_liked);
  const toast = useToast();
  const mutation = useMutation<
    IToggleLikeSuccess,
    IToggleLikeError,
    IToggleLikeVar
  >(addWish, {
    onMutate: () => {
      setLiked((prev) => !prev);
    },
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Liked!",
        description: `added in wish ${data.title}`,
      });
      setLiked(data.is_liked);
    },
    onError: (error) => {
      setLiked((prev) => !prev);
      toast({
        status: "error",
        title: "Failed",
        // description: `${error.error}`,
      });
    },
  });
  const navigate = useNavigate();
  const HeartIcon = chakra(FaHeart);
  const RegHeartIcon = chakra(FaRegHeart);
  const onPencilClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/items/${id}/put`);
  };
  const onCameraClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    navigate(`/items/${id}/photos`);
  };
  const onHeartClick = (event: React.SyntheticEvent<HTMLButtonElement>) => {
    event.preventDefault();
    mutation.mutate({
      itemId: id,
      is_liked: !currentValue,
      currentValue: liked,
    });
    // setLiked((prev) => !prev);
  };
  return (
    <Link to={`/items/${id}`}>
      <VStack spacing={1} display={"flex"} alignItems={"center"}>
        <Box
          shadow={"2xl"}
          cursor={"pointer"}
          position={"relative"}
          mb={4}
          rounded={"3xl"}
          overflow={"hidden"}
          maxH={"300"}
          maxW={"300"}
        >
          <Img
            src={imageUrl}
            rounded={"3xl"}
            overflow={"hidden"}
            minH={"300"}
            minW={"300"}
          />
          <IconButton
            aria-label="Like"
            icon={
              liked === true ? (
                <HeartIcon size={"25px"} color={"red.500"} />
              ) : (
                <RegHeartIcon size={"25px"} color={"gray.300"} />
              )
            }
            position={"absolute"}
            top={5}
            right={5}
            onClick={onHeartClick}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            variant="ghost"
          />
        </Box>
        <Box maxH={"300"} maxW={"300"}>
          <Grid mb={3} templateColumns={"10fr 1fr"}>
            <Text as={"b"} noOfLines={1} fontSize={"md"}>
              {title}
            </Text>
            <HStack
              _hover={{
                color: "red.500",
              }}
              spacing={1}
            >
              <FaStar size={15} />
              <Text>{rating}</Text>
            </HStack>
          </Grid>
          <Box mb={1}>
            <Text fontSize={"s"} noOfLines={1} color={gray}>
              {description}
            </Text>
          </Box>
        </Box>
        <Grid mb={3} templateColumns={"2.6fr 1fr"}>
          <Text as={"b"} fontSize={"s"} color={gray}>
            {language}
          </Text>
          <Box>
            <HStack>
              <Button onClick={onPencilClick} size={"sm"}>
                <Box>{is_owner === true ? <FaPencilAlt /> : null}</Box>
              </Button>
              <Button onClick={onCameraClick} size={"sm"}>
                <Box>{is_owner === true ? <FaCameraRetro /> : null}</Box>
              </Button>
            </HStack>
          </Box>
        </Grid>
      </VStack>
    </Link>
  );
}
