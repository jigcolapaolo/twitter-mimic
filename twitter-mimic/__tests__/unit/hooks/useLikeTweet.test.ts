/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, waitFor } from "@testing-library/react";
import useLikeTweet from "../../../hooks/useLikeTweet";
import { User } from "@/lib/definitions";
import { toast } from "sonner";
import { likeTweet } from "../../../firebase/client";

jest.mock("../../../firebase/client");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("useLikeTweet", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize states correctly", () => {
    const { result } = renderHook(() =>
      useLikeTweet(false, 0, "tweet1", { uid: "user1" } as User)
    );

    expect(result.current.isTweetLiked).toBe(false);
    expect(result.current.likesCountState).toEqual(0);
    expect(result.current.isAnimating).toBe(false);
  });

  it("should show error message when giving a like fails", async () => {
    (likeTweet as jest.Mock).mockRejectedValueOnce(
      new Error("Error al dar like")
    );

    const { result } = renderHook(() =>
      useLikeTweet(false, 0, "tweet1", { uid: "user1" } as User)
    );

    await act(async () => {
      result.current.handleLikeTweet({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    await waitFor(async () => {
      expect(toast.error).toHaveBeenLastCalledWith(
        "Error al dar like, inténtalo de nuevo."
      );
    });
  });

  it("should toggle the like state and update likes count when handleLikeTweet is called", async () => {
    const { result } = renderHook(() => useLikeTweet(false, 0, "tweet1", { uid: "user1" } as User))

    await act(async () => {
        result.current.handleLikeTweet({ preventDefault: jest.fn(), stopPropagation: jest.fn() } as any)
    })

    await waitFor(async () => {
        expect(likeTweet).toHaveBeenCalledWith({ tweetId: "tweet1", userId: "user1" });
        expect(result.current.isTweetLiked).toBe(true);
        expect(result.current.likesCountState).toEqual(1)
    })
  })

  it("should update liked state if user has liked the tweet", () => {
    const { result } = renderHook(() => useLikeTweet(false, 0, "tweet1", { uid: "user1", likedTweets: ["tweet1"] } as User))

    expect(result.current.isTweetLiked).toBe(true)
  })

  it("should trigger an animation when handleLikeTweet is called", async () => {

    jest.useFakeTimers()

    const { result } = renderHook(() => useLikeTweet(false, 0, "tweet1", { uid: "user1" } as User))

    await act(async () => {
        result.current.handleLikeTweet({ preventDefault: jest.fn(), stopPropagation: jest.fn() } as any)
    })

    await waitFor(async () => {
        expect(result.current.isAnimating).toBe(true)
    })

    await act(async () => {
        jest.advanceTimersByTime(500)
    })

    await waitFor(async () => {
        expect(result.current.isAnimating).toBe(false)
    })

  })
});
