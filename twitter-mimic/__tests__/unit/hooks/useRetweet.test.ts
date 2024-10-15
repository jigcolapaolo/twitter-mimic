import { act, renderHook, waitFor } from "@testing-library/react";
import useRetweet from "../../../hooks/useRetweet";
import useUser from "../../../hooks/useUser";
import { retweet } from "../../../firebase/client";
import { toast } from "sonner";

jest.mock("../../../hooks/useUser");
jest.mock("../../../firebase/client", () => ({
  retweet: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("useRetweet", () => {
  const handleRetweetModifiedMock = jest.fn();

  const defaultProps = {
    isShared: false,
    sharedCount: 2,
    id: "tweet1",
    img: [],
    isRetweetModified: {
      id: undefined,
      isRetweeted: false,
      sharedCount: 2,
    },
    handleRetweetModified: handleRetweetModifiedMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue({
      uid: "user1",
    });
  });

  it("should initialize states correctly", () => {
    const { result } = renderHook(() => useRetweet({ ...defaultProps }));

    expect(result.current.isSharedUi).toBe(defaultProps.isShared);
    expect(result.current.sharedCountUi).toEqual(defaultProps.sharedCount);
  });

  it("should show error message when retweet fails", async () => {
    (retweet as jest.Mock).mockRejectedValueOnce(
      new Error("Error al hacer retweet")
    );

    const { result } = renderHook(() => useRetweet({ ...defaultProps }));

    await act(async () => {
      result.current.handleRetweet({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Error al retwittear");
    });
  });

  it("should handle retweet correctly", async () => {
    const mockUser = {
      uid: "user123",
      avatar: "avatar.png",
      displayName: "John",
      sharedTweets: [],
    };

    (useUser as jest.Mock).mockReturnValue(mockUser);

    const { result } = renderHook(() => useRetweet({ ...defaultProps }));

    await act(() => {
      result.current.handleRetweet({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    await waitFor(() => {
      expect(retweet).toHaveBeenCalledWith({
        avatar: mockUser.avatar,
        content: "",
        userId: mockUser.uid,
        userName: mockUser.displayName,
        img: [],
        sharedId: defaultProps.id,
      });
    });
  });

});
