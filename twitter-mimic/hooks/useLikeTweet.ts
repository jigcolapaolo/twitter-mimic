import { User } from "@/lib/definitions";
import { MouseEventHandler, useEffect, useState } from "react";
import { likeTweet } from "../firebase/client";
import { toast } from "sonner";

export default function useLikeTweet(
  isLiked: boolean,
  likesCount: number,
  id: string,
  user: User | null | undefined
) {
  const [isTweetLiked, setIsTweetLiked] = useState<boolean>(isLiked);
  const [likesCountState, setLikesCountState] = useState<number>(likesCount);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    if (user?.likedTweets) {
      setIsTweetLiked(user.likedTweets.includes(id));
    }
  }, [user?.likedTweets, id]);
  

  const handleLikeTweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAnimating(true);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);

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
    isAnimating,
  };
}
