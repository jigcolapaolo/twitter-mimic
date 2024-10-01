import { LikeModalState, SharedTweet } from "@/lib/definitions";
import styles from "@/ui/styles/home.module.css";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import Link from "next/link";
import RetweetIcon from "../icons/Retweet";
import UserListModal from "./UserListModal/UserListModal";
import useUserLike from "../../../hooks/useUserLike";
import TweetFooter from "./TweetFooter";
import RetweetContent from "./RetweetContent";

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
        </header>
        <p style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RetweetIcon />
          ha compartido un tweet de <strong>{sharedUserName}</strong>
        </p>

        <RetweetContent
          id={id}
          img={img}
          sharedAvatar={sharedAvatar}
          sharedUserName={sharedUserName}
          content={content}
          sharedTimeago={sharedTimeago}
        />

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
