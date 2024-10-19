import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Heading,
  HStack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

import { IEveryday, IPlan } from "./types";
import { useRef, useState } from "react";
import React from "react";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";

interface ITodoProps {
  id: string;
  name: string;
  everydays: IEveryday[];
  plans: IPlan[];
}

export default function Todo({ id, name, everydays, plans }: ITodoProps) {
  const stackRefEveryday = useRef<HTMLDivElement | null>(null);
  const stackRefPlan = useRef<HTMLDivElement | null>(null);
  const [activeEveryday, setActiveEveryday] = useState<IEveryday | null>(null);
  const [activePlan, setActivePlan] = useState<IPlan | null>(null);
  const {
    isOpen: isPlanOpen,
    onOpen: onPlanOpen,
    onClose: onPlanClose,
  } = useDisclosure();
  const {
    isOpen: isEverydayOpen,
    onOpen: onEverydayOpen,
    onClose: onEverydayClose,
  } = useDisclosure();

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDownEveryday = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    setIsDragging(true);
    setStartX(e.pageX - (stackRefEveryday.current?.offsetLeft || 0));
    setScrollLeft(stackRefEveryday.current?.scrollLeft || 0);
  };

  const handleMouseDownPlan = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    setIsDragging(true);
    setStartX(e.pageX - (stackRefPlan.current?.offsetLeft || 0));
    setScrollLeft(stackRefPlan.current?.scrollLeft || 0);
  };
  // Mouse Up Event
  const handleMouseUpOrLeaveEveryday = () => {
    setIsDragging(false);
  };
  const handleMouseUpOrLeavePlan = () => {
    setIsDragging(false);
  };

  const handleMouseMoveEveryday = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default behavior (like text selection)
    const x = e.pageX - (stackRefEveryday.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Increase scroll speed by multiplying
    if (stackRefEveryday.current) {
      stackRefEveryday.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseMovePlan = (
    e: React.MouseEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    e.preventDefault(); // Prevent default behavior (like text selection)
    const x = e.pageX - (stackRefPlan.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Increase scroll speed by multiplying
    if (stackRefPlan.current) {
      stackRefPlan.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchStart = (
    e: React.TouchEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - (ref.current?.offsetLeft || 0));
    setScrollLeft(ref.current?.scrollLeft || 0);
  };

  const handleTouchMove = (
    e: React.TouchEvent,
    ref: React.RefObject<HTMLDivElement>
  ) => {
    if (!isDragging) return;
    const x = e.touches[0].pageX - (ref.current?.offsetLeft || 0);
    const walk = (x - startX) * 2;
    if (ref.current) {
      ref.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  return (
    <VStack alignItems={"center"}>
      <Heading py={5}>Everyday</Heading>
      <HStack
        display={"flex"}
        position={"relative"}
        mb={20}
        shadow={"xl"}
        w={{
          sm: "20%",
          md: "50%",
        }}
        h={200}
        rounded={"2xl"}
        py={10}
        ref={stackRefEveryday}
        align="center"
        overflowX="hidden"
        overflowY="hidden"
        cursor="grab"
        onMouseDown={(e) => handleMouseDownEveryday(e, stackRefEveryday)}
        onMouseUp={handleMouseUpOrLeaveEveryday}
        onMouseLeave={handleMouseUpOrLeaveEveryday}
        onMouseMove={(e) => handleMouseMoveEveryday(e, stackRefEveryday)}
        // Touch Events
        onTouchStart={(e) => handleTouchStart(e, stackRefEveryday)}
        onTouchMove={(e) => handleTouchMove(e, stackRefEveryday)}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          bgColor={"green.300"}
          h={"100%"}
          w={7}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          pr={1}
        >
          <FaCaretLeft color="white" fontSize={32} />
        </Box>
        {everydays.map((everyday) => (
          <Box key={everyday.name} mx={20}>
            <Button
              shadow={"2xl"}
              key={everyday.name}
              onClick={() => {
                setActiveEveryday(everyday);
                onEverydayOpen();
              }}
              rounded={"3xl"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              w={130}
              h={150}
              bgColor={everyday.done ? "blue.300" : "red.300"}
            >
              <VStack>
                <Text>{everyday.name}</Text>
                <Text>{everyday.time}</Text>
              </VStack>
            </Button>
            <Drawer
              placement="bottom"
              size={"lg"}
              onClose={onEverydayClose}
              isOpen={isEverydayOpen}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">
                  {activeEveryday?.name}
                </DrawerHeader>
                <DrawerBody>
                  <Text as={"b"}>Until...</Text>
                  <Text mb={4}>
                    {activeEveryday?.time !== null
                      ? activeEveryday?.time
                      : "unlimited"}
                  </Text>
                  <Text as={"b"}>Description</Text>

                  <Text as={"b"}>Done?</Text>
                  <Text>
                    {activeEveryday?.done === true ? "complete" : "Not Yet"}
                  </Text>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Box>
        ))}
        <Box
          bgColor={"green.300"}
          h={"100%"}
          w={7}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          pl={1}
          right={-900}
        >
          <FaCaretRight color="white" fontSize={32} />
        </Box>
      </HStack>
      <Heading py={5}>Plan</Heading>
      <HStack
        position={"relative"}
        shadow={"xl"}
        w={{
          sm: "20%",
          md: "50%",
        }}
        h={200}
        rounded={"2xl"}
        py={10}
        ref={stackRefPlan}
        align="center"
        overflowX="hidden"
        overflowY="hidden"
        cursor="grab"
        onMouseDown={(e) => handleMouseDownPlan(e, stackRefPlan)}
        onMouseUp={handleMouseUpOrLeavePlan}
        onMouseLeave={handleMouseUpOrLeavePlan}
        onMouseMove={(e) => handleMouseMovePlan(e, stackRefPlan)}
        // Touch Events
        onTouchStart={(e) => handleTouchStart(e, stackRefPlan)}
        onTouchMove={(e) => handleTouchMove(e, stackRefPlan)}
        onTouchEnd={handleTouchEnd}
      >
        <Box
          bgColor={"green.300"}
          h={"100%"}
          w={7}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          pr={1}
        >
          <FaCaretLeft color="white" fontSize={32} />
        </Box>
        {plans.map((plan) => (
          <Box key={plan.name} mx={20}>
            <Button
              shadow={"2xl"}
              onClick={() => {
                setActivePlan(plan);
                onPlanOpen();
              }}
              rounded={"3xl"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              w={130}
              h={150}
              bgColor={plan.done ? "blue.300" : "red.300"}
            >
              <VStack noOfLines={1}>
                <Text>{plan.name}</Text>
                <Text>{plan.time}</Text>
              </VStack>
            </Button>
            <Drawer
              key={activePlan?.name}
              onClose={onPlanClose}
              isOpen={isPlanOpen}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">
                  {activePlan?.name}
                </DrawerHeader>
                <DrawerBody>
                  <Text as={"b"}>Until...</Text>
                  <Text mb={4}>
                    {activePlan?.time !== null ? activePlan?.time : "unlimited"}
                  </Text>
                  <Text as={"b"}>Description</Text>
                  <Text mb={4}>{activePlan?.description}</Text>
                  <Text as={"b"}>Done?</Text>
                  <Text>
                    {activePlan?.done === true ? "complete" : "Not Yet"}
                  </Text>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Box>
        ))}
        <Box
          bgColor={"green.300"}
          h={"100%"}
          w={7}
          position={"absolute"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          pl={1}
          right={-900}
        >
          <FaCaretRight color="white" fontSize={32} />
        </Box>
      </HStack>
    </VStack>
  );
}
