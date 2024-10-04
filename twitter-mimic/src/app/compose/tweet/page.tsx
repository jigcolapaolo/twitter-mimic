"use client";

import { Button } from "@/ui/components/Button";
import styles from "@/ui/styles/composeTweet.module.css";
import composeStyles from "@/ui/styles/composeTweet.module.css";
import useUser from "../../../../hooks/useUser";
import { FormEvent } from "react";
import { addTweet } from "../../../../firebase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Avatar } from "@/ui/components/Avatar";
import ArrowLeft from "@/ui/icons/ArrowLeft";
import useUploadImg, {
  DRAG_IMAGE_STATES,
} from "../../../../hooks/useUploadImg";
import ImgLoadingMsg from "@/ui/components/composeTweet/ImgLoadingMsg/ImgLoadingMsg";
import CharacterLimit from "@/ui/components/composeTweet/CharacterLimit/CharacterLimit";
import useTextChange, { MAX_CHARS, TEXT_STATES } from "../../../../hooks/useTextChange";
import ReturnButton from "@/ui/components/ReturnButton";



export default function ComposeTweet() {
  const { push } = useRouter();

  const { message, handleChange, isButtonDisabled, setStatus } = useTextChange();
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


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(TEXT_STATES.LOADING);
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
        setStatus(TEXT_STATES.ERROR);
      });
  };


  return (
    <>
      <ReturnButton className={composeStyles.svgButton}>
        <ArrowLeft width={35} height={35} className={composeStyles.svg} />
      </ReturnButton>
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

          <CharacterLimit message={message} MAX_CHARS={MAX_CHARS} />

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
