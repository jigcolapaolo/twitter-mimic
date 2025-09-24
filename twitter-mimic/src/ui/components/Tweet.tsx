"use client";

import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import { MouseEventHandler, useCallback, useState } from "react";
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
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { FilterState } from "@/app/search/page";
import TweetImages from "./TweetImages/TweetImages";

export interface IsRetweetModified {
  id: string | undefined;
  isRetweeted: boolean;
  sharedCount: number;
}

export default function TweetClient({
  singleTimeline,
  filterState,
}: {
  singleTimeline?: Timeline[];
  filterState?: FilterState;

}) {
  const user = useUser();
  const { timeline, retweets, loading, isFetchingMore, handleLoadMore } = useTimeline({ singleTimeline, user, filterState });
  const { sectionRef } = useInfiniteScroll({ handleLoadMore })

  const [isMenuOpen, setIsMenuOpen] = useState<string | undefined>(undefined);
  const [likeModalState, setLikeModalState] = useState<LikeModalState>({
    id: undefined,
    usersLiked: [],
  });
  const [isRetweetModified, setIsRetweetModified] = useState<IsRetweetModified>({
    id: undefined,
    isRetweeted: false,
    sharedCount: 0,
  });

  const handleRetweetModified = useCallback((id: string | undefined, isRetweeted: boolean, sharedCount: number) => {
    setIsRetweetModified({ id, isRetweeted, sharedCount });
  }, [setIsRetweetModified]);

  return (
    <section ref={sectionRef} style={{ overflowY: "auto", width: "100%", height: "100%" }} data-testid="tweet-client">
      {loading && !timeline.length ? (
        <div className="flex justify-center items-center h-full absolute top-0 left-0 right-0 bottom-0">

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
              isRetweetModified={isRetweetModified}
              handleRetweetModified={handleRetweetModified}

            />
          );
        })
      )}
      {isFetchingMore && (
        <div className="flex h-1/6 justify-center items-center"><SyncLoader color="#3498db" /></div>
      )}

    </section>
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
  isRetweetModified: IsRetweetModified;
  handleRetweetModified: (id: string | undefined, isRetweeted: boolean, sharedCount: number) => void;
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
  isRetweetModified,
  handleRetweetModified,
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
    <article key={id} className={styles.article} onClick={handleArticleClick} aria-label="Tweet">
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
            {(user && user.uid === userId && !isRetweet) && (
              <TweetMenu
                id={id}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
            )}
          </header>

          {!isRetweet && (
            <>
              <p aria-label="Tweet Content" className={styles.p}>{content}</p>
              {img && (
                <TweetImages img={img} />
              )}
            </>
          )}

          {(isRetweet && sharedUserName && sharedAvatar && sharedCreatedAt) && (
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
          isRetweetModified={isRetweetModified}
          handleRetweetModified={handleRetweetModified}
        />
        {(likeModalState.id === id || loadingUsers) && (
          <UserListModal
            users={likeModalState.usersLiked}
            handleUserSelect={() => {}}
            className={styles.likeModalDiv}
            loadingUsers={loadingUsers}
          />
        )}
      </section>
      <Tooltip id={id} place="top-end" style={{ padding: "0.3rem" }} />
    </article>
  );
}
