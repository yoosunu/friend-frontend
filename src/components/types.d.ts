export interface IUser {
  last_login: string;
  username: string;
  email: string;
  date_joined: string;
  profile_image: string;
  name: string;
  is_host: boolean;
  gender: string;
  language: string;
}

// items

export interface IItemPhotoPhoto {
  id: string;
  file: string;
  description: string;
}

export interface IItemTagsTag {
  id: number;
  tags: string;
}

export interface IItemList {
  id: string;
  rating: number;
  is_owner: boolean;
  is_wished: boolean;
  title: string;
  description: string;
  file: null;
  imageUrl: string;
  language: string;
  user: number;
  category: ICategory;
  tags: number[];
  photos: IItemPhotoPhoto[];
  tips_payload: string;
  tips_highlight: string;
  rules_payload: string;
  rules_highlight: string;
}

export interface IItemUser {
  name: string;
  profile_image: string;
  username: string;
}

export interface IItemDetail extends IItemList {
  id: string;
  created_at: string;
  updated_at: string;
  description: string;
  imageUrl: string;
  is_owner: boolean;
  is_wished: boolean;
  category: ICategory;
  user: IItemUser;
  tags: IItemTagsTag[];
}

export interface IReview {
  id: string;
  user: IItemUser;
  review: string;
  rating: number;
  is_owner: boolean;
}

// category

export interface ICategory {
  id: string;
  kind: string;
}

// chats

export interface IChatRoomsUser {
  name: string;
  profile_image: string;
  // username: string;
}

export interface IChatRooms {
  id: string;
  owner: IChatsUser;
  name: string;
  users: number[];
  lastChat: string;
  hmp: number;
  people: string[];
}

export interface IChatRoom {
  user: IChatsUser;
  created_at: string;
  chat: string;
}

export interface IChatRoomDetail extends IChatRooms {
  users: IChatsUser[];
  chats: IChat[];
}

export interface IChat {
  id: string;
  user: IChatRoomsUser;
  people: string[];
  created_at: string;
  chat: string;
}

export interface IChatPost {
  chat: string;
}

// thanks

export interface ITDUser {
  name: string;
  profile_image: string;
}

export interface ITDs {
  id: string;
  user: ITDUser;
  created_at: string;
  updated_at: string;
  preview: string;
  diary: string;
}

// tks
export interface ITks {
  id: string;
  thanksDate: ITDs;
  payload: string;
}

export interface ITkDelete extends ITks {
  tdId: string;
}

// todos

export interface IEveryday {
  id: string;
  everydayId: string;
  name: string;
  time: string;
  done: boolean;
}

export interface IPlan {
  id: string;
  planId: string;
  name: string;
  time: Date;
  description: string;
  done: boolean;
}

export interface ITodos {
  id: string;
  name: string;
  everydays: IEveryday[];
  plans: IPlan[];
  created_at: string;
  updated_at: string;
}

export interface ITodoDetail {
  id: string;
  name: string;
  everydays: IEveryday[];
  plans: IPlans[];
}

// weather
export interface IMain {
  feels_like: number;
  humidity: number;
  temp: number;
  temp_max: string;
  temp_min: string;
}

export interface IRain {
  "1h": number;
}

export interface IWeather {
  description: string;
  main: string;
}

export interface IWeathers {
  main: IMain;
  rain: IRain;
  weather: IWeather[];
}

export interface IWishlist {
  pk: string;
  name: string;
  items: IItemList[];
}

export interface INotifications {
  id: string;
  created_at: string;
  code: number;
  tag: string;
  title: string;
  link: string;
  writer: string;
  etc: string;
}
