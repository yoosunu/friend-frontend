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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaCameraRetro,
  FaHeart,
  FaPencilAlt,
  FaRegHeart,
  FaStar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { addWish, IAddWishVars } from "../api";
import { useState } from "react";

interface IItemProps {
  imageUrl: string;
  title: string;
  rating: number;
  description: string;
  language: string;
  id: string;
  is_owner: boolean;
  is_wished: boolean;
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
  is_wished,
}: IItemProps) {
  const gray = useColorModeValue("gray.600", "gray.300");
  const toast = useToast();
  const [wished, setWished] = useState(is_wished);
  const queryCLient = useQueryClient();
  const mutation = useMutation<any, any, IAddWishVars>({
    mutationFn: addWish,
    onMutate: () => {
      setWished((prev) => !prev);
    },
    onSuccess: () => {
      toast({
        status: "success",
        title: "Ok!",
        description: `wishlist changed.`,
      });
      setWished(wished);
    },
    onError: (error) => {
      setWished((prev) => !prev);
      toast({
        status: "error",
        title: "Failed",
        description: `${error.error}`,
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
    mutation.mutate({ itemId: id });
    queryCLient.invalidateQueries({ queryKey: ["items"] });
  };
  return (
    <Link to={`/items/${id}`}>
      <VStack spacing={1} display={"flex"} alignItems={"center"}>
        {/* photo, heart, wrapbox start */}
        <Box
          shadow={"2xl"}
          cursor={"pointer"}
          position={"relative"}
          mb={4}
          rounded={"3xl"}
          overflow={"hidden"}
          maxH={{ base: 150, md: "300" }}
          maxW={{ base: 150, md: "300" }}
        >
          <Img
            src={imageUrl}
            rounded={"3xl"}
            overflow={"hidden"}
            minH={{ base: 150, md: "300" }}
            minW={{ base: 150, md: "300" }}
          />
          <IconButton
            aria-label="Like"
            icon={
              wished === true ? (
                <HeartIcon size={"25px"} color={"red.500"} />
              ) : (
                <RegHeartIcon size={"25px"} color={"gray.300"} />
              )
            }
            position={"absolute"}
            top={{ base: 1, md: 5 }}
            right={{ base: 1, md: 5 }}
            onClick={onHeartClick}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            variant="ghost"
          />
        </Box>
        {/* photo, heart, wrapbox end */}
        {/* title, description, star box start */}
        <Box maxH={{ base: 150, md: "300" }} maxW={{ base: 150, md: "300" }}>
          <Grid mb={3} templateColumns={"10fr 1fr"}>
            <Text as={"b"} noOfLines={1} fontSize={{ base: "sm", md: "md" }}>
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
        {/* title, description, star box end */}
        {/* description section start */}
        <Grid mb={3} templateColumns={{ base: "1fr 1fr", md: "2.6fr 1fr" }}>
          <Text as={"b"} fontSize={{ base: "sm", md: "md" }} color={gray}>
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
        {/* description section end */}
      </VStack>
    </Link>
  );
}
