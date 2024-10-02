"use client";

import styles from "@/ui/styles/search.module.css";
import { useEffect, useState } from "react";
import { listenLatestTweets } from "../../../firebase/client";
import useUser from "../../../hooks/useUser";
import { Timeline } from "@/lib/definitions";
import { SyncLoader } from "react-spinners";
import TweetClient from "@/ui/components/Tweet";

import HomeLayout from "../home/layout";
import SearchFilters from "@/ui/components/app/search/SearchFilters";

export default function SearchPage() {
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const [filteredTweets, setFilteredTweets] = useState<Timeline[]>(timeline);
  const user = useUser();

  useEffect(() => {
    if (!user) return;

    const unsubscribe: any = listenLatestTweets((newTweets: any) => {
      setTimeline(newTweets);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    setFilteredTweets(timeline);
  }, [timeline]);

  return (
    <HomeLayout>
      <section className={styles.section}>
        <SearchFilters
          timeline={timeline}
          onFilterChange={setFilteredTweets}
          userId={user?.uid}
        />
        {filteredTweets.length === 0 ? (
          <div className="flex items-center justify-center h-full w-full">
            <SyncLoader color="#78b2f7" />
          </div>
        ) : (
          <TweetClient timeline={filteredTweets} />
        )}
      </section>
    </HomeLayout>
  );
}
