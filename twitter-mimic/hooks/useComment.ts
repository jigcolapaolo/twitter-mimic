import { useEffect, useState } from "react";
import {
  addComment,
  deleteComment,
  editComment,
  fetchLatestTweetComments,
} from "../firebase/client";
import { Comment, User } from "@/lib/definitions";

export default function useComment({
  tweetId,
}: {
  tweetId: string | undefined;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {}
  };

  const deleteUserComment = async ({
    commentId,
    userId,
  }: {
    commentId: string;
    userId: string;
  }) => {
    if (!tweetId) return;

    try {
      await deleteComment({ tweetId, commentId, userId });

      const updatedComments = await fetchLatestTweetComments(tweetId);
      setComments(updatedComments);
    } catch (error) {}
  };

  const editUserComment = async ({
    commentId,
    userId,
    content,
  }: {
    commentId: string;
    userId: string;
    content: string;
  }) => {
    if (!tweetId) return;

    try {
      await editComment({ commentId, userId, content });

      const updatedComments = await fetchLatestTweetComments(tweetId);
      setComments(updatedComments);
    } catch (error) {
      
    }
  };

  return {
    comments,
    loading,
    addNewComment,
    deleteUserComment,
    editUserComment,
  };
}
