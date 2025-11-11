import {
  Box,
  HStack,
  Spinner,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalOverlay,
  Button,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { INotifications } from "../types";
import { getNotifications } from "../../api";
import HostOnlyPage from "../HostOnlyPage";
import Protectedpage from "../ProtectedPage";
import { useState } from "react";
import { FaClock, FaHashtag, FaKey, FaTag } from "react-icons/fa";

export default function Notifications() {
  const { isLoading, data } = useQuery<INotifications[]>({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeNoti, setActivNoti] = useState<INotifications | null>(null);

  return (
    <Protectedpage>
      <HostOnlyPage>
        <Box mt={20} px={{ base: 10, lg: 40 }}>
          <VStack
            height={600}
            overflow={"scroll"}
            display={"flex"}
            justifyContent={"flex-start"}
          >
            {isLoading ? (
              <Spinner />
            ) : (
              data
                ?.slice()
                .sort((a, b) => b.code - a.code)
                .map((noti) => (
                  <Box
                    py={2}
                    key={noti.id}
                    w={"100%"}
                    border={"1px"}
                    borderColor={"green.400"}
                    rounded={"2xl"}
                    mb={2}
                    shadow={"2xl"}
                    onClick={() => {
                      onOpen();
                      setActivNoti(noti);
                    }}
                  >
                    <HStack px={4}>
                      <Box textAlign={"center"} w={"10%"}>
                        <Text>{noti.code}</Text>
                      </Box>
                      <Box textAlign={"center"} w={"10%"}>
                        <Text>{noti.tag}</Text>
                      </Box>
                      <Box textAlign={"start"} w={"40%"}>
                        <Text noOfLines={1}>{noti.title}</Text>
                      </Box>
                      <Box textAlign={"center"} w={"15%"}>
                        <Text noOfLines={1}>{noti.writer}</Text>
                      </Box>
                      <Box textAlign={"center"} w={"15%"}>
                        <Text noOfLines={1}>{noti.etc}</Text>
                      </Box>
                    </HStack>
                  </Box>
                ))
            )}
          </VStack>
          <Modal
            isOpen={isOpen}
            onClose={onClose}
            aria-hidden={false}
            useInert={false}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{activeNoti?.title}</ModalHeader>
              <ModalBody>
                <HStack mb={3}>
                  <FaKey />
                  <Text>{activeNoti?.code}</Text>
                </HStack>
                <HStack mb={3}>
                  <FaTag />
                  <Text>{activeNoti?.tag}</Text>
                </HStack>
                <HStack mb={3}>
                  <FaHashtag />
                  <Text>{activeNoti?.writer}</Text>
                </HStack>
                <HStack mb={3}>
                  <FaClock />
                  <Text>{activeNoti?.etc}</Text>
                </HStack>
                <Button
                  onClick={() =>
                    (window.location.href = activeNoti?.link || "")
                  }
                  colorScheme="green"
                  my={4}
                  w={"100%"}
                >
                  Go to site
                </Button>
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </HostOnlyPage>
    </Protectedpage>
  );
}
