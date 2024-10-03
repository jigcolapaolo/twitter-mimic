import { useEffect, useState } from "react";
import { addComment, fetchLatestTweetComments } from "../firebase/client";
import { Comment, User } from "@/lib/definitions";

export default function useComment({ tweetId }: { tweetId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!tweetId) return;
    setLoading(true);

    fetchLatestTweetComments(tweetId).then((comments) => {
      setComments(comments);
      setLoading(false);
    });
  }, [tweetId]);

  const addNewComment = async ({
    message,
    user,
  }: {
    message: string;
    user: User;
  }) => {
    if (!tweetId) return;

    try {
      await addComment({
        tweetId,
        userId: user.uid,
        userName: user.displayName,
        content: message,
        avatar: user.avatar,
      });

      const updatedComments = await fetchLatestTweetComments(tweetId);
      setComments(updatedComments);
    } catch (error) {
    }
  };

  return {
    comments,
    addNewComment,
    loading,
  };
}
