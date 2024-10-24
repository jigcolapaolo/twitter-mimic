import { fireEvent, render, screen } from "@testing-library/react";
import Home from "@/app/page";
import useUser, { USER_STATES } from "../../hooks/useUser";
import { LOGIN_TYPES } from "../../hooks/useLogin";

const mockPush = jest.fn()
const mockSetLoginType = jest.fn()

jest.mock("../../hooks/useUser", () => ({
    __esModule: true,
    default: jest.fn(),
    USER_STATES: {
      NOT_LOGGED: null,
      NOT_KNOWN: undefined,
    },
  }));
  
  jest.mock("../../hooks/useLogin", () => ({
    __esModule: true,
    default: () => ({
      setLoginType: mockSetLoginType,
    }),
    LOGIN_TYPES: {
      GITHUB: 1,
      GOOGLE: 2,
    }
  }));
  
  jest.mock("next/navigation", () => ({
    useRouter: jest.fn().mockImplementation(() => ({
      push: mockPush
    }))
  }))

  jest.mock("react-spinners", () => ({
    SyncLoader: jest.fn(() => <div>Loading...</div>)
  }))

describe("Home page integration", () => {
  it("should show loading spinner when user state is NOT_KNOWN", () => {
    (useUser as jest.Mock).mockReturnValue(USER_STATES.NOT_KNOWN);

    render(<Home />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should show buttons to log in when user state is NOT_LOGGED", () => {
    (useUser as jest.Mock).mockReturnValue(USER_STATES.NOT_LOGGED);

    render(<Home />)

    expect(screen.getByRole("button", { name: /login with github/i }))
    expect(screen.getByRole("button", { name: /login with google/i }))
  })

  it("should redirect to '/home' when user is logged in", () => {

    const mockUser = { uid: "123", email: "user@test.com" };
    (useUser as jest.Mock).mockReturnValue(mockUser);
  
    render(<Home />);
  
    expect(mockPush).toHaveBeenCalledWith("/home");
  })

  it("should call setLoginType with correct login type on button click", () => {

    (useUser as jest.Mock).mockReturnValue(USER_STATES.NOT_LOGGED)

    render(<Home />)

    fireEvent.click(screen.getByRole("button", { name: /login with github/i }))
    expect(mockSetLoginType).toHaveBeenCalledWith(LOGIN_TYPES.GITHUB)

    fireEvent.click(screen.getByRole("button", { name: /login with google/i }))
    expect(mockSetLoginType).toHaveBeenCalledWith(LOGIN_TYPES.GOOGLE)
  })

  it("should not show login buttons if login is NOT_KNOWN", () => {
    (useUser as jest.Mock).mockReturnValue(USER_STATES.NOT_KNOWN)

    render(<Home />)

    expect(screen.queryByRole("button", { name: /login with github/i })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: /login with google/i })).not.toBeInTheDocument()
  })

});
