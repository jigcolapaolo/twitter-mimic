"use client";

import { FormEvent, useEffect, useState } from "react";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/navigation";
import { Timeline } from "@/lib/definitions";
import { Button } from "@/ui/components/Button";
import ImgLoadingMsg from "@/ui/components/composeTweet/ImgLoadingMsg/ImgLoadingMsg";
import Image from "next/image";
import CharacterLimit from "@/ui/components/composeTweet/CharacterLimit/CharacterLimit";
import composeStyles from "@/ui/styles/composeTweet.module.css";
import ArrowLeft from "@/ui/icons/ArrowLeft";
import styles from "@/ui/styles/composeTweet.module.css";
import { Avatar } from "@/ui/components/Avatar";
import useUploadImg, {
  DRAG_IMAGE_STATES,
} from "../../../../../hooks/useUploadImg";
import { toast } from "sonner";
import ReturnButton from "@/ui/components/ReturnButton";
import useTextChange, {
  MAX_CHARS,
  TEXT_STATES,
} from "../../../../../hooks/useTextChange";
import { AvatarSkeleton } from "@/ui/components/skeletons/AvatarSkeleton";
import { CameraIcon } from "@/ui/icons/CameraIcon";

export default function EditTweetPage({ params }: { params: { Id: string } }) {
  const { Id } = params;
  const user = useUser();
  const { push } = useRouter();
  const [tweet, setTweet] = useState<Timeline | null>(null);
  const { message, setMessage, setStatus, isButtonDisabled, handleChange } =
    useTextChange();

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

  useEffect(() => {
    fetch(`/api/tweets/${Id}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el tweet");
        setStatus(TEXT_STATES.LOADING);
        return res.json();
      })
      .then((data: Timeline) => {
        setTweet(data);
        setMessage(data.content);
        setImgURLs(data.img);
        setStatus(TEXT_STATES.SUCCESS);
      })
      .catch((err) => {
        console.error(err);
        push("/home");
      });
  }, [Id, push, setImgURLs, setMessage, setStatus]);

  useEffect(() => {
    if (tweet && user && user?.uid !== tweet?.userId) push("/home");
  }, [user, push, tweet]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(TEXT_STATES.LOADING);

    fetch(`/api/tweets/put/${Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        img: imgURLs,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar el tweet");
        return res.json();
      })
      .then((nextResponse) => {
        toast.success(nextResponse.message);
        setStatus(TEXT_STATES.SUCCESS);
        push("/home");
      })
      .catch(() => {
        toast.error("Error al editar el tweet");
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
            placeholder={
              TEXT_STATES.LOADING ? "Cargando..." : "¿Que estas pensando?"
            }
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
              Guardar
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
