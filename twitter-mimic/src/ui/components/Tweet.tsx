"use client";

import Image from "next/image";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import { MouseEventHandler, useState } from "react";
import { useRouter } from "next/navigation";
import { Timeline, User } from "@/lib/definitions";
import { LikeIcon, LikeIconFilled } from "../icons/Like";
import RetweetIcon from "../icons/Retweet";
import ChainIcon from "../icons/LinkIcon";
import { toast } from "sonner";
import CommentIcon from "../icons/CommentIcon";
import TweetMenu from "./TweetMenu";
import useUser from "../../../hooks/useUser";
import useLikeTweet from "../../../hooks/useLikeTweet";
import { fetchUsersById } from "../../../firebase/client";
import UserListModal from "./UserListModal/UserListModal";

interface LikeModalState {
  id: string | undefined;
  usersLiked: User[];
}

export default function TweetClient({
  timeline,
  likedTweets,
}: {
  timeline: Timeline[];
  likedTweets: string[];
}) {
  const [isMenuOpen, setIsMenuOpen] = useState<string | undefined>(undefined);
  const [likeModalState, setLikeModalState] = useState<LikeModalState>({
    id: undefined,
    usersLiked: [],
  });

  return (
    <>
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
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            isLiked={likedTweets?.includes(tweet.id)}
            usersLiked={tweet.usersLiked}
            likeModalState={likeModalState}
            setLikeModalState={setLikeModalState}
          />
        );
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
  usersLiked,
  likeModalState,
  setLikeModalState,
}: Timeline & {
  isMenuOpen: string | undefined;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
  isLiked: boolean;
  likeModalState: LikeModalState;
  setLikeModalState: React.Dispatch<React.SetStateAction<LikeModalState>>;
}) {
  const timeago = useTimeAgo(createdAt);
  const router = useRouter();
  const user = useUser();
  const { isTweetLiked, likesCountState, handleLikeTweet } = useLikeTweet(
    isLiked,
    likesCount,
    id,
    user as User
  );
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleArticleClick: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    router.push(`/status/${id}`);
  };

  const handleCopyTweetLink: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/status/${id}`);
    const toastId = toast.info("Link copiado");
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 2000);
  };

  const handleUserLike: MouseEventHandler<HTMLSpanElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (likeModalState.id === id) {
      setLikeModalState({ id: undefined, usersLiked: [] });
      return;
    }

    if (!usersLiked || usersLiked.length === 0) return;
    setLoadingUsers(true);

    try {
      const users = await fetchUsersById(usersLiked);
      setLikeModalState({ id, usersLiked: users });
    } catch (error) {
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoadingUsers(false);
    }
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
        <footer className={styles.footer}>
          <button onClick={handleLikeTweet}>
            {isTweetLiked ? <LikeIconFilled /> : <LikeIcon />}
            <span onClick={handleUserLike}>{likesCountState}</span>
          </button>
          <button>
            <CommentIcon />
            <span>0</span>
          </button>
          <button>
            <RetweetIcon />
            <span>{sharedCount}</span>
          </button>
          <button onClick={handleCopyTweetLink}>
            <ChainIcon />
          </button>
        </footer>
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
