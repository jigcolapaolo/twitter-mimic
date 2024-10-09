import styles from "@/ui/styles/home.module.css";
import { LikeIcon, LikeIconFilled } from "../icons/Like";
import CommentIcon from "../icons/CommentIcon";
import RetweetIcon from "../icons/Retweet";
import ChainIcon from "../icons/LinkIcon";
import { MouseEventHandler } from "react";
import { toast } from "sonner";
import useRetweet from "../../../hooks/useRetweet";
import { User } from "@/lib/definitions";
import useLikeTweet from "../../../hooks/useLikeTweet";
import { useRouter } from "next/navigation";
import useUser from "../../../hooks/useUser";
import { IsRetweetModified } from "./Tweet";

interface TweetFooterProps {
  handleUserLike: MouseEventHandler;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isShared: boolean;
  userId: string;
  id: string;
  img: string[];
  sharedCount: number;
  isRetweetModified: IsRetweetModified;
  handleRetweetModified: (id: string | undefined, isRetweeted: boolean, sharedCount: number) => void;
}

export default function TweetFooter({
  handleUserLike,
  likesCount,
  commentsCount,
  isLiked,
  isShared,
  userId,
  id,
  img,
  sharedCount,
  isRetweetModified,
  handleRetweetModified,
}: TweetFooterProps) {
  const router = useRouter();
  const user = useUser();
  const { isTweetLiked, likesCountState, handleLikeTweet, isAnimating } = useLikeTweet(
    isLiked,
    likesCount,
    id,
    user as User
  );
  const { isSharedUi, handleRetweet, sharedCountUi } = useRetweet({
    isShared,
    sharedCount,
    id,
    img,
    isRetweetModified,
    handleRetweetModified,
  });

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

  const handleCommentTweet: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/status/${id}`);
  };


  return (
    <footer className={styles.footer}>
      <button onClick={handleLikeTweet} className={`${styles.likeBtn} ${isAnimating ? styles.animate : ""}`}>
        {isTweetLiked ? <LikeIconFilled /> : <LikeIcon />}
        <span onClick={handleUserLike}>{likesCountState}</span>
      </button>
      <button onClick={handleCommentTweet}>
        <CommentIcon />
        <span>{commentsCount}</span>
      </button>
      {user && user?.uid !== userId ? (
        <button
          style={isSharedUi ? { backgroundColor: "#B0E0E6" } : {}}
          onClick={handleRetweet}
        >
          <RetweetIcon />
          <span>{sharedCountUi}</span>
        </button>
      ) : null}
      <button data-tooltip-id={id} data-tooltip-content="Copiar link" onClick={handleCopyTweetLink}>
        <ChainIcon />
      </button>
    </footer>
  );
}
