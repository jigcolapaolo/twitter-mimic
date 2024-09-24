"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import useUser from "../../../../../hooks/useUser";
import { useRouter } from "next/navigation";
import { Timeline } from "@/lib/definitions";
import { Button } from "@/ui/components/Button";
import ImgLoadingMsg from "@/ui/components/composeTweet/ImgLoadingMsg/ImgLoadingMsg";
import Image from "next/image";
import CharacterLimit from "@/ui/components/composeTweet/CharacterLimit/CharacterLimit";
import Link from "next/link";
import ArrowLeft from "@/ui/icons/ArrowLeft";
import styles from "@/ui/styles/composeTweet.module.css";
import { Avatar } from "@/ui/components/Avatar";
import useUploadImg, {
  DRAG_IMAGE_STATES,
} from "../../../../../hooks/useUploadImg";
import { toast } from "sonner";

const EDIT_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
};

const MAX_CHARS = 280;

export default function EditTweetPage({ params }: { params: { Id: string } }) {
  const { Id } = params;
  const user = useUser();
  const { push } = useRouter();
  const [tweet, setTweet] = useState<Timeline | null>(null);
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<number>(EDIT_STATES.USER_NOT_KNOWN);

  const {
    drag,
    imgURL,
    uploadProgress,
    setImgURL,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useUploadImg();

  useEffect(() => {
    fetch(`/api/tweets/${Id}`, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener el tweet");
        setStatus(EDIT_STATES.LOADING);
        return res.json();
      })
      .then((data: Timeline) => {
        setTweet(data);
        setMessage(data.content);
        setImgURL(data.img);
        setStatus(EDIT_STATES.SUCCESS);
      })
      .catch((err) => {
        console.error(err);
        push("/home");
      });
  }, [Id, push, setImgURL]);

  useEffect(() => {
    if (tweet && user && user?.uid !== tweet?.userId) push("/home");
  }, [user, push, tweet]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus(EDIT_STATES.LOADING);

    fetch(`/api/tweets/put/${Id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        img: imgURL,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al editar el tweet");
        return res.json();
      })
      .then((nextResponse) => {
        
        toast.success(nextResponse.message);
        setStatus(EDIT_STATES.SUCCESS);
        push("/home");
      })
      .catch(() => {
        toast.error("Error al editar el tweet");
        setStatus(EDIT_STATES.ERROR);
      });
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const { value } = e.target;

    if (value.length <= MAX_CHARS) setMessage(value);
  };

  useEffect(() => {
    console.log("imgURL:", imgURL);
    console.log("tweet?.img:", tweet?.img);
  }, [imgURL, tweet?.img]);
  

  const isButtonDisabled =
    !message ||
    message.length === 0 ||
    status === EDIT_STATES.LOADING ||
    (message === tweet?.content && imgURL === tweet?.img );

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
            placeholder={
              EDIT_STATES.LOADING ? "Cargando..." : "¿Que estas pensando?"
            }
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
              className={`${styles.button} w-2/5 tracking-widest`}
            >
              Modificar Tweet
            </Button>
          </div>
          <ImgLoadingMsg drag={drag} uploadProgress={uploadProgress} />
        </form>
      </section>
    </>
  );
}
