import { createBrowserRouter } from "react-router-dom";
import HomeRoot from "./components/Root";
import NotFound from "./components/routes/NotFound";
import Home from "./components/routes/Home";
import ItemDetail from "./components/routes/ItemDetail";
import Chats from "./components/routes/Chats";
import GithubConfirm from "./components/routes/GithubConfirm";
import ThanksDates from "./components/routes/ThanksDates";
import Todos from "./components/routes/Todos";
import KakaoConfirm from "./components/routes/KakaoConfirm";
import Weathers from "./components/routes/WeathersInfos";
import Profile from "./components/routes/Profile";
import UploadItem from "./components/routes/UploadItem";
import PutItem from "./components/routes/PutItem";
import UploadPhoto from "./components/routes/UploadPhoto";
import ChatDetail from "./components/routes/ChatDetail";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRoot />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "items",
        children: [
          {
            path: "upload",
            element: <UploadItem />,
          },

          {
            path: ":itemId",
            element: <ItemDetail />,
          },
          {
            path: ":itemId/put",
            element: <PutItem />,
          },
          {
            path: ":itemId/photos",
            element: <UploadPhoto />,
          },
        ],
      },
      {
        path: "chats",
        element: <Chats />,
      },
      {
        path: "chats/:chatRoomName",
        element: <ChatDetail />,
      },
      {
        path: "thanks",
        element: <ThanksDates />,
        children: [
          {
            path: ":thankId",
          },
        ],
      },
      {
        path: "todos",
        element: <Todos />,
      },
      {
        path: "weathers",
        element: <Weathers />,
      },
      {
        path: "users",
        children: [
          {
            path: "me",
            element: <Profile />,
          },
        ],
      },
      {
        path: "social",
        children: [
          {
            path: "github",
            element: <GithubConfirm />,
          },
          {
            path: "kakao",
            element: <KakaoConfirm />,
          },
        ],
      },
    ],
  },
]);

export default router;
