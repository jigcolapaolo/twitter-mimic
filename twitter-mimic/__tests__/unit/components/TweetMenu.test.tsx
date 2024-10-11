import TweetMenu from "@/ui/components/TweetMenu";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("TweetMenu", () => {
  const routerPushMock = jest.fn();
  const setIsMenuOpenMock = jest.fn();

  const defaultProps = {
    id: "tweet123",
    isMenuOpen: undefined,
    setIsMenuOpen: setIsMenuOpenMock,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: routerPushMock,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should render the menu button", () => {
    render(<TweetMenu {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: /tweetMenuIcon/i })
    ).toBeInTheDocument();
  });

  it("should toggle the menu visibility on menu button click", () => {
    render(<TweetMenu {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /tweetMenuIcon/i }));
    expect(setIsMenuOpenMock).toHaveBeenCalledTimes(1);
  });

  it("should call the edit handler when edit button is clicked", () => {
    render(<TweetMenu {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /tweetEdit/i }));
    expect(routerPushMock).toHaveBeenCalledWith(
      `/status/edit/${defaultProps.id}`
    );
  });

  it("should handle tweet deletion correctly", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;

    render(<TweetMenu {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /tweetDelete/i }));

    await expect(global.fetch).toHaveBeenCalledWith(
      `/api/tweets/delete/${defaultProps.id}`,
      { method: "DELETE" }
    );
    expect(toast.success).toHaveBeenCalledWith("Tweet eliminado exitosamente");
    expect(setIsMenuOpenMock).toHaveBeenCalledWith(undefined);
    expect(routerPushMock).toHaveBeenCalledWith("/home");
  });

  it("should show error if tweet deletion fails", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false })) as jest.Mock;

    render(<TweetMenu {...defaultProps} />);
    fireEvent.click(screen.getByRole("button", { name: /tweetDelete/i }));

    await expect(global.fetch).toHaveBeenCalledWith(
      `/api/tweets/delete/${defaultProps.id}`,
      { method: "DELETE" }
    );
    expect(toast.error).toHaveBeenCalledWith("Error al eliminar el tweet")
  });

});
