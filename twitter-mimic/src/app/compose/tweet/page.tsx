"use client";

import { Button } from "@/ui/components/Button";
import styles from "@/ui/styles/composeTweet.module.css";
import useUser from "../../../../hooks/useUser";
import { ChangeEvent, FormEvent, useState } from "react";
import { addTweet } from "../../../../firebase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@/ui/components/Avatar";
import ArrowLeft from "@/ui/icons/ArrowLeft";
import Link from "next/link";
import useUploadImg, {
  DRAG_IMAGE_STATES,
} from "../../../../hooks/useUploadImg";
import ImgLoadingMsg from "@/ui/components/composeTweet/ImgLoadingMsg/ImgLoadingMsg";

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
};

const MAX_CHARS = 280;

export default function ComposeTweet() {
  const { push } = useRouter();
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<number>(COMPOSE_STATES.USER_NOT_KNOWN);

  const user = useUser();
  const {
    drag,
    imgURL,
    uploadProgress,
    setImgURL,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useUploadImg();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;

    if (value.length <= MAX_CHARS) setMessage(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(COMPOSE_STATES.LOADING);
    addTweet({
      avatar: user?.avatar,
      content: message,
      userId: user?.uid,
      userName: user?.displayName,
      img: imgURL,
    })
      .then(() => {
        push("/home");
      })
      .catch(() => {
        setStatus(COMPOSE_STATES.ERROR);
      });
  };

  const isButtonDisabled =
    !message || message.length === 0 || status === COMPOSE_STATES.LOADING;

  return (
    <>
      <Link href={"/home"} className={styles.svgButton}>
        <ArrowLeft width={35} height={35} className={styles.svg} />
      </Link>
      <section className={styles.section}>
        <figure className={styles.avatarSection}>
          {user && <Avatar src={user.avatar} alt={user.displayName} />}
        </figure>
        <form className={styles.form} onSubmit={handleSubmit}>
          <textarea
            className={styles.textarea}
            style={{
              border:
                drag === DRAG_IMAGE_STATES.DRAG_OVER
                  ? "3px dashed #09f"
                  : "3px solid transparent",
            }}
            placeholder="¿Qué esta pasando?"
            onChange={handleChange}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            value={message}
          ></textarea>

          <div className="text-gray-400 flex flex-col gap-1">
            <span>
              {message ? message.length : 0}/{MAX_CHARS}
            </span>
            <span
              style={{ fontFamily: "system-ui" }}
              className={
                message && message.length >= MAX_CHARS
                  ? "text-red-500"
                  : message && message.length >= MAX_CHARS - 30
                  ? "text-orange-400"
                  : "opacity-0"
              }
            >
              {message && message.length >= MAX_CHARS
                ? "Ha alcanzado el límite de caracteres."
                : message && message.length >= MAX_CHARS - 30
                ? "Cerca del límite de caracteres."
                : "Placeholder"}
            </span>
          </div>

          {imgURL && (
            <section className={styles.imgSection}>
              <button
                onClick={() => setImgURL(null)}
                className={styles.imgButton}
              >
                X
              </button>
              <Image
                src={imgURL}
                alt="Image to Upload"
                width={100}
                height={100}
                className={styles.img}
              />
            </section>
          )}
          <div className={styles.div}>
            <Button
              disabled={isButtonDisabled}
              className={`${styles.button} w-1/4 tracking-widest`}
            >
              Tweet
            </Button>
          </div>
          <ImgLoadingMsg drag={drag} uploadProgress={uploadProgress} />
        </form>
      </section>
    </>
  );
}
