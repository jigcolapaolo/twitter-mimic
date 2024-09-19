"use client";

import { Button } from "@/ui/components/Button";
import styles from "@/ui/styles/composeTweet.module.css";
import useUser from "../../../../hooks/useUser";
import {
  ChangeEvent,
  DragEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import { addTweet, uploadImage } from "../../../../firebase/client";
import { useRouter } from "next/navigation";
import { getDownloadURL, UploadTask } from "firebase/storage";
import Image from "next/image";
import { Avatar } from "@/ui/components/Avatar";

const COMPOSE_STATES = {
  USER_NOT_KNOWN: 0,
  LOADING: 1,
  SUCCESS: 2,
  ERROR: -1,
};

const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
};

export default function ComposeTweet() {
  const { push } = useRouter();
  const [message, setMessage] = useState<string>();
  const [status, setStatus] = useState<number>(COMPOSE_STATES.USER_NOT_KNOWN);
  const [drag, setDrag] = useState<number>(DRAG_IMAGE_STATES.NONE);
  const [task, setTask] = useState<UploadTask | null>(null);
  const [imgURL, setImgURL] = useState<string | null>(null);

  const user = useUser();

  useEffect(() => {
    if (task) {
      const onProgress = () => {};
      const onError = () => {};
      const onComplete = () => {
        // Obtengo la url de la imagen cargada para mostrarla
        getDownloadURL(task.snapshot.ref).then((url) => {
          setImgURL(url);
        });
      };

      task.on("state_changed", onProgress, onError, onComplete);
    }
  }, [task]);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setMessage(value);
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

  const handleDragEnter: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };

  const handleDragLeave: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };

  const handleDrop: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    // console.log(e.dataTransfer.files[0])
    setDrag(DRAG_IMAGE_STATES.NONE);
    const file = e.dataTransfer.files[0];
    const task = uploadImage(file);
    setTask(task);
  };

  const isButtonDisabled =
    !message || message.length === 0 || status === COMPOSE_STATES.LOADING;

  return (
    <>
      <section className={styles.section}>
        <figure className={styles.avatarSection}>
          {user && (
            <Avatar src={user.avatar} alt={user.displayName} />
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
              className={`${styles.button} rounded-full`}
            >
              Tweet
            </Button>
          </div>
        </form>
      </section>
    </>
  );
}
