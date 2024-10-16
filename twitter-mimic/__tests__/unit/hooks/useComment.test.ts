/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, waitFor } from "@testing-library/react";
import useComment from "../../../hooks/useComment";
import {
  addComment,
  deleteComment,
  editComment,
  fetchLatestTweetComments,
} from "../../../firebase/client";
import { User } from "@/lib/definitions";

jest.mock("../../../firebase/client", () => ({
  fetchLatestTweetComments: jest.fn(),
  addComment: jest.fn(),
  deleteComment: jest.fn(),
  editComment: jest.fn(),
}));

describe("useComment", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize states correctly", () => {
    const { result } = renderHook(() => useComment({ tweetId: undefined }));

    expect(result.current.comments).toEqual([]);
    expect(result.current.loading).toBe(true);
  });

  it("should update states when the hook receives a tweetId", async () => {
    (fetchLatestTweetComments as jest.Mock).mockResolvedValue([
      {
        id: "comment1",
      },
    ]);

    const { result } = renderHook(() => useComment({ tweetId: "tweet1" }));

    await act(async () => {
      expect(fetchLatestTweetComments).toHaveBeenCalledWith("tweet1");
    });

    await waitFor(async () => {
      expect(result.current.comments).toEqual([{ id: "comment1" }]);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should add new comment when addNewComment is called", async () => {
    (fetchLatestTweetComments as jest.Mock).mockResolvedValue([
      {
        id: "comment1",
        tweetId: "tweet2",
      },
      {
        id: "comment2",
        tweetId: "tweet1",
      },
    ]);

    const { result } = renderHook(() => useComment({ tweetId: "tweet1" }));

    await act(async () => {
      result.current.addNewComment({
        message: "Nuevo comentario",
        user: {
          uid: "user1",
          displayName: "john",
          avatar: "avatar.png",
        } as User,
      });
    });

    expect(addComment).toHaveBeenCalledWith({
      tweetId: "tweet1",
      userId: "user1",
      userName: "john",
      content: "Nuevo comentario",
      avatar: "avatar.png",
    });

    await waitFor(async () => {
      expect(result.current.comments).toEqual([
        {
          id: "comment1",
          tweetId: "tweet2",
        },
        {
          id: "comment2",
          tweetId: "tweet1",
        },
      ]);
    });
  });

  it("should delete a comment when deleteUserComment is called", async () => {
    (fetchLatestTweetComments as jest.Mock).mockResolvedValue([
      { id: "comment2", tweetId: "user1" },
    ]);

    const { result } = renderHook(() => useComment({ tweetId: "tweet1" }));

    await act(async () => {
      result.current.deleteUserComment({
        commentId: "comment1",
        userId: "user1",
      });
    });

    expect(deleteComment).toHaveBeenCalledWith({
      tweetId: "tweet1",
      commentId: "comment1",
      userId: "user1",
    });

    expect(fetchLatestTweetComments).toHaveBeenCalled();
    expect(result.current.comments).toEqual([
      { id: "comment2", tweetId: "user1" },
    ]);
  });

  it("should edit a comment when editUserComment is called", async () => {
    (fetchLatestTweetComments as jest.Mock).mockResolvedValue([
      {
        id: "comment1",
        tweetId: "tweet1",
        userId: "user1",
        content: "Comentario editado",
      },
    ]);

    const { result } = renderHook(() => useComment({ tweetId: "tweet1" }));

    await act(async () => {
      result.current.editUserComment({
        commentId: "comment1",
        userId: "user1",
        content: "Comentario editado",
      });
    });

    expect(editComment).toHaveBeenCalledWith({
      commentId: "comment1",
      userId: "user1",
      content: "Comentario editado",
    });

    expect(fetchLatestTweetComments).toHaveBeenCalled();
    expect(result.current.comments).toEqual([
      {
        id: "comment1",
        tweetId: "tweet1",
        userId: "user1",
        content: "Comentario editado",
      },
    ]);
  });

  it("should fail to add a new comment when tweetId is undefined", async () => {
    const { result } = renderHook(() => useComment({ tweetId: undefined }));

    await act(() => {
      result.current.addNewComment({
        message: "Nuevo comentario",
        user: {
          uid: "user1",
          displayName: "john",
          avatar: "avatar.png",
        } as User,
      });
    });

    expect(addComment).not.toHaveBeenCalled();
  });

  it("should fail to delete a comment when tweetId is undefined", async () => {
    const { result } = renderHook(() => useComment({ tweetId: undefined }));

    await act(async () => {
        result.current.deleteUserComment({
          commentId: "comment1",
          userId: "user1",
        });
      });

    expect(deleteComment).not.toHaveBeenCalled();
  });

  it("should fail to edit a comment when tweetId is undefined", async () => {
    const { result } = renderHook(() => useComment({ tweetId: undefined }));

    await act(async () => {
        result.current.editUserComment({
          commentId: "comment1",
          userId: "user1",
          content: "Comentario editado",
        });
      });

    expect(editComment).not.toHaveBeenCalled();
  });
});
