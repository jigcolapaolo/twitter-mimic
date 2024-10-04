import { MouseEventHandler, useEffect } from "react";
import useTextChange, {
  MAX_CHARS,
  TEXT_STATES,
} from "../../../../hooks/useTextChange";
import { Button } from "../Button";
import CharacterLimit from "../composeTweet/CharacterLimit/CharacterLimit";
import styles from "./comments.module.css";
import { toast } from "sonner";

interface CommentEditProps {
  id: string;
  content: string;
  userId: string | undefined;
  editUserComment: ({
    commentId,
    userId,
    content,
  }: {
    commentId: string;
    userId: string;
    content: string;
  }) => Promise<void>;
  setIsEditOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function CommentEdit({
  id,
  content,
  userId,
  editUserComment,
  setIsEditOpen,
}: CommentEditProps) {
  const { message, status, isButtonDisabled, setMessage, setStatus, handleChange } =
    useTextChange();

    useEffect(() => {
      setMessage(content);
    },[content, setMessage]);

  const handleEditComment: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    if (!message || message.length === 0 || message === content || !userId) return;
    setStatus(TEXT_STATES.LOADING);

    try {
      await editUserComment({ commentId: id, userId, content: message });
      setIsEditOpen(undefined);
    } catch (error) {
      toast.error("Error al editar el comentario");
    } finally {
      setStatus(TEXT_STATES.NONE);
    }
  };

  return (
    <div className={styles.addCommentDiv}>
      <textarea
        value={message}
        onChange={handleChange}
        placeholder="Escribe un comentario"
      />
      <CharacterLimit message={message} MAX_CHARS={MAX_CHARS} />

      <Button onClick={handleEditComment} disabled={isButtonDisabled}>
        {status === TEXT_STATES.LOADING ? "Guardando..." : "Guardar"}
      </Button>
    </div>
  );
}
