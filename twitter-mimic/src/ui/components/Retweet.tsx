import { SharedTweet, User } from "@/lib/definitions";
import { LikeModalState } from "./Tweet";
import styles from "@/ui/styles/home.module.css";
import { fetchUsersById, retweet } from "../../../firebase/client";
import { toast } from "sonner";
import { MouseEventHandler, useState } from "react";
import useUser from "../../../hooks/useUser";
import { useRouter } from "next/navigation";
import useTimeAgo from "../../../hooks/useTimeAgo";
import useLikeTweet from "../../../hooks/useLikeTweet";
import { Avatar } from "./Avatar";
import Link from "next/link";
import Image from "next/image";
import { LikeIcon, LikeIconFilled } from "../icons/Like";
import CommentIcon from "../icons/CommentIcon";
import RetweetIcon from "../icons/Retweet";
import ChainIcon from "../icons/LinkIcon";
import UserListModal from "./UserListModal/UserListModal";

export default function Retweet({
  id,
  img,
  userId,
  userName,
  sharedUserName,
  avatar,
  sharedAvatar,
  content,
  likesCount,
  sharedCount,
  createdAt,
  sharedCreatedAt,
  isLiked,
  isShared,
  usersLiked,
  likeModalState,
  setLikeModalState,
}: SharedTweet & {
  isLiked: boolean;
  isShared: boolean;
  likeModalState: LikeModalState;
  setLikeModalState: React.Dispatch<React.SetStateAction<LikeModalState>>;
}) {
  const timeago = useTimeAgo(createdAt);
  const sharedTimeago = useTimeAgo(sharedCreatedAt);
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

  const [sharedCountUi, setSharedCountUi] = useState(sharedCount);

  const handleRetweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      await retweet({
        avatar: user?.avatar,
        content: "",
        userId: user.uid,
        userName: user?.displayName,
        img,
        sharedId: id,
      })
        .then(() => {
          setSharedCountUi((prev) => (isShared ? prev - 1 : prev + 1));
        })
        .catch(() => {
          toast.error("Error al retwittear");
          setSharedCountUi((prev) => (prev === 0 ? 0 : prev - 1));
        });
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
        </header>
        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RetweetIcon />
          ha compartido un tweet de <strong>{sharedUserName}</strong>
        </p>

        <article className={styles.article}>
          <section
            style={{
              border: "1px solid #bbbbbb",
              borderRadius: "8px",
              backgroundColor: "#f5f5f5",
              padding: "0.4rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Avatar src={sharedAvatar} alt={sharedUserName} />
              <header className={styles.tweetHeader}>
                <div>
                  <strong>{sharedUserName}</strong>
                  <span className="text-gray-400"> · </span>
                  <Link href={`/status/${id}`} className={styles.link}>
                    <time className="text-gray-400 text-sm font-light">
                      {sharedTimeago}
                    </time>
                  </Link>
                  <p className={styles.p}>{content}</p>
                </div>
              </header>
            </div>

            {img && (
              <Image
                className={styles.img}
                width={300}
                height={300}
                src={img}
                alt="Tweet Image"
              />
            )}
          </section>
        </article>

        <footer className={styles.footer}>
          <button onClick={handleLikeTweet}>
            {isTweetLiked ? <LikeIconFilled /> : <LikeIcon />}
            <span onClick={handleUserLike}>{likesCountState}</span>
          </button>
          <button>
            <CommentIcon />
            <span>0</span>
          </button>
          <button style={isShared ? { backgroundColor: "#B0E0E6" } : {}} onClick={handleRetweet}>
            <RetweetIcon />
            <span>{sharedCountUi}</span>
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
