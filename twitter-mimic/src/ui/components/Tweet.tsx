"use client";

import Image from "next/image";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { LikeModalState, Timeline } from "@/lib/definitions";
import TweetMenu from "./TweetMenu";
import useUser from "../../../hooks/useUser";
import UserListModal from "./UserListModal/UserListModal";
import useUserLike from "../../../hooks/useUserLike";
import TweetFooter from "./TweetFooter";
import useTimeline from "../../../hooks/useTimeline";
import RetweetIcon from "../icons/Retweet";
import RetweetContent from "./RetweetContent";
import { SyncLoader } from "react-spinners";
import { Tooltip } from "react-tooltip";

export default function TweetClient({
  singleTimeline,
}: {
  singleTimeline?: Timeline[];
}) {
  const user = useUser();
  const { timeline, retweets, loading } = useTimeline({ singleTimeline, user });

  const [isMenuOpen, setIsMenuOpen] = useState<string | undefined>(undefined);
  const [likeModalState, setLikeModalState] = useState<LikeModalState>({
    id: undefined,
    usersLiked: [],
  });

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-full">
          <SyncLoader color="#3498db" loading={loading} />
        </div>
      ) : (
        timeline.map((tweet) => {
          const retweet = retweets.find((rt) => rt.id === tweet.sharedId);

          return (
            <Tweet
              key={tweet.id}
              id={retweet ? retweet.id : tweet.id}
              img={retweet ? retweet.img : tweet.img}
              userId={retweet ? retweet.userId : tweet.userId}
              userName={tweet.userName}
              avatar={tweet.avatar}
              content={retweet ? retweet.content : tweet.content}
              likesCount={retweet ? retweet.likesCount : tweet.likesCount}
              sharedCount={retweet ? retweet.sharedCount : tweet.sharedCount}
              isLiked={
                !!user?.likedTweets?.includes(retweet ? retweet.id : tweet.id)
              }
              isShared={
                !!user?.sharedTweets?.includes(retweet ? retweet.id : tweet.id)
              }
              createdAt={tweet.createdAt}
              usersLiked={retweet ? retweet.usersLiked : tweet.usersLiked}
              usersComments={
                retweet ? retweet.usersComments : tweet.usersComments
              }
              sharedUserName={retweet ? retweet.userName : undefined}
              sharedAvatar={retweet ? retweet.avatar : undefined}
              sharedCreatedAt={retweet ? retweet.createdAt : undefined}
              isRetweet={!!retweet}
              likeModalState={likeModalState}
              setLikeModalState={setLikeModalState}
              isMenuOpen={isMenuOpen}
              setIsMenuOpen={setIsMenuOpen}
            />
          );
        })
      )}
    </>
  );
}

interface TweetProps extends Omit<Timeline, "sharedId"> {
  sharedUserName: string | undefined;
  sharedAvatar: string | undefined;
  sharedCreatedAt: number | undefined;
  isLiked: boolean;
  isShared: boolean;
  isRetweet?: boolean;
  isMenuOpen: string | undefined;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
  likeModalState: LikeModalState;
  setLikeModalState: React.Dispatch<React.SetStateAction<LikeModalState>>;
}

function Tweet({
  id,
  img,
  userId,
  userName,
  avatar,
  content,
  likesCount,
  sharedCount,
  isLiked,
  isShared,
  createdAt,
  isMenuOpen,
  setIsMenuOpen,
  usersLiked,
  usersComments,
  sharedUserName,
  sharedAvatar,
  sharedCreatedAt,
  isRetweet,
  likeModalState,
  setLikeModalState,
}: TweetProps) {
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
      <section className={styles.tweetContentInfo}>
        <figure className={styles.avatarDiv}>
          <Avatar src={avatar} alt={userName} />
        </figure>
        <section className={styles.tweetContent}>
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

          {!isRetweet && (
            <>
              <p className={styles.p}>{content}</p>
              {img && (
                <Image
                  priority
                  placeholder="blur"
                  blurDataURL={img}
                  className={styles.img}
                  width={300}
                  height={300}
                  src={img}
                  alt="Tweet Image"
                />
              )}
            </>
          )}

          {isRetweet && sharedUserName && sharedAvatar && sharedCreatedAt && (
            <>
              <p
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <RetweetIcon />
                <span>
                  ha compartido un tweet de <strong>{sharedUserName}</strong>
                </span>
              </p>

              <RetweetContent
                id={id}
                img={img}
                sharedAvatar={sharedAvatar}
                sharedUserName={sharedUserName}
                content={content}
                sharedCreatedAt={sharedCreatedAt}
              />
            </>
          )}
        </section>
      </section>
      <section className={styles.tweetFooter}>
        <TweetFooter
          handleUserLike={handleUserLike}
          likesCount={likesCount}
          commentsCount={usersComments?.length || 0}
          isLiked={isLiked}
          isShared={isShared}
          userId={userId}
          id={id}
          img={img}
          sharedCount={sharedCount}
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
      <Tooltip id={id} place="top-end" style={{ padding: "0.3rem" }} />
    </article>
  );
}
