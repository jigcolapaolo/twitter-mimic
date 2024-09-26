import { Timeline, User } from "@/lib/definitions";
import { ChangeEvent, useMemo, useState } from "react";

export const TWEET_FILTER = {
  TOP: "top",
  RECENT: "recent",
  MY_TWEETS: "myTweets",
};

interface UseFiltersProps {
  timeline: Timeline[];
  userId: string | undefined;
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
}

export default function useFilters({ timeline, userId, selectedUser, setSelectedUser }: UseFiltersProps) {
  const [filter, setFilter] = useState(TWEET_FILTER.TOP);

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);

    if (value === TWEET_FILTER.MY_TWEETS) {
      setSelectedUser(null);
    }
  };

  const filteredTweets = useMemo(() => {
    let tweets = [...timeline];
    switch (filter) {
      case TWEET_FILTER.TOP:
        tweets.sort((a, b) => b.likesCount - a.likesCount);
        break;
      case TWEET_FILTER.RECENT:
        tweets.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case TWEET_FILTER.MY_TWEETS:
        tweets = tweets.filter((tweet) => tweet.userId === userId);
        break;
    }

    if (selectedUser != null) {
      tweets = tweets.filter((tweet) => tweet.userId === selectedUser.uid);
      return tweets
    } else {
      return tweets;
    }

  }, [filter, timeline, userId, selectedUser]);

  return {
    filter,
    setFilter,
    handleChangeFilter,
    filteredTweets,
  }
}
