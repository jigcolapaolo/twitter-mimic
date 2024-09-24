import { User } from "@/lib/definitions";
import { MouseEventHandler, useState } from "react";
import { likeTweet } from "../firebase/client";
import { toast } from "sonner";

export default function useLikeTweet(
  isLiked: boolean,
  likesCount: number,
  id: string,
  user: User | null
) {
  const [isTweetLiked, setIsTweetLiked] = useState<boolean>(isLiked);
  const [likesCountState, setLikesCountState] = useState<number>(likesCount);

  const handleLikeTweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      const previousLikedState = isTweetLiked;
      const previousLikesCount = likesCountState;

      setIsTweetLiked((prev) => !prev);
      setLikesCountState((prev) => (isTweetLiked ? prev - 1 : prev + 1));

      try {
        await likeTweet({ tweetId: id, userId: user.uid });
      } catch (error) {
        setIsTweetLiked(previousLikedState);
        setLikesCountState(previousLikesCount);
        toast.error("Error al dar like, inténtalo de nuevo.");
      }
    }
  };

  return {
    isTweetLiked,
    likesCountState,
    handleLikeTweet,
  };
}
