export interface User {
  email: string;
  avatar: string;
  displayName: string;
  uid: string;
  likedTweets: string[];
}

export interface Timeline {
  userId: string;
  id: string;
  img: string;
  avatar: string;
  userName: string;
  content: string;
  name?: string;
  likesCount: number;
  sharedCount: number;
  createdAt: number;
  usersLiked?: string[];
}
