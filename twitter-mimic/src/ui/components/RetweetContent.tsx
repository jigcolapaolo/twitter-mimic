import Link from "next/link";
import { Avatar } from "./Avatar";
import styles from "@/ui/styles/home.module.css";
import Image from "next/image";

interface RetweetContentProps {
  id: string;
  img: string;
  sharedAvatar: string;
  sharedUserName: string;
  content: string;
  sharedTimeago: string;
}

export default function RetweetContent({
  id,
  img,
  sharedAvatar,
  sharedUserName,
  content,
  sharedTimeago,
}: RetweetContentProps) {
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
