/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, waitFor } from "@testing-library/react";
import useLogin, { LOGIN_TYPES } from "../../../hooks/useLogin";
import { loginWithGitHub, loginWithGoogle } from "../../../firebase/client";

jest.mock("../../../firebase/client", () => ({
  loginWithGoogle: jest.fn().mockResolvedValue(Promise.resolve()),
  loginWithGitHub: jest.fn().mockResolvedValue(Promise.resolve()),
}));

describe("useLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not call any function if no login type is set", () => {
    renderHook(() => useLogin())

    expect(loginWithGoogle).not.toHaveBeenCalled()
    expect(loginWithGitHub).not.toHaveBeenCalled()
  })

  it("should login with Google when login type is set to Google", async () => {
    const { result } = renderHook(() => useLogin());

    act(() => {
      result.current.setLoginType(LOGIN_TYPES.GOOGLE);
    });

    await waitFor(() => {
        expect(loginWithGoogle).toHaveBeenCalledTimes(1);
        expect(loginWithGitHub).not.toHaveBeenCalled()
      });
  });

  it("should login with Github when login type is set to Github", async () => {
    const { result } = renderHook(() => useLogin())

    act(() => {
        result.current.setLoginType(LOGIN_TYPES.GITHUB)
    })

    await waitFor(() => {
        expect(loginWithGitHub).toHaveBeenCalledTimes(1);
        expect(loginWithGoogle).not.toHaveBeenCalled()
    })
  })
});
