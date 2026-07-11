export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  reactions: Record<string, number>;
  comments: Comment[];
}

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  avatar?: string;
  reactions: Record<string, number>;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  isFriend: boolean;
  isFollowing: boolean;
  lastActive: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  gCashNumber: string;
  amount: number;
  status: "pending" | "confirmed";
  createdAt: string;
}

export type ConsoleViewType =
  | "responsive"
  | "nintendo_switch"
  | "ps5"
  | "ps4"
  | "ps3"
  | "ps2"
  | "ps1"
  | "xbox_one"
  | "xbox_360"
  | "nintendo_ds_3ds"
  | "psp_psvita";
