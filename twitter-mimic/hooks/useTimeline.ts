import { SharedTweet, Timeline, User } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { fetchTweetById, listenLatestTweets } from "../firebase/client";


interface UseTimelineProps {
    singleTimeline?: Timeline[];
    user?: User | null;
}

export default function useTimeline({ singleTimeline, user }: UseTimelineProps) {
    const [timeline, setTimeline] = useState<Timeline[]>(singleTimeline || []);
    const [retweets, setRetweets] = useState<SharedTweet[]>([]);

    useEffect(() => {
        if (!user || singleTimeline) return;
      
        const unsubscribe: any = listenLatestTweets((newTweets: any) => {
          setTimeline(newTweets);
        });
      
        return () => unsubscribe();
      
        // user &&
        //   fetchLatestTweets().then((data: any) => {
        //     setTimeline(data);
        //   });
      }, [user, singleTimeline]);

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
        };
    
        if (timeline.some((tweet) => tweet.sharedId)) {
          fetchRetweets();
        }
      }, [timeline]);

      return {
        timeline,
        retweets
      }
}