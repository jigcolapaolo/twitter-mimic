"use client";

import styles from "@/ui/styles/home.module.css";
import { useState, useEffect } from "react";
import { Timeline } from "@/lib/definitions"
import Tweet from "@/ui/components/Tweet";
import Link from "next/link";
import useUser from "../../../hooks/useUser";
import CreateIcon from "@/ui/icons/Create";
import HomeIcon from "@/ui/icons/Home";
import SearchIcon from "@/ui/icons/SearchIcon";
import { SyncLoader } from "react-spinners";
import { listenLatestTweets } from "../../../firebase/client";

export default function HomePage() {
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const user = useUser();

  // Si el user esta logueado, hace el fetch (Se puede usar el Token tambien)

  // useEffect(() => {
  //   fetch("http://localhost:3000/api/statuses/home_timeline")
  //   .then(res => res.json())
  //   .then(setTimeline)
  // }, [user])

  useEffect(() => {
    if (!user) return;

    const unsubscribe: any = listenLatestTweets((newTweets: any) => {
      // console.log(newTweets);
      setTimeline(newTweets);
    })

    return () => unsubscribe()
    
    // user &&
    //   fetchLatestTweets().then((data: any) => {
    //     setTimeline(data);
    //   });
  }, [user]);

  return (
    <>
      <header className={styles.header}>
        <Link href={"/"}>
          <p>Inicio</p>
        </Link>
      </header>

      <section className={styles.section}>
        {timeline.length === 0 && (
          <div className="flex items-center justify-center h-full w-full">
            <SyncLoader color="#78b2f7" />
          </div>
        )}
        {timeline.map((tweet) => {
          return (
            <Tweet
              key={tweet.id}
              id={tweet.id}
              img={tweet.img}
              userId={tweet.userId}
              userName={tweet.userName}
              avatar={tweet.avatar}
              content={tweet.content}
              likesCount={tweet.likesCount}
              sharedCount={tweet.sharedCount}
              createdAt={tweet.createdAt}
            />
          );
        })}
      </section>
      <nav className={styles.nav}>
        <Link href="/home">
          <HomeIcon width={32} height={32} stroke="#09f" />
        </Link>
        <Link href="/search">
          <SearchIcon width={32} height={32} stroke="#09f" />
        </Link>
        <Link href="/compose/tweet">
          <CreateIcon width={32} height={32} stroke="#09f" />
        </Link>
      </nav>
    </>
  );
}
