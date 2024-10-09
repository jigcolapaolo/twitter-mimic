"use client";

import { Button } from "@/ui/components/Button";
import styles from "@/ui/styles/composeTweet.module.css";
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
import useTextChange, {
  MAX_CHARS,
  TEXT_STATES,
} from "../../../../hooks/useTextChange";
import ReturnButton from "@/ui/components/ReturnButton";
import { AvatarSkeleton } from "@/ui/components/skeletons/AvatarSkeleton";
import { CameraIcon } from "@/ui/icons/CameraIcon";

export default function ComposeTweet() {
  const { push } = useRouter();

  const { message, handleChange, isButtonDisabled, setStatus } =
    useTextChange();
  const user = useUser();
  const {
    drag,
    imgURLs,
    uploadProgress,
    setImgURLs,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    fileInputRef,
    handleFileChange,
    handleOpenFileDialog,
  } = useUploadImg();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(TEXT_STATES.LOADING);
    addTweet({
      avatar: user?.avatar,
      content: message,
      userId: user?.uid,
      userName: user?.displayName,
      img: imgURLs,
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
      <ReturnButton className={styles.svgButton}>
        <ArrowLeft width={35} height={35} className={styles.svg} />
      </ReturnButton>
      <section className={styles.section}>
        <figure className={styles.avatarSection}>
          {user && user.avatar ? (
            <Avatar src={user.avatar} alt={user.displayName} />
          ) : (
            <AvatarSkeleton />
          )}
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

          <div className={styles.div}>
            <button className={styles.svgButton} onClick={handleOpenFileDialog}>
              <CameraIcon className={styles.svg} />
            </button>
            <Button
              disabled={isButtonDisabled}
              className={`${styles.button} w-1/4 tracking-widest`}
            >
              Tweet
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </div>
          <ImgLoadingMsg drag={drag} uploadProgress={uploadProgress} />
          {imgURLs.length > 0 && (
            <div className={styles.imgContainer}>
              {imgURLs.map((url, index) => (
                <section key={index} className={styles.imgSection}>
                  <button
                    onClick={() =>
                      setImgURLs((prev) => prev.filter((_, i) => i !== index))
                    }
                    className={styles.imgButton}
                  >
                    X
                  </button>
                  <Image
                    src={url}
                    alt="Image to Upload"
                    width={100}
                    height={100}
                    className={styles.img}
                  />
                </section>
              ))}
            </div>
          )}
        </form>
      </section>
    </>
  );
}
