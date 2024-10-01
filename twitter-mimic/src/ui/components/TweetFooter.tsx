import styles from "@/ui/styles/home.module.css";
import { LikeIcon, LikeIconFilled } from "../icons/Like";
import CommentIcon from "../icons/CommentIcon";
import useUser from "../../../hooks/useUser";
import RetweetIcon from "../icons/Retweet";
import ChainIcon from "../icons/LinkIcon";
import { MouseEventHandler } from "react";
import { toast } from "sonner";
import useRetweet from "../../../hooks/useRetweet";
import { User } from "@/lib/definitions";
import useLikeTweet from "../../../hooks/useLikeTweet";

interface TweetFooterProps {
  handleUserLike: MouseEventHandler;
  isLiked: boolean;
  likesCount: number;
  userId: string;
  id: string;
  img: string;
  isShared: boolean;
  sharedCount: number;
}

export default function TweetFooter({
  handleUserLike,
  isLiked,
  likesCount,
  userId,
  id,
  img,
  isShared,
  sharedCount,
}: TweetFooterProps) {
  const user = useUser();
  const { isTweetLiked, likesCountState, handleLikeTweet } = useLikeTweet(
    isLiked,
    likesCount,
    id,
    user as User
  );
  const { isSharedUi, handleRetweet, sharedCountUi } = useRetweet({
    user,
    sharedCount,
    id,
    img,
    isShared,
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

  return (
    <footer className={styles.footer}>
      <button onClick={handleLikeTweet}>
        {isTweetLiked ? <LikeIconFilled /> : <LikeIcon />}
        <span onClick={handleUserLike}>{likesCountState}</span>
      </button>
      <button>
        <CommentIcon />
        <span>0</span>
      </button>
      {user?.uid !== userId && (
        <button
          style={isSharedUi ? { backgroundColor: "#B0E0E6" } : {}}
          onClick={handleRetweet}
        >
          <RetweetIcon />
          <span>{sharedCountUi}</span>
        </button>
      )}
      <button onClick={handleCopyTweetLink}>
        <ChainIcon />
      </button>
    </footer>
  );
}
