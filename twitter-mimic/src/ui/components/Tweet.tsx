"use client";

import Image from "next/image";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import { MouseEventHandler } from "react";
import { useRouter } from "next/navigation";
import { Timeline } from "@/lib/definitions";
import { LikeIcon } from "../icons/Like";
import RetweetIcon from "../icons/Retweet";
import ChainIcon from "../icons/LinkIcon";

export default function Tweet({
  avatar,
  userName,
  content,
  id,
  img,
  // userId,
  createdAt,
  likesCount,
  sharedCount,
}: Timeline) {
  const timeago = useTimeAgo(createdAt);
  const router = useRouter();

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
        <header>
          <strong>{userName}</strong>
          <span className="text-gray-400"> · </span>
          <Link href={`/status/${id}`} className={styles.link}>
            <time className="text-gray-400 text-sm font-light">{timeago}</time>
          </Link>
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
          <button>
            <LikeIcon />
            <span>{likesCount}</span>
          </button>
          <button>
            <RetweetIcon />
            <span>{sharedCount}</span>
          </button>
          <button>
            <ChainIcon />
          </button>
        </footer>
      </section>
    </article>
  );
}
