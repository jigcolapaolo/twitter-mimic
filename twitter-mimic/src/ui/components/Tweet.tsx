"use client";

import Image from "next/image";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import { MouseEventHandler, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LikeModalState, SharedTweet, Timeline } from "@/lib/definitions";
import TweetMenu from "./TweetMenu";
import useUser from "../../../hooks/useUser";
import { fetchTweetById } from "../../../firebase/client";
import UserListModal from "./UserListModal/UserListModal";
import Retweet from "./Retweet";
import useUserLike from "../../../hooks/useUserLike";
import TweetFooter from "./TweetFooter";

export default function TweetClient({ timeline }: { timeline: Timeline[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState<string | undefined>(undefined);
  const [likeModalState, setLikeModalState] = useState<LikeModalState>({
    id: undefined,
    usersLiked: [],
  });
  const [retweets, setRetweets] = useState<SharedTweet[]>([]);
  const user = useUser();

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

  return (
    <>
      {timeline.map((tweet) => {
        if (tweet.sharedId) {
          const retweet = retweets.find((rt) => rt.id === tweet.sharedId);

          if (retweet) {
            return (
              <Retweet
                key={tweet.id}
                id={retweet.id}
                img={retweet.img}
                userId={retweet.userId}
                userName={tweet.userName}
                sharedUserName={retweet.userName}
                avatar={tweet.avatar}
                sharedAvatar={retweet.avatar}
                content={retweet.content}
                likesCount={retweet.likesCount}
                sharedCount={retweet.sharedCount}
                createdAt={tweet.createdAt}
                sharedCreatedAt={retweet.createdAt}
                isLiked={user?.likedTweets?.includes(retweet.id) || false}
                isShared={user?.sharedTweets?.includes(retweet.id) || false}
                usersLiked={retweet.usersLiked}
                likeModalState={likeModalState}
                setLikeModalState={setLikeModalState}
              />
            );
          }
        } else {
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
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
              isLiked={user?.likedTweets?.includes(tweet.id) || false}
              isShared={user?.sharedTweets?.includes(tweet.id) || false}
              usersLiked={tweet.usersLiked}
              likeModalState={likeModalState}
              setLikeModalState={setLikeModalState}
              sharedId={undefined}
            />
          );
        }
      })}
    </>
  );
}

function Tweet({
  avatar,
  userName,
  content,
  id,
  img,
  userId,
  createdAt,
  likesCount,
  sharedCount,
  isMenuOpen,
  setIsMenuOpen,
  isLiked,
  isShared,
  usersLiked,
  likeModalState,
  setLikeModalState,
}: Timeline & {
  isMenuOpen: string | undefined;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLiked: boolean;
  isShared: boolean;
  likeModalState: LikeModalState;
  setLikeModalState: React.Dispatch<React.SetStateAction<LikeModalState>>;
}) {
  const timeago = useTimeAgo(createdAt);
  const router = useRouter();
  const user = useUser();
  const { loadingUsers, handleUserLike } = useUserLike({
    id,
    usersLiked,
    likeModalState,
    setLikeModalState,
  });

  const handleArticleClick: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    router.push(`/status/${id}`);
  };

  return (
    <article key={id} className={styles.article} onClick={handleArticleClick}>
      <div className={styles.avatarDiv}>
        <Avatar src={avatar} alt={userName} />
      </div>
      <section>
        <header className={styles.tweetHeader}>
          <div>
            <strong>{userName}</strong>
            <span className="text-gray-400"> · </span>
            <Link href={`/status/${id}`} className={styles.link}>
              <time className="text-gray-400 text-sm font-light">
                {timeago}
              </time>
            </Link>
          </div>
          {user && user.uid === userId && (
            <TweetMenu
              id={id}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          )}
        </header>
        <p className={styles.p}>{content}</p>
        {img && (
          <Image
            className={styles.img}
            width={300}
            height={300}
            src={img}
            alt="Tweet Image"
          />
        )}
        <TweetFooter
          handleUserLike={handleUserLike}
          isLiked={isLiked}
          likesCount={likesCount}
          userId={userId}
          id={id}
          img={img}
          sharedCount={sharedCount}
          isShared={isShared}
        />
        {(likeModalState.id === id || loadingUsers) && (
          <UserListModal
            users={likeModalState.usersLiked}
            handleUserSelect={() => {}}
            className={`${styles.likeModalDiv}`}
            loadingUsers={loadingUsers}
          />
        )}
      </section>
    </article>
  );
}
