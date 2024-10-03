"use client";

import { Comment } from "@/lib/definitions";
import { MouseEventHandler, useEffect, useState } from "react";
import {
  addComment,
  fetchLatestTweetComments,
} from "../../../../firebase/client";
import { SyncLoader } from "react-spinners";
import { Button } from "../Button";
import styles from "./comments.module.css";
import useTextChange, {
  MAX_CHARS,
  TEXT_STATES,
} from "../../../../hooks/useTextChange";
import useUser from "../../../../hooks/useUser";
import { toast } from "sonner";
import { Avatar } from "../Avatar";
import useTimeAgo from "../../../../hooks/useTimeAgo";
import CharacterLimit from "../composeTweet/CharacterLimit/CharacterLimit";

export default function Comments({ tweetId }: { tweetId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const { message, isButtonDisabled, setMessage, setStatus, handleChange } =
    useTextChange();
  const user = useUser();

  useEffect(() => {
    if (!tweetId) return;
    setLoading(true);

    fetchLatestTweetComments(tweetId).then((comments) => {
      setComments(comments);
      setLoading(false);
    });
  }, [tweetId]);

  const handleAddComment: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    if (!message || message.length === 0 || !user) return;

    setStatus(TEXT_STATES.LOADING);
    addComment({
      tweetId,
      userId: user.uid,
      userName: user.displayName,
      content: message,
      avatar: user.avatar,
    })
      .then(() => {
        fetchLatestTweetComments(tweetId).then((updatedComments) => {
          setComments(updatedComments);
        });
        setMessage("");
        setStatus(TEXT_STATES.NONE);
      })
      .catch(() => {
        toast.error("Error al agregar el comentario");
        setStatus(TEXT_STATES.NONE);
      });
  };

  return (
    <section className={styles.commentsContainer}>
      {comments.length >= 0 && !loading && (
        <div className={styles.addCommentDiv}>
          <textarea
            value={message}
            onChange={handleChange}
            placeholder="Escribe un comentario"
          />
          <CharacterLimit message={message} MAX_CHARS={MAX_CHARS} />

          <Button onClick={handleAddComment} disabled={isButtonDisabled}>
            Comentar
          </Button>
        </div>
      )}
      {loading ? (
        <SyncLoader size={5} color="#78b2f7" />
      ) : comments.length === 0 ? (
        <p className={styles.noComments}>No hay comentarios</p>
      ) : (
        comments.map((comment) => (
          <article className={styles.comment} key={comment.id}>
            <div className={styles.commentAvatar}>
              <Avatar alt={comment.userName} src={comment.avatar} />
            </div>
            <div className={styles.commentInfo}>
              <div>
                <strong>{comment.userName}</strong>
                <span className="text-gray-400"> · </span>
                <TimeAgo createdAt={comment.createdAt} />
              </div>
              <p className={`text-gray-500 ${styles.commentText}`}>{comment.content}</p>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

function TimeAgo({ createdAt }: { createdAt: number }) {
  const timeago = useTimeAgo(createdAt);

  return <time className="text-gray-400 text-sm font-light">{timeago}</time>;
}