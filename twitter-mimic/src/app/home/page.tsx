import styles from "@/ui/styles/home.module.css";
import TweetClient from "@/ui/components/Tweet";

export const metadata = {
  title: "Home / Twitter Mimic",
  description: "Explora los tweets en Twitter Mimic.",
  icons: {
    icon: "/TwitterMimicLogo.png",
  },
}

export default function HomePage() {

  return (
    <section className={styles.section}>
        <TweetClient />
    </section>
  );
}
