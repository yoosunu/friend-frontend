import Cookie from "js-cookie";
import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { IEveryday, IPlan, ITDs, ITks } from "./components/types";
import { ITkDelete } from "./components/routes/ThanksDatesDetail";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000/api/v1/"
      : "https://apot-xif6.onrender.com/api/v1/",
  withCredentials: true,
});

// sign up

export interface ISignUpVars {
  username: string;
  password: string;
  email: string;
}

export interface ISignUpSuccess {
  ok: string;
}
export interface ISignUpError {
  error: string;
}

export const signUp = ({ username, password, email }: ISignUpVars) =>
  instance
    .post(
      `/users/sign-up`,
      { username, password, email },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// login
export const getMe = () =>
  instance.get(`users/me`).then((response) => response.data);

export interface IGHLoginVars {
  code: string;
}

export interface IGHLoginSuccess {
  data: string;
}

export interface IGHLoginError {
  error: string;
}

export const githubLogIn = ({ code }: IGHLoginVars) =>
  instance
    .post(
      `/users/github`,
      { code },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => {
      console.log(response.data);
      return response.data;
    });

export interface IBasicLoginVars {
  username: string;
  password: string;
}
export interface IBasicLoginSuccess {
  ok: string;
}
export interface IBasicLoginError {
  error: string;
}

export const basicLogIn = ({ username, password }: IBasicLoginVars) =>
  instance
    .post(
      `/users/log-in`,
      { username, password },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

export const kakaoLogIn = (code: string) =>
  instance
    .post(
      `/users/kakao`,
      { code },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.status);

// logOut
export const logOut = () =>
  instance
    .post(`users/log-out`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

// chatRooms
export const getChats = () =>
  instance.get("chats/").then((response) => response.data);

export const getChat = ({ queryKey }: QueryFunctionContext) => {
  const [_, chatId] = queryKey;
  return instance.get(`chats/${chatId}`).then((response) => response.data);
};

// users

export const getUsers = async () => {
  const response = await instance.get(`users/`);
  return response.data;
};

// chatRooms
export interface IPostChatRoomVars {
  name: string;
  users: number[];
}

export interface IPostChatRoomSuccess {
  name: string;
}

export const postChatRoom = async (data: IPostChatRoomVars) => {
  const response = await instance.post(`chats/`, data, {
    headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
  });
  return response.data;
};

export interface IDeleteChatRoomVar {
  name: string;
}
export const deleteChatRoom = async (data: IDeleteChatRoomVar) => {
  const response = await instance.delete(`chats/@${data.name}`, {
    headers: { "X-CSRFToken": Cookie.get("csrftoken") || "" },
  });
  return response.data;
};

//chats

export const getChatDetails = async ({ queryKey }: QueryFunctionContext) => {
  const [_, chatRoomName] = queryKey;
  const response = await instance.get(`chats/${chatRoomName}`);
  return response.data;
};

export interface IChatPostVars {
  chatRoomName: string;
  chat: string;
}

export const postChatDetail = (data: IChatPostVars) =>
  instance
    .post(`chats/${data.chatRoomName}`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

// thanksDates
export const getTDs = () =>
  instance.get("thanks/").then((response) => response.data);

export const getTD = ({ queryKey }: QueryFunctionContext) => {
  const [_, tdId] = queryKey;
  instance.get(`thanks/${tdId}`).then((response) => response.data);
};

// thanksDates-post
export const postTD = async (data: ITDs) => {
  const response = await instance.post(`thanks/`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

// thanksDates-delete
export const deleteTD = async (data: ITDs) => {
  const response = await instance.delete(`thanks/${data.id}`, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

//tks
export const getTks = async ({ queryKey }: QueryFunctionContext) => {
  const [_, tdId] = queryKey;
  const response = await instance.get(`thanks/${tdId}/tks`);
  return response.data;
};

//tks-post
export const postTk = async (data: ITks) => {
  const response = await instance.post(`thanks/${data.id}/tks`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};
// tk-delete
export const deleteTk = async (data: ITkDelete) => {
  const response = await instance.delete(`thanks/${data.id}/tks/${data.tkId}`, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

// todos
export const getTodos = () =>
  instance.get("todos/").then((response) => response.data);

export const getTodo = ({ queryKey }: QueryFunctionContext) => {
  const [_, todoId] = queryKey;
  return instance.get(`todos/${todoId}`).then((response) => response.data);
};

export const getEverydays = ({ queryKey }: QueryFunctionContext) => {
  const [_, todoId] = queryKey;
  instance.get(`todos/${todoId}/everydays`).then((response) => response.data);
};

export const getPlans = ({ queryKey }: QueryFunctionContext) => {
  const [_, todoId] = queryKey;
  instance.get(`todos/${todoId}/plans`).then((response) => response.data);
};

// todos-post
export interface IPostTodoVar {
  name: string;
  everydays: IEveryday[];
  plans: IPlan[];
}

export const postTodo = async (data: IPostTodoVar) => {
  const response = await instance.post(`todos/`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

// todos-delete

export interface IDeleteTodoVar {
  id: string;
}

export const deleteTodo = async (data: IDeleteTodoVar) => {
  const response = await instance.delete(`todos/${data.id}`, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

// todo-everyday
export const postEveryday = async (data: IEveryday) => {
  const response = await instance.post(`todos/${data.id}/everydays`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

export const putEveryday = async (data: IEveryday) => {
  const response = await instance.put(
    `todos/${data.id}/everydays/${data.everydayId}`,
    data,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};

export const deleteEveryday = async (data: IEveryday) => {
  const response = await instance.delete(
    `todos/${data.id}/everydays/${data.everydayId}`,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};

// todo-plan
export interface IPostPlanError {
  detail: string;
}

export const postPlan = async (data: IPlan) => {
  const response = await instance.post(`todos/${data.id}/plans`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

export const putPlan = async (data: IPlan) => {
  const response = await instance.put(
    `todos/${data.id}/plans/${data.planId}`,
    data,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};

export const deletePlan = async (data: IPlan) => {
  const response = await instance.delete(
    `todos/${data.id}/plans/${data.planId}`,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};
// weather
export const getWeather = async () => {
  const city = "Jeonju";
  const apiKey = "f57c3b4807f44b35c84a1295ca2ccac7";

  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather`,
    {
      params: {
        q: city,
        appid: apiKey,
        units: "metric",
      },
    }
  );
  return response.data;
};

// items
// items - get
export const getItems = () =>
  instance.get("items/").then((response) => response.data);

export const getItem = ({ queryKey }: QueryFunctionContext) => {
  const [_, itemId] = queryKey;
  return instance.get(`items/${itemId}`).then((response) => response.data);
};

export const getItemReviews = ({ queryKey }: QueryFunctionContext) => {
  const [_, itemId] = queryKey;
  return instance
    .get(`items/${itemId}/reviews`)
    .then((response) => response.data);
};

// items - post

export interface IItemPostVars {
  title: string;
  description: string;
  file: string;
  language: string;
  category: number;
  tags: number[];
  photos: string;
}

export interface IItemPostSuccess {
  id: number;
  rating: number;
  is_owner: boolean;
  is_liked: boolean;
  photos: string[];
  title: string;
  description: string;
  file: string;
  language: string;
  user: number;
  category: number;
  tags: number[];
}

export interface IItemPostError {
  detail: string[];
  error: string[];
}

export const postItem = (data: IItemPostVars) =>
  instance
    .post(`items/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

export const getTags = () =>
  instance.get("items/tags").then((response) => response.data);

export const getCategories = () =>
  instance.get("categories").then((response) => response.data);

export interface IAddWishVars {
  itemId: string;
}

// wishlist

export const getWishlist = async () => {
  const response = await instance.get(`wishlists/`);
  return response.data;
};
export const addWish = async (data: IAddWishVars) => {
  const response = await instance.put(
    `wishlists/4/items/${data.itemId}`,
    data,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.status;
};

// items - put

export interface IItemPutVars {
  itemId: string;
  title?: string;
  description?: string;
  language?: string;
  tags?: number[];
  tips_payload?: string;
  tips_highlight?: string;
  rules_payload?: string;
  rules_highlight?: string;
  file?: string;
}

export interface IItemPutError {
  error: string;
}

export const putItem = async ({
  itemId,
  title,
  description,
  language,
  tags,
  tips_payload,
  tips_highlight,
  rules_payload,
  rules_highlight,
  file,
}: IItemPutVars) => {
  const response = await instance.put(
    `items/${itemId}`,
    {
      itemId,
      title,
      description,
      language,
      tags,
      tips_payload,
      tips_highlight,
      rules_payload,
      rules_highlight,
      file,
    },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};

// review

export interface IReviewUploadVars {
  itemId: string;
  review: string;
  rating: number;
}

// export interface IReviewUploadSuccess {}

export interface IReviewUploadError {
  detail: string;
}

export const uploadReview = async (data: IReviewUploadVars) => {
  const response = await instance.post(`items/${data.itemId}/reviews`, data, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};

export interface IReviewDeleteVars {
  itemId: string;
  reviewId: string;
}

export const deleteReview = async (data: IReviewDeleteVars) => {
  const response = await instance.delete(
    `items/${data.itemId}/reviews/${data.reviewId}`,
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.status;
};

// photos

export interface IPhotoUploadSuccess {
  data: string;
}

export interface IPhotoUploadError {
  error: string;
}

export interface IPhotoUploadVars {
  file: File;
  // uploadURL: string;
  description: string;
}

export const postPhotos = async ({
  file,
  // uploadURL,
  description,
}: IPhotoUploadVars) => {
  const response = await axios.post(
    `http://127.0.0.1:8000/api/v1/items/3/photos`,
    { file, description },
    {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    }
  );
  return response.data;
};

// notifications
export const getNotifications = async () => {
  const response = await instance.get(`notifications/`, {
    headers: {
      "X-CSRFToken": Cookie.get("csrftoken") || "",
    },
  });
  return response.data;
};
