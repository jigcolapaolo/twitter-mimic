export interface User {
  email: string;
  avatar: string;
  displayName: string;
  uid: string;
  likedTweets: string[];
  sharedTweets: string[];
}

export interface Timeline {
  userId: string;
  id: string;
  img: string;
  avatar: string;
  userName: string;
  content: string;
  likesCount: number;
  sharedCount: number;
  createdAt: number;
  usersLiked?: string[];
  sharedId: string | undefined;
  usersComments?: string[];
}

export interface SharedTweet {
  id: string;
  img: string;
  userId: string;
  userName: string;
  sharedUserName: string;
  avatar: string;
  sharedAvatar: string;
  content: string;
  likesCount: number;
  sharedCount: number;
  createdAt: number;
  sharedCreatedAt: number;
  usersLiked?: string[];
  usersComments?: string[];
}

export interface LikeModalState {
  id: string | undefined;
  usersLiked: User[];
}

export interface Comment {
  id: string;
  content: string;
  tweetId: string;
  userId: string;
  userName: string;
  avatar: string;
  createdAt: number;
}
