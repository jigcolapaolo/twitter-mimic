/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, waitFor } from "@testing-library/react";
import useTimeline from "../../../hooks/useTimeline";
import { User } from "@/lib/definitions";
import {
  fetchTweetById,
  listenLatestTweets,
  loadMoreTweets,
} from "../../../firebase/client";

jest.mock("../../../firebase/client", () => ({
  listenLatestTweets: jest.fn(),
  fetchTweetById: jest.fn(),
  loadMoreTweets: jest.fn(),
}));

describe("useTimeline", () => {
  const defaultProps = {
    singleTimeline: undefined,
    user: { uid: "user1" } as User,
    filterState: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize states correctly", () => {
    const { result } = renderHook(() => useTimeline({ ...defaultProps }));

    expect(result.current.timeline).toEqual([]);
    expect(result.current.retweets).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.isFetchingMore).toBe(false);
  });

  it("should return unsubscribe function on unmount", () => {
    const { unmount } = renderHook(() => useTimeline({ ...defaultProps }));
    unmount();
    expect(listenLatestTweets).toHaveBeenCalledTimes(1);
  });

  it("should listen for latest tweets and update timeline and retweets", async () => {
    const mockTweets = [
      { id: "tweet1", sharedId: "shared1" },
      { id: "tweet2", sharedId: undefined },
    ];

    const mockRetweets = [{ id: "shared1", content: "Retweet content" }];

    (listenLatestTweets as jest.Mock).mockImplementation((callback) => {
      callback(mockTweets);
      return jest.fn();
    });

    (fetchTweetById as jest.Mock).mockResolvedValue(mockRetweets[0]);

    const { result } = renderHook(() => useTimeline({ ...defaultProps }));

    await waitFor(() => {
      expect(result.current.timeline).toEqual(mockTweets);
      expect(result.current.retweets).toEqual(mockRetweets);
      expect(result.current.loading).toBe(false);
    });
  });

  it("should call handleLoadMore and update the timeline with new tweets", () => {
    const mockTweets = [{ id: "tweet1" }, { id: "tweet2" }];
    const newMockTweets = [{ id: "tweet3" }, { id: "tweet4" }];

    (listenLatestTweets as jest.Mock).mockImplementation((callback) => {
      callback(mockTweets);
      return jest.fn();
    });

    (loadMoreTweets as jest.Mock).mockImplementation((callback) => {
      callback(newMockTweets);
    });

    const { result } = renderHook(() => useTimeline({ ...defaultProps }));

    act(() => {
      result.current.handleLoadMore();
    });

    expect(result.current.timeline).toEqual([...mockTweets, ...newMockTweets]);
  });
});
