import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";

import "react-calendar/dist/Calendar.css";
import { IEveryday, IPlan } from "./types";
import { useRef, useState } from "react";
import React from "react";
import { FaBars, FaCaretLeft, FaCaretRight, FaPlus } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteEveryday,
  deletePlan,
  IPostPlanError,
  postEveryday,
  postPlan,
  putEveryday,
  putPlan,
} from "../api";
import { useForm } from "react-hook-form";

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
  const toast = useToast();
  const queryClient = useQueryClient();

  // disclosure section
  const {
    isOpen: isEverydayOpen,
    onOpen: onEverydayOpen,
    onClose: onEverydayClose,
  } = useDisclosure();

  const {
    isOpen: isPutEverydayOpen,
    onOpen: onPutEverydayOpen,
    onClose: onPutEverydayClose,
  } = useDisclosure();

  const {
    isOpen: isPlanOpen,
    onOpen: onPlanOpen,
    onClose: onPlanClose,
  } = useDisclosure();

  const {
    isOpen: isPutPlanOpen,
    onOpen: onPutPlanOpen,
    onClose: onPutPlanClose,
  } = useDisclosure();

  // useForm section
  const { register: registerEveryday, handleSubmit: handleSubmitEveryday } =
    useForm<IEveryday>();
  const {
    register: registerEverydayPut,
    handleSubmit: handleSubmitEverydayPut,
  } = useForm<IEveryday>();
  const {
    register: registerEverydayDelete,
    handleSubmit: handleSubmitEverydayDelete,
  } = useForm<IEveryday>();
  const { register: registerPlan, handleSubmit: handleSubmitPlan } =
    useForm<IPlan>();
  const { register: registerPlanPut, handleSubmit: handleSubmitPlanPut } =
    useForm<IPlan>();
  const { register: registerPlanDelete, handleSubmit: handleSubmitPlanDelete } =
    useForm<IPlan>();

  // mutation section
  const mutationEverydayPost = useMutation<any, any, IEveryday>(postEveryday, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Everyday updated",
      });

      queryClient.invalidateQueries(["todos"]);
      onEverydayClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });
  const mutationEverydayPut = useMutation<any, any, IEveryday>(putEveryday, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Changed",
      });

      queryClient.invalidateQueries(["todos"]);
      onPutEverydayClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });
  const mutationEverydayDelete = useMutation<any, any, IEveryday>(
    deleteEveryday,
    {
      onSuccess: () => {
        toast({
          status: "success",
          title: "Succeed",
          description: "Changed",
        });
        queryClient.invalidateQueries(["todos"]);
        onPutEverydayClose();
        window.location.reload();
      },
      onError: () => {
        toast({
          status: "error",
          title: "Failed",
          description: "Something wrong",
        });
      },
    }
  );
  const mutationPlanPost = useMutation<any, IPostPlanError, IPlan>(postPlan, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Plan updated",
      });
      console.log(data);
      queryClient.invalidateQueries(["todos"]);
      onPlanClose();
    },
    onError: (error) => {
      toast({
        status: "error",
        title: "Failed",
        description: `${error.detail}`,
      });
    },
  });
  const mutationPlanPut = useMutation<any, any, IPlan>(putPlan, {
    onMutate: () => {},
    onSuccess: (data) => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Plan updated",
      });

      queryClient.invalidateQueries(["todos"]);
      onPutPlanClose();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });
  const mutationPlanDelete = useMutation<any, any, IPlan>(deletePlan, {
    onSuccess: () => {
      toast({
        status: "success",
        title: "Succeed",
        description: "Changed",
      });
      queryClient.invalidateQueries(["todos"]);
      onPutPlanClose();
      window.location.reload();
    },
    onError: () => {
      toast({
        status: "error",
        title: "Failed",
        description: "Something wrong",
      });
    },
  });

  // onSubmit section
  const onSubmitEveryday = (data: IEveryday) => {
    mutationEverydayPost.mutate(data);
  };
  const onSubmitEverydayPut = (data: IEveryday) => {
    mutationEverydayPut.mutate(data);
  };
  const onSubmitEverydayPutDone = (id: string, everyday: IEveryday) => {
    mutationEverydayPut.mutate({
      id: id,
      everydayId: everyday.id,
      done: !everyday.done,
      name: everyday.name,
      time: everyday.time,
    });
  };
  const onSubmitEverydayDelete = (data: IEveryday) => {
    mutationEverydayDelete.mutate(data);
  };
  const onSubmitPlan = (data: IPlan) => {
    mutationPlanPost.mutate(data);
  };
  const onSubmitPlanPut = (data: IPlan) => {
    mutationPlanPut.mutate(data);
  };
  const onSubmitPlanPutDone = (id: string, plan: IPlan) => {
    mutationPlanPut.mutate({
      id: id,
      planId: plan.id,
      name: plan.name,
      time: plan.time,
      description: plan.description,
      done: !plan.done,
    });
  };
  const onSubmitPlanDelete = (data: IPlan) => {
    mutationPlanDelete.mutate(data);
  };
  return (
    <VStack alignItems={"center"}>
      <Button
        onClick={onEverydayOpen}
        border={"1px"}
        borderColor={"green.300"}
        as={"b"}
        py={6}
        fontSize={20}
      >
        Everyday{" "}
        <Box ml={2}>
          <FaPlus color="green" />
        </Box>
      </Button>
      <HStack
        //display
        border={"1px"}
        borderColor={"green.300"}
        position={"relative"}
        mt={6}
        mb={20}
        py={2}
        shadow={"xl"}
        w={{
          sm: 400,
          md: 800,
        }}
        rounded={"2xl"}
        ref={stackRefEveryday}
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
          // arrow button
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
          <Box borderRadius={"3xl"} key={everyday.id} mx={10}>
            <VStack rounded={"3xl"} shadow={"2xl"}>
              <Box>
                <Button
                  onClick={handleSubmitEverydayPut(() =>
                    onSubmitEverydayPutDone(id, everyday)
                  )}
                  roundedTop={"3xl"}
                  roundedBottom={"none"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  w={120}
                  h={130}
                  bgColor={everyday.done ? "blue.300" : "red.300"}
                >
                  <VStack>
                    <Text>{everyday.name}</Text>
                    <Text>{everyday.time}</Text>
                  </VStack>
                </Button>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"center"}
                w={"100%"}
                pb={2}
                onClick={() => {
                  setActiveEveryday(everyday);
                  onPutEverydayOpen();
                }}
              >
                <FaBars />
              </Box>
            </VStack>
            <Modal
              onClose={onPutEverydayClose}
              isOpen={isPutEverydayOpen}
              aria-hidden={false}
              useInert={false}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader borderBottomWidth="1px">
                  {activeEveryday?.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid templateColumns={"1fr 1fr"}>
                    <VStack alignItems={"flex-start"}>
                      <Box mb={4} color={"green.400"} w={"100%"}>
                        <Text as={"b"}>Initial</Text>
                      </Box>
                      <Text as={"b"}>Time</Text>
                      <Text mb={4}>
                        {activeEveryday?.time !== null
                          ? activeEveryday?.time
                          : "unlimited"}
                      </Text>
                    </VStack>
                    <VStack mb={5} alignItems={"flex-start"}>
                      <Box mb={4} color={"green.400"} w={"100%"}>
                        <Text as={"b"}>Change Part</Text>
                      </Box>
                      <Text as={"b"}>Time</Text>
                      <Input
                        type="time"
                        {...registerEverydayPut("time", { required: false })}
                        size={"xs"}
                        w={"70%"}
                      />
                    </VStack>
                    <VStack alignItems={"flex-start"}>
                      <Text as={"b"}>Done?</Text>
                      <Text>{activeEveryday?.done === true ? "✔" : "❌"}</Text>
                    </VStack>
                    <VStack alignItems={"flex-start"}>
                      <Text as={"b"}>Name</Text>
                      <HStack w={"100%"}>
                        <Input
                          placeholder="name"
                          {...registerEverydayPut("name", { required: false })}
                          size={"xs"}
                          width={"70%"}
                        />
                      </HStack>
                    </VStack>
                    <Input
                      {...registerEverydayDelete("id")}
                      value={id}
                      type="hidden"
                    />
                    <Input
                      {...registerEverydayDelete("everydayId")}
                      value={everyday.id}
                      type="hidden"
                    />
                  </Grid>

                  <HStack mt={8} mb={3}>
                    <Button
                      onClick={handleSubmitEverydayPut(onSubmitEverydayPut)}
                      colorScheme="green"
                      width={"100%"}
                    >
                      Change
                    </Button>
                    <Button
                      onClick={handleSubmitEverydayDelete(
                        onSubmitEverydayDelete
                      )}
                      colorScheme="red"
                      width={"100%"}
                    >
                      Delete
                    </Button>
                  </HStack>
                  <FormControl>
                    <Input
                      {...registerEverydayPut("id")}
                      type="hidden"
                      value={id}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...registerEverydayPut("everydayId")}
                      type="hidden"
                      value={everyday.id}
                    />
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
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
      <Button
        onClick={onPlanOpen}
        border={"1px"}
        borderColor={"green.300"}
        as={"b"}
        py={6}
        fontSize={20}
      >
        Plan
        <Box ml={2}>
          <FaPlus color="green" />
        </Box>
      </Button>
      <HStack
        //display
        border={"1px"}
        borderColor={"green.300"}
        position={"relative"}
        shadow={"xl"}
        py={2}
        mt={6}
        w={{
          sm: 400,
          md: 800,
        }}
        rounded={"2xl"}
        ref={stackRefPlan}
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
          <Box key={plan.name} mx={10}>
            <VStack rounded={"3xl"} shadow={"2xl"}>
              <Box>
                <Button
                  onClick={handleSubmitPlanPut(() =>
                    onSubmitPlanPutDone(id, plan)
                  )}
                  roundedTop={"3xl"}
                  roundedBottom={"none"}
                  key={plan.name}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  w={120}
                  h={130}
                  bgColor={plan.done ? "blue.300" : "red.300"}
                >
                  <VStack>
                    <Text>{plan.name}</Text>
                    <Text>{new Date(plan.time).toLocaleDateString()}</Text>
                  </VStack>
                </Button>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"center"}
                w={"100%"}
                pb={2}
                onClick={() => {
                  setActivePlan(plan);
                  onPutPlanOpen();
                }}
              >
                <FaBars />
              </Box>
            </VStack>
            <Modal
              onClose={onPutPlanClose}
              isOpen={isPutPlanOpen}
              aria-hidden={false}
              useInert={false}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader borderBottomWidth="1px">
                  {activePlan?.name}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Grid templateColumns={"1fr 1fr"}>
                    <VStack alignItems={"flex-start"}>
                      <Box mb={4} color={"green.400"} w={"100%"}>
                        <Text as={"b"}>Initial</Text>
                      </Box>
                      <Text as={"b"}>Time</Text>
                      <Text mb={4}>
                        {activePlan && activePlan.time
                          ? new Date(activePlan.time).toLocaleDateString()
                          : "unlimited"}
                      </Text>
                    </VStack>
                    <VStack mb={5} alignItems={"flex-start"}>
                      <Box mb={4} color={"green.400"} w={"100%"}>
                        <Text as={"b"}>Change Part</Text>
                      </Box>
                      <Text as={"b"}>Time</Text>
                      <FormControl>
                        <Input
                          type="date"
                          {...registerPlanPut("time", { required: false })}
                          placeholder="wanna change time?"
                          size={"xs"}
                          w={"70%"}
                        />
                      </FormControl>
                    </VStack>
                    <VStack alignItems={"flex-start"}>
                      <Text as={"b"}>Done?</Text>
                      <Text>{activePlan?.done === true ? "✔" : "❌"}</Text>
                    </VStack>
                    <VStack alignItems={"flex-start"}>
                      <Text>Name</Text>
                      <FormControl>
                        <Input
                          placeholder="Wanna change name?"
                          {...registerPlanPut("name", { required: false })}
                          size={"xs"}
                          width={"70%"}
                        />
                      </FormControl>
                    </VStack>
                    <Input
                      {...registerPlanDelete("id")}
                      type="hidden"
                      value={id}
                    />
                    <Input
                      {...registerPlanDelete("planId")}
                      type="hidden"
                      value={plan.id}
                    />
                  </Grid>

                  <HStack mt={8} mb={3}>
                    <Button
                      onClick={handleSubmitPlanPut(onSubmitPlanPut)}
                      colorScheme="green"
                      width={"100%"}
                    >
                      Change
                    </Button>
                    <Button
                      onClick={handleSubmitPlanDelete(onSubmitPlanDelete)}
                      colorScheme="red"
                      width={"100%"}
                    >
                      Delete
                    </Button>
                  </HStack>
                  <FormControl>
                    <Input
                      {...registerPlanPut("id")}
                      type="hidden"
                      value={id}
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      {...registerPlanPut("planId")}
                      type="hidden"
                      value={plan.id}
                    />
                  </FormControl>
                </ModalBody>
              </ModalContent>
            </Modal>
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
      <Modal
        aria-hidden={false}
        useInert={false}
        isOpen={isEverydayOpen}
        onClose={onEverydayClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Everyday</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>name</FormLabel>
              <Input
                {...registerEveryday("name", { required: true })}
                mb={6}
                placeholder="name of the Everyday"
              />
            </FormControl>
            <FormControl>
              <FormLabel>time</FormLabel>
              <Input
                type="time"
                {...registerEveryday("time", { required: true })}
                mb={6}
                placeholder="When do you have to do it?"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Done</FormLabel>
              <HStack mb={6}>
                <Checkbox type="hidden" {...registerEveryday("done")} />
                <FormHelperText mb={2}>Done?</FormHelperText>
              </HStack>
            </FormControl>
            <FormControl>
              <Input
                type="hidden"
                {...registerEveryday("id", { required: true })}
                value={id}
              />
            </FormControl>
            <Button
              w={"100%"}
              colorScheme="green"
              mr={3}
              onClick={handleSubmitEveryday(onSubmitEveryday)}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Modal
        aria-hidden={false}
        useInert={false}
        isOpen={isPlanOpen}
        onClose={onPlanClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Plan</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>name</FormLabel>
              <Input
                {...registerPlan("name", { required: true })}
                mb={6}
                placeholder="name of the Plan"
              />
            </FormControl>
            <FormControl>
              <FormLabel>time</FormLabel>
              <HStack>
                <Input
                  type="date"
                  {...registerPlan("time", { required: true })}
                  mb={6}
                  placeholder="Deadline"
                />
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>description</FormLabel>
              <Input
                {...registerPlan("description", { required: false })}
                mb={6}
                placeholder="Detail of the plan."
              />
            </FormControl>
            <FormControl>
              <FormLabel>Done</FormLabel>
              <HStack mb={6}>
                <Checkbox type="hidden" {...registerPlan("done")} />
                <FormHelperText mb={2}>Done?</FormHelperText>
              </HStack>
            </FormControl>
            <FormControl>
              <Input
                type="hidden"
                {...registerPlan("id", { required: true })}
                value={id}
              />
            </FormControl>
            <Button
              w={"100%"}
              colorScheme="green"
              mr={3}
              onClick={handleSubmitPlan(onSubmitPlan)}
            >
              Submit
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
}
