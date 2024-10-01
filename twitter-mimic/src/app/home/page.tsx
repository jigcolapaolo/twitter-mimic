"use client";

import styles from "@/ui/styles/home.module.css";
import { useState, useEffect } from "react";
import { Timeline } from "@/lib/definitions";
import TweetClient from "@/ui/components/Tweet";
import Link from "next/link";
import useUser from "../../../hooks/useUser";
import { SyncLoader } from "react-spinners";
import { listenLatestTweets } from "../../../firebase/client";
import SignOutIcon from "@/ui/icons/SignOutIcon";
import SignoutModal from "@/ui/components/SignoutModal/SignoutModal";
import FooterNav from "@/ui/components/FooterNav/FooterNav";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function HomePage({ children }: { children: React.ReactNode }) {
  const [timeline, setTimeline] = useState<Timeline[]>([]);
  const user = useUser();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
    });

    return () => unsubscribe();

    // user &&
    //   fetchLatestTweets().then((data: any) => {
    //     setTimeline(data);
    //   });
  }, [user]);

  return (
    <>
      <header className={styles.header}>
        <Link href={"/home"}>
          <Image
            src="/TwitterMimicLogo.png"
            alt="Twitter Mimic Logo"
            width={40}
            height={40}
            className={styles.imageHover}
          />
        </Link>
        <SignOutIcon
          onClick={() => setIsModalOpen(!isModalOpen)}
          width={32}
          height={32}
          stroke="#0099ff"
          fill="white"
        />
      </header>
      {children}
      {pathname === "/home" && (
        <section className={styles.section}>
          {timeline.length === 0 && (
            <div className="flex items-center justify-center h-full w-full">
              <SyncLoader color="#78b2f7" />
            </div>
          )}
          <TweetClient timeline={timeline} />
        </section>
      )}

      <FooterNav />
      <SignoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
