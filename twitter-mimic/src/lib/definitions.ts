export interface User {
  email: string;
  avatar: string;
  displayName: string;
  uid: string;
  likedTweets: string[];
  sharedTweets: string[];
}

export interface Timeline {
  id: string;
  img: string;
  avatar: string;
  userName: string;
  userId: string;
  content: string;
  likesCount: number;
  sharedCount: number;
  createdAt: number;
  usersLiked?: string[];
  usersComments?: string[];
  sharedUserName: string | undefined;
  sharedAvatar: string | undefined;
  sharedCreatedAt: number | undefined;
  sharedId: string | undefined;
}

export interface SharedTweets {
  id: string;
  img: string;
  avatar: string;
  userName: string;
  userId: string;
  content: string;
  likesCount: number;
  sharedCount: number;
  createdAt: number;
  usersLiked?: string[];
  usersComments?: string[];
  sharedUserName: string;
  sharedAvatar: string;
  sharedCreatedAt: number;
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
