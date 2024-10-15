import { MouseEventHandler, useEffect, useState } from "react";
import { toast } from "sonner";
import { retweet } from "../firebase/client";
import useUser from "./useUser";
import { IsRetweetModified } from "@/ui/components/Tweet";

interface UseRetweetProps {
  isShared: boolean;
  sharedCount: number;
  id: string;
  img: string[];
  isRetweetModified: IsRetweetModified;
  handleRetweetModified: (id: string | undefined, isRetweeted: boolean, sharedCount: number) => void;
}

export default function useRetweet({
  isShared,
  sharedCount,
  id,
  img,
  isRetweetModified,
  handleRetweetModified,
}: UseRetweetProps) {
  const user = useUser();
  const [isSharedUi, setIsSharedUi] = useState<boolean>(isShared);
  const [sharedCountUi, setSharedCountUi] = useState<number>(sharedCount);

  useEffect(() => {
    setIsSharedUi(user?.sharedTweets?.includes(id) || false);
  }, [user?.sharedTweets, id]);

  useEffect(() => {
    if (isRetweetModified.id === id) {
      setIsSharedUi(isRetweetModified.isRetweeted);
      setSharedCountUi(isRetweetModified.sharedCount);
    }
  }, [isRetweetModified, id]);

  const handleRetweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (user) {
      try {

        const newIsSharedUi = !isSharedUi;
        const newSharedCount = newIsSharedUi ? sharedCount + 1 : sharedCount === 0 ? 0 : sharedCount - 1;
        handleRetweetModified(id, newIsSharedUi, newSharedCount);

        await retweet({
          avatar: user?.avatar,
          content: "",
          userId: user.uid,
          userName: user?.displayName,
          img: img || null, 
          sharedId: id,
        });


      } catch (error) {
        toast.error("Error al retwittear");
        setSharedCountUi((prev) => (isSharedUi ? prev + 1 : prev === 0 ? 0 : prev - 1));
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
