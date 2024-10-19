import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import { IUser } from "../components/types";

export default function useUser() {
  const { isLoading, data, isError } = useQuery<IUser>(["me"], getMe, {
    retry: false,
  });

  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError,
  };
}
