import TweetFooter from "@/ui/components/TweetFooter";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useLikeTweet from "../../../hooks/useLikeTweet";
import useRetweet from "../../../hooks/useRetweet";
import { fireEvent, render, screen } from "@testing-library/react";
import useUser from "../../../hooks/useUser";

jest.mock("../../../hooks/useLikeTweet");
jest.mock("../../../hooks/useRetweet");
jest.mock("../../../hooks/useUser");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("sonner", () => ({
  toast: {
    info: jest.fn(),
    dismiss: jest.fn(),
  },
}));

describe("TweetFooter", () => {
  const defaultProps = {
    handleUserLike: jest.fn(),
    likesCount: 10,
    commentsCount: 5,
    isLiked: false,
    isShared: false,
    userId: "123",
    id: "tweet123",
    img: [],
    sharedCount: 2,
    isRetweetModified: {
      id: undefined,
      isRetweeted: false,
      sharedCount: 0,
    },
    handleRetweetModified: jest.fn(),
  };

  const mockRouter = { push: jest.fn() };
  const mockUser = { uid: "123" };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useUser as jest.Mock).mockReturnValue(mockUser);
    (useLikeTweet as jest.Mock).mockReturnValue({
      isTweetLiked: false,
      likesCountState: 10,
      handleLikeTweet: jest.fn(),
      isAnimating: false,
    });
    (useRetweet as jest.Mock).mockReturnValue({
      isSharedUi: false,
      handleRetweet: jest.fn(),
      sharedCountUi: 2,
    });
  });

  it("should always render like and comment buttons and counts", () => {
    render(<TweetFooter {...defaultProps} />);

    expect(screen.getByRole("button", { name: /like/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /comment/i })
    ).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument(); //Likes
    expect(screen.getByText("5")).toBeInTheDocument(); //Comments
  });

  it("should render retweet button and count if user is different from tweet author", () => {
    const tweetUserProps = { ...defaultProps, userId: "456" };
    render(<TweetFooter {...tweetUserProps} />);

    expect(
      screen.getByRole("button", { name: /retweet/i })
    ).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("should not render retweet button and count if user is the same as tweet author", () => {
    render(<TweetFooter {...defaultProps} />);

    expect(
      screen.queryByRole("button", { name: /retweet/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("should call handleLikeTweet when like button is clicked", () => {
    const mockHandleLikeTweet = jest.fn();

    (useLikeTweet as jest.Mock).mockReturnValue({
      isTweetLiked: false,
      likesCountState: 10,
      handleLikeTweet: mockHandleLikeTweet,
      isAnimating: false,
    });

    render(<TweetFooter {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /like/i }));
    expect(mockHandleLikeTweet).toHaveBeenCalledTimes(1);
  });

  it("should navigate to comment section with tweet id when comment button is clicked", () => {
    render(<TweetFooter {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: /comment/i }))
    expect(mockRouter.push).toHaveBeenCalledWith(`/status/${defaultProps.id}`)
  })

  it('should copy the tweet link when copy link button is clicked', () => {
    const mockWriteText = jest.fn();
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  
    render(<TweetFooter {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button', { name: /copylink/i }));
  
    expect(mockWriteText).toHaveBeenCalledWith(`${window.location.origin}/status/${defaultProps.id}`);
    expect(toast.info).toHaveBeenCalledWith('Link copiado');
  });
  

  it("should handle retweet when active user is not tweet author and retweet button is clicked", () => {
    const mockHandleRetweet = jest.fn();
    (useRetweet as jest.Mock).mockReturnValue({
        isSharedUi: false,
        handleRetweet: mockHandleRetweet,
        sharedCountUi: 2,
    });

    const tweetUserProps = { ...defaultProps, userId: "651" }
    render(<TweetFooter {...tweetUserProps} />)
    fireEvent.click(screen.getByRole("button", { name: /retweet/i }))

    expect(mockHandleRetweet).toHaveBeenCalledTimes(1)
  })
});
