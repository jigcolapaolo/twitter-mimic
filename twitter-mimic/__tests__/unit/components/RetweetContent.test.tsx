import RetweetContent from "@/ui/components/RetweetContent";
import useTimeAgo from "../../../hooks/useTimeAgo";
import { render, screen } from "@testing-library/react";

// Hook mock
jest.mock("../../../hooks/useTimeAgo", () => jest.fn());

// Components mock
jest.mock("../../../src/ui/components/Avatar", () => {
  return {
    __esModule: true,
    Avatar: () => <div>Mocked Avatar</div>,
  };
});

jest.mock("../../../src/ui/components/TweetImages/TweetImages", () => {
  return {
    __esModule: true,
    default: () => <div>Mocked TweetImages</div>,
  };
});

describe("RetweetContent component", () => {
  const defaultProps = {
    id: "1",
    img: [],
    sharedAvatar: "/avatar.png",
    sharedUserName: "UserName",
    content: "This is a retweet content",
    sharedCreatedAt: 1627925600000,
  };

  beforeEach(() => {
    (useTimeAgo as jest.Mock).mockReturnValue("2 hours ago");
  });

  it("should render avatar, username, content and time", () => {
    render(<RetweetContent {...defaultProps}></RetweetContent>);

    expect(screen.getByText("Mocked Avatar")).toBeInTheDocument();
    expect(screen.getByText("UserName")).toBeInTheDocument();
    expect(screen.getByText("This is a retweet content")).toBeInTheDocument();
    expect(screen.getByText("2 hours ago")).toBeInTheDocument();
  });

  it("should render the correct link to the tweet", () => {
    render(<RetweetContent {...defaultProps} />)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "/status/1")
  })

  it("should render TweetImages if images are provided", () => {
    const imageProps = { ...defaultProps, img: ["/image1.png", "/image2.png"] }
    render(<RetweetContent { ...imageProps } />)

    expect(screen.getByText("Mocked TweetImages")).toBeInTheDocument()
  })
});
