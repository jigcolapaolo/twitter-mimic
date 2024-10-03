import Image from "next/image";
import styles from "../styles/app.module.css";

export function Avatar({
  src,
  alt,
  text,
  width = 100,
  height = 100,
}: {
  src: string;
  alt: string;
  text?: string;
  width?: number;
  height?: number;
}) {
  return (
    <div className={styles.container}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        title={alt}
        className={styles.avatar}
      />
      {text && <strong>{text}</strong>}
    </div>
  );
}
