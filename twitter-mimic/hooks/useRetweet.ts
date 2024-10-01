import { User } from "@/lib/definitions";
import { MouseEventHandler, useState } from "react";
import { toast } from "sonner";
import { retweet } from "../firebase/client";

interface UseRetweetProps {
    user: User | null | undefined;
    sharedCount: number;
    id: string;
    img: string;
    isShared: boolean;
}

export default function useRetweet({ user, sharedCount, id, img, isShared }: UseRetweetProps) {
    const [sharedCountUi, setSharedCountUi] = useState(sharedCount);
    const [isSharedUi, setIsSharedUi] = useState(isShared);

    const handleRetweet: MouseEventHandler<HTMLButtonElement> = async (e) => {
      e.preventDefault();
      e.stopPropagation();
    
      if (user) {
        try {
          setSharedCountUi((prev: number) => (isShared ? prev - 1 : prev + 1));
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
          setSharedCountUi((prev) => (isShared ? prev + 1 : prev - 1));
          setIsSharedUi((prev) => !prev);
        }
      }
    };

    return {
      handleRetweet,
      sharedCountUi,
      isSharedUi,
    }
}