import { MouseEventHandler, useCallback, useState } from "react";
import { toast } from "sonner";
import { fetchUsersById } from "../firebase/client";
import { LikeModalState } from "@/lib/definitions";

interface UseUserLikeProps {
  id: string;
  usersLiked: string[] | undefined;
  likeModalState: LikeModalState;
  setLikeModalState: React.Dispatch<React.SetStateAction<LikeModalState>>;
}

export default function useUserLike({
  id,
  usersLiked,
  likeModalState,
  setLikeModalState,
}: UseUserLikeProps) {
  const [loadingUsers, setLoadingUsers] = useState(false);

  const handleUserLike: MouseEventHandler<HTMLSpanElement> = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
  
    if (likeModalState.id === id) {
      setLikeModalState({ id: undefined, usersLiked: [] });
      return;
    }
  
    if (!usersLiked || usersLiked.length === 0) return;
    setLoadingUsers(true);
  
    try {
      const users = await fetchUsersById(usersLiked);
      setLikeModalState({ id, usersLiked: users });
    } catch (error) {
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoadingUsers(false);
    }
  }, [id, usersLiked, likeModalState, setLikeModalState]);

  return {
    loadingUsers,
    handleUserLike,
  };
}
