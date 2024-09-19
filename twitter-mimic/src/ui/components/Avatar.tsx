import Image from "next/image";
import styles from "../styles/app.module.css";

export function Avatar({
  src,
  alt,
  text,
}: {
  src: string;
  alt: string;
  text?: string;
}) {
  return (
    <div className={styles.container}>
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        title={alt}
        className={styles.avatar}
      />
      {text && <strong>{text}</strong>}
    </div>
  );
}
