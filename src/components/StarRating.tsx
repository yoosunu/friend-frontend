import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { FaStar } from "react-icons/fa";
import { IReviewUploadVars } from "../api";
import { Box, Input, Text } from "@chakra-ui/react";

interface StarRatingProps {
  setValue: UseFormSetValue<IReviewUploadVars>;
}

const StarRating: React.FC<StarRatingProps> = ({ setValue }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleClick = (value: number) => {
    setRating(value);
    setValue("rating", value);
  };

  return (
    <Box style={{ display: "flex" }}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <label key={index}>
            <Input
              type="radio"
              name="rating"
              value={starValue}
              onClick={() => handleClick(starValue)}
              style={{ display: "none" }}
            />
            <FaStar
              color={starValue <= (hover || rating) ? "red" : "#e4e5e9"}
              size={20}
              onMouseEnter={() => setHover(starValue)}
              onMouseLeave={() => setHover(0)}
              style={{ cursor: "pointer" }}
            />
          </label>
        );
      })}
      {rating === 0 && (
        <Box ml={2}>
          <Text color={"red.500"} fontSize={14}>
            Rating is required.
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default StarRating;
