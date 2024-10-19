import { Box, Grid, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { IWeathers } from "../types";
import { useQuery } from "@tanstack/react-query";
import { getWeather } from "../../api";
import {
  FaCloud,
  FaCloudShowersHeavy,
  FaHandHoldingWater,
  FaSnowflake,
  FaSun,
  FaTemperatureHigh,
} from "react-icons/fa";

export default function WeatherInfos() {
  const { isLoading, data } = useQuery<IWeathers>({
    queryKey: ["weathers"],
    queryFn: getWeather,
  });

  let weatherIcon = <FaSun size={40} />;
  const mainWeather = data?.weather
    .map((w) => w.main)
    .toString()
    .toLowerCase();
  if (mainWeather?.includes("cloud")) {
    weatherIcon = <FaCloud size={60} />;
  } else if (mainWeather?.includes("rain")) {
    weatherIcon = <FaCloudShowersHeavy size={60} />;
  } else if (mainWeather?.includes("snow")) {
    weatherIcon = <FaSnowflake size={60} />;
  } else if (mainWeather?.includes("clear")) {
    weatherIcon = <FaSun size={60} />;
  }

  return (
    <VStack>
      <Grid
        py={20}
        mt={10}
        px={{
          base: 24,
          lg: 20,
        }}
        columnGap={32}
        rowGap={20}
        templateColumns={{
          sm: "1fr",
          md: "1fr 1fr",
          lg: "repeat(2, 1fr)",
        }}
      >
        {isLoading ? (
          <Spinner size={"lg"} mt={20} />
        ) : (
          <>
            <VStack>
              <Box rounded={"full"} shadow={"xl"} p={14}>
                {weatherIcon}
              </Box>
            </VStack>
            <VStack
              px={4}
              shadow={"xl"}
              rounded={"2xl"}
              alignItems={"flex-start"}
            >
              <VStack>
                <HStack alignItems={"flex-end"}>
                  <FaTemperatureHigh size={30} />
                  <Text mx={2}>{`온도: ${data?.main.temp}`}</Text>
                  <Text>{`체감온도: ${data?.main.feels_like}`}</Text>
                </HStack>
                <VStack my={8} px={4} alignItems={"flex-start"}>
                  <Text color="red">
                    {`오늘의 날씨: ${data?.weather.map((w) => w.main)}`}
                  </Text>
                  <Text>
                    {`세부 설명: ${data?.weather.map((w) => w.description)}`}
                  </Text>
                  {mainWeather?.includes("rain") ? (
                    <HStack>
                      <FaHandHoldingWater size={30} />
                      <Text>
                        {data?.rain !== undefined
                          ? `강수량: ${data?.rain?.["1h"]}`
                          : "No Rain"}
                      </Text>
                    </HStack>
                  ) : null}
                </VStack>
              </VStack>
            </VStack>
          </>
        )}
      </Grid>
    </VStack>
  );
}
