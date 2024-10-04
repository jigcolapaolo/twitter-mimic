import Link from "next/link";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Image from "next/image";
import useTimeAgo from "../../../hooks/useTimeAgo";

interface RetweetContentProps {
  id: string;
  img: string;
  sharedAvatar: string;
  sharedUserName: string;
  content: string;
  sharedCreatedAt: number;
}

export default function RetweetContent({
  id,
  img,
  sharedAvatar,
  sharedUserName,
  content,
  sharedCreatedAt,
}: RetweetContentProps) {
  const sharedTimeago = useTimeAgo(sharedCreatedAt);
  return (
    <section
      style={{
        border: "1px solid #bbbbbb",
        borderRadius: "8px",
        backgroundColor: "#f5f5f5",
        padding: "0.4rem",
        margin: "0.4rem 0",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" , gap: "0.5rem" }}>
        <header className={styles.retweetHeader}>
        <Avatar src={sharedAvatar} alt={sharedUserName} />
          <div>
            <strong>{sharedUserName}</strong>
            <span className="text-gray-400"> · </span>
            <Link href={`/status/${id}`} className={styles.link}>
              <time className="text-gray-400 text-sm font-light">
                {sharedTimeago}
              </time>
            </Link>
          </div>
        </header>
            <p className={styles.p}>{content}</p>
      </div>

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
    </section>
  );
}
