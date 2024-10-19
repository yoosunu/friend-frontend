import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { githubLogIn, IGHLoginError, IGHLoginSuccess } from "../../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface IGHLoginForm {
  code: string;
}

export default function GithubConfirm() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { search } = useLocation();
  const code = new URLSearchParams(search).get("code");
  const mutation = useMutation<IGHLoginSuccess, IGHLoginError, IGHLoginForm>(
    githubLogIn,
    {
      onMutate: () => {},
      onSuccess: (data) => {
        toast({
          status: "success",
          title: "Welcome!",
          description: `Happy to join you!`,
        });
        queryClient.refetchQueries(["me"]);
        navigate("/");
      },
      onError: (error) => {
        toast({
          status: "error",
          title: "Login Failed!",
          description: `Something wrong in your github account`,
        });
        navigate("/");
      },
    }
  );

  useEffect(() => {
    if (code) {
      mutation.mutate({ code });
    }
  }, []);
  return (
    <VStack mt={40} justifyContent={"center"}>
      <Heading>Processing log in...</Heading>
      <Text>Wait a moment please...</Text>
      <Spinner size={"lg"} />
    </VStack>
  );
}
