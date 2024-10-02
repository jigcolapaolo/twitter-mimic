"use client";

import styles from "@/ui/styles/search.module.css";
import { useState } from "react";
import useUser from "../../../hooks/useUser";
import { Timeline } from "@/lib/definitions";
import { SyncLoader } from "react-spinners";
import TweetClient from "@/ui/components/Tweet";

import HomeLayout from "../home/layout";
import SearchFilters from "@/ui/components/app/search/SearchFilters";
import useTimeline from "../../../hooks/useTimeline";

export default function SearchPage() {
  const user = useUser();
  const { timeline, loading } = useTimeline({ user })
  const [filteredTweets, setFilteredTweets] = useState<Timeline[]>(timeline);

  return (
    <HomeLayout>
      <section className={styles.section}>
        <SearchFilters
          timeline={timeline}
          onFilterChange={setFilteredTweets}
          userId={user?.uid}
        />
        {loading ? (
          <div className="flex items-center justify-center h-full w-full">
            <SyncLoader color="#78b2f7" />
          </div>
        ) : (
          <TweetClient singleTimeline={filteredTweets} />
        )}
      </section>
    </HomeLayout>
  );
}
