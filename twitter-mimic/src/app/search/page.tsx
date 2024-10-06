"use client";

import styles from "@/ui/styles/search.module.css";
import { useState } from "react";
import useUser from "../../../hooks/useUser";
import TweetClient from "@/ui/components/Tweet";

import HomeLayout from "../home/layout";
import SearchFilters, {
  TWEET_FILTER,
} from "@/ui/components/app/search/SearchFilters";

export interface FilterState {
  filter?: string;
  filterUserId?: string;
}

export default function SearchPage() {
  const user = useUser();

  const [filterState, setFilterState] = useState<FilterState>({
    filter: TWEET_FILTER.TOP,
    filterUserId: undefined,
  });

  const handleFilterChange = (newFilter: string, newFilterUserId?: string) => {
    setFilterState({ filter: newFilter, filterUserId: newFilterUserId });
  };

  return (
    <HomeLayout>
      <SearchFilters
        userId={user?.uid}
        filterState={filterState}
        onFilterChange={handleFilterChange}
      />
      <section className={styles.section}>
        <TweetClient filterState={filterState} />
      </section>
    </HomeLayout>
  );
}
