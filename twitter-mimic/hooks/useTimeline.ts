import { SharedTweet, Timeline, User } from "@/lib/definitions";
import { useEffect, useState } from "react";
import {
  fetchTweetById,
  listenLatestTweets,

  loadMoreTweets,

} from "../firebase/client";
import { FilterState } from "@/app/search/page";

interface UseTimelineProps {
  singleTimeline?: Timeline[];
  user?: User | null;
  filterState?: FilterState;
}

export default function useTimeline({
  singleTimeline,
  user,
  filterState,
}: UseTimelineProps) {
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [retweets, setRetweets] = useState<SharedTweet[]>([]);
  const [loading, setLoading] = useState(true);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    if (!user) return;

    if (singleTimeline) {
      setTimeline(singleTimeline);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribe = listenLatestTweets(
      (newTweets : any) => {
        setTimeline(newTweets);
        setLoading(false);
      },
      filterState?.filter,
      filterState?.filterUserId
    );
  
    return () => unsubscribe && unsubscribe();

  }, [user, singleTimeline, filterState]);

  const handleLoadMore = () => {
    loadMoreTweets(
      (newTweets: any) => {
        setTimeline((prev) => [
          ...prev.filter((tweet) => !newTweets.some((nt: any) => nt.id === tweet.id)),
          ...newTweets,
        ]);
      },
      setIsFetchingMore,
      filterState?.filter,
      filterState?.filterUserId
    );
  };
  

  useEffect(() => {
    const fetchRetweets = async () => {
      const retweetsPromise = timeline
        .filter((tweet) => tweet.sharedId)
        .map(async (tweet) => {
          const retweetData = await fetchTweetById(tweet.sharedId as string);
          return retweetData;
        });

      const resolvedRetweets = await Promise.all(retweetsPromise);
      setRetweets(resolvedRetweets);
      setLoading(false);
    };

    if (timeline.some((tweet) => tweet.sharedId)) {
      fetchRetweets();
    } else {
      setLoading(false);
    }
  }, [timeline]);

  return {
    timeline,
    retweets,
    loading,
    isFetchingMore,
    handleLoadMore,
  };
}
