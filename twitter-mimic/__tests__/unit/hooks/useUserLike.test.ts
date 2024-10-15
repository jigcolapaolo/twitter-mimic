import { act, renderHook } from "@testing-library/react";
import useUserLike from "../../../hooks/useUserLike";
import { fetchUsersById } from "../../../firebase/client";
import { toast } from "sonner";

jest.mock("../../../firebase/client", () => ({
  fetchUsersById: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("useUserLike", () => {
  const setLikeModalStateMock = jest.fn();

  const defaultProps = {
    id: "tweet1",
    usersLiked: ["user1", "user2"],
    likeModalState: { id: undefined, usersLiked: [] },
    setLikeModalState: setLikeModalStateMock,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize state correctly", () => {
    const { result } = renderHook(() => useUserLike({ ...defaultProps }));

    expect(result.current.loadingUsers).toBe(false);
  });

  it("should do nothing if usersLiked is empty", async () => {
    const usersLikedEmptyProps = { ...defaultProps, usersLiked: [] };
    const { result } = renderHook(() =>
      useUserLike({ ...usersLikedEmptyProps })
    );

    await act(async () => {
      await result.current.handleUserLike({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    expect(fetchUsersById).not.toHaveBeenCalled();
    expect(setLikeModalStateMock).not.toHaveBeenCalled();
  });

  it("should call fetchUsersById and change the state", async () => {
    (fetchUsersById as jest.Mock).mockResolvedValue([
      { id: "user1" },
      { id: "user2" },
    ]);

    const { result } = renderHook(() => useUserLike({ ...defaultProps }));

    await act(async () => {
      await result.current.handleUserLike({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as any);
    });

    expect(fetchUsersById).toHaveBeenCalledWith(defaultProps.usersLiked);
    expect(setLikeModalStateMock).toHaveBeenCalledWith({
      id: defaultProps.id,
      usersLiked: [{ id: "user1" }, { id: "user2" }],
    });
    expect(result.current.loadingUsers).toBe(false);
  });

  it("should show an error message if fetch fails", async () => {
    (fetchUsersById as jest.Mock).mockRejectedValueOnce(
      new Error("Error al obtener usuarios")
    );

    const { result } = renderHook(() => useUserLike({ ...defaultProps }));

    await act(async () => {
      await result.current.handleUserLike({
        preventDefault: jest.fn(),
        stopPropagation: jest.fn,
      } as any);
    });

    expect(toast.error).toHaveBeenCalledWith("Error al cargar los usuarios");
    expect(result.current.loadingUsers).toBe(false);
  });
});
