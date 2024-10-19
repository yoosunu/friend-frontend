import { useEffect } from "react";
import useUser from "../lib/useUser";
import { useNavigate } from "react-router-dom";

interface IHostOnlyPageProps {
  children: React.ReactNode;
}

export default function HostOnlyPage({ children }: IHostOnlyPageProps) {
  const { user, userLoading } = useUser();
  const navigate = useNavigate();
  useEffect(() => {
    if (!userLoading) {
      if (!user?.is_host) {
        navigate("/");
      }
    }
  }, [userLoading, navigate]);
  return <>{children}</>;
}
