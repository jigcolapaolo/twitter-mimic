import Link from "next/link";
import styles from "../../ui/styles/timeline.module.css";
import { fetchUserData } from "@/lib/api";
import { Suspense } from "react";

export default async function Timeline() {


  return (
    <div className="flex flex-col gap-8 items-center m-8">
      <h1 className={styles.title}>
        This is the timeline of
        <Suspense fallback={<span>...</span>}>
          <UserName />
        </Suspense>
      </h1>
      <Link href="/" className={styles.link}>
        Go Home
      </Link>
    </div>
  );
}
async function UserName() {
  const result = await fetchUserData();
  return (
    <span className={styles.span}>{result.userName}</span>
  )
}
