"use client";

import styles from "@/ui/styles/search.module.css";
import { useEffect, useState } from "react";
import { listenLatestTweets } from "../../../firebase/client";
import useUser from "../../../hooks/useUser";
import { Timeline } from "@/lib/definitions";
import { SyncLoader } from "react-spinners";
import TweetClient from "@/ui/components/Tweet";

import HomePage from "../home/page";
import SearchFilters from "@/ui/components/app/search/SearchFilters";

export default function SearchPage() {
  // Al principio aparecen todos los tweets
  // Opcion filtrado por tweets con mas likes, mis tweets o tweets de otros usuarios
  // Los filtros deben ser checkboxes y solo debe haber un estado que maneje los 3 filtros

  // Aparte agregar una barra de busqueda en donde tenga autocompletado con un modal doble que busque
  // usuarios y tweets

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
    <HomePage>
      <section className={styles.section}>
        <SearchFilters timeline={timeline} onFilterChange={setFilteredTweets} userId={user?.uid} />
        {timeline.length === 0 && (
          <div className="flex items-center justify-center h-full w-full">
            <SyncLoader color="#78b2f7" />
          </div>
        )}
        <TweetClient
          timeline={filteredTweets}
          likedTweets={user?.likedTweets || []}
        />
      </section>
    </HomePage>
  );
}
