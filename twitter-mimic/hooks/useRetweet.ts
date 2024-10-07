import { MouseEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { retweet } from "../firebase/client";
import useUser from "./useUser";

interface UseRetweetProps {
  isShared: boolean;
  sharedCount: number;
  id: string;
  img: string;
}

export default function useRetweet({
  isShared,
  sharedCount,
  id,
  img,
}: UseRetweetProps) {
  const user = useUser();
  const [isSharedUi, setIsSharedUi] = useState<boolean>(isShared);
  const [sharedCountUi, setSharedCountUi] = useState<number>(sharedCount);

  useEffect(() => {
    if (user?.sharedTweets) {
      setIsSharedUi(user.sharedTweets.includes(id));
    }
  }, [user?.sharedTweets, id]);

  const handleRetweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      try {
        setSharedCountUi((prev: number) => (isSharedUi ? prev - 1 : prev + 1));
        setIsSharedUi((prev) => !prev);

        await retweet({
          avatar: user?.avatar,
          content: "",
          userId: user.uid,
          userName: user?.displayName,
          img,
          sharedId: id,
        });
      } catch (error) {
        toast.error("Error al retwittear");
        setSharedCountUi((prev) => (isSharedUi ? prev + 1 : prev - 1));
        setIsSharedUi((prev) => !prev);
      }
    }
  };

  return {
    handleRetweet,
    sharedCountUi,
    isSharedUi,
  };
}
