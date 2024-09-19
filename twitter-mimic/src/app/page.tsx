"use client";

import { useEffect } from "react";
import Image from "next/image";

import styles from "../ui/styles/app.module.css";

import TwitterMimicLogo from "../../public/TwitterMimicLogo.png";
import { Button } from "@/ui/components/Button";
import GitHub from "@/ui/icons/GitHub";
import { loginWithGitHub } from "../../firebase/client";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
import useUser, { USER_STATES } from "../../hooks/useUser";

export default function Home() {
  const user = useUser();
  const { push } = useRouter();

  useEffect(() => {
    user && push("/home");
  }, [user, push]);

  const handleClick = () => {
    loginWithGitHub().catch((error) => {
      console.log(error);
    });
  };

  return (
    <>
      <section className={styles.section}>
        <Image
          src={TwitterMimicLogo}
          alt="Twitter Mimic Logo"
          width={150}
          height={150}
        />
        <h1 className={`${styles.h1} truncate antialiase`}>Twitter Mimic</h1>
        <h2 className={styles.h2}>
          Talk about development with developers 👨‍💻👩‍💻
        </h2>
        <div className={styles.div}>
          {user === USER_STATES.NOT_KNOWN && <SyncLoader color="#78b2f7" />}
          {user === USER_STATES.NOT_LOGGED && (
            <Button onClick={handleClick} className={styles.button}>
              <GitHub width={25} height={25} fill="white" />
              Login with GitHub
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
