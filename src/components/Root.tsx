import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Footer from "./Footer";
import HomeHeader from "./Header";
import HomeNavigationBar from "./NavigationBar";

export default function HomeRoot() {
  return (
    <Box>
      <HomeHeader />
      <HomeNavigationBar />
      <Outlet />
      <Footer />
      <ReactQueryDevtools />
    </Box>
  );
}
