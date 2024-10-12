import TweetClient from "@/ui/components/Tweet";
import useUser from "../../../hooks/useUser";
import useTimeline from "../../../hooks/useTimeline";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";

jest.mock("../../../hooks/useUser");
jest.mock("../../../hooks/useTimeline");
jest.mock("../../../hooks/useInfiniteScroll");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));
jest.mock("react-spinners", () => ({
  SyncLoader: jest.fn(() => <div>Loading...</div>),
}));

describe("TweetClient component", () => {
  beforeEach(() => {
    (useUser as jest.Mock).mockReturnValue({
      uid: "123",
      likedTweets: ["1"],
      sharedTweets: ["2"],
    });

    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [],
      retweets: [],
      loading: false,
      isFetchingMore: false,
      handleLoadMore: jest.fn(),
    });

    (useInfiniteScroll as jest.Mock).mockReturnValue({
      sectionRef: { current: null },
    });
  });

  it("should render loader when its loading and there are no tweets", () => {
    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [],
      retweets: [],
      loading: true,
      isFetchingMore: false,
      handleLoadMore: jest.fn(),
    });

    render(<TweetClient singleTimeline={[]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should render tweets correctly when they are available", () => {
    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [
        {
          id: "1",
          userName: "Juan",
          content: "Hola mundo",
          likesCount: 5,
          sharedCount: 2,
          createdAt: 2321231232,
          avatar: "avatar.jpg",
          img: null,
          usersLiked: [],
          usersComments: [],
        },
      ],
      retweets: [],
      loading: false,
      isFetchingMore: false,
      handleLoadMore: jest.fn(),
    });
    render(<TweetClient singleTimeline={[]} />);

    expect(screen.getByText("Juan")).toBeInTheDocument();
    expect(screen.getByText("Hola mundo")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText(2)).toBeInTheDocument();
  });

  it("should handle retweets correctly", () => {
    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [
        {
          id: "1",
          userName: "Juan",
          content: "Hola mundo",
          likesCount: 5,
          sharedCount: 2,
          createdAt: 2321231232,
          avatar: "avatar.jpg",
          img: null,
          usersLiked: [],
          usersComments: [],
          sharedId: "shared-1",
        },
      ],
      retweets: [
        {
          id: "shared-1",
          userName: "Carlos",
          content: "Este es el contenido original del retweet",
          likesCount: 3,
          sharedCount: 1,
          createdAt: 2325231232,
          avatar: "avatar2.jpg",
          img: null,
          usersLiked: [],
          usersComments: [],
        },
      ],
      loading: false,
      isFetchingMore: false,
      handleLoadMore: jest.fn(),
    });

    render(<TweetClient singleTimeline={[]} />);

    expect(screen.getByText(/ha compartido un tweet de/i)).toBeInTheDocument();
    const elements = screen.getAllByText("Carlos");

    expect(elements).toHaveLength(2);
  });

  it("should handle infinite scroll", () => {
    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [],
      retweets: [],
      loading: false,
      isFetchingMore: true,
      handleLoadMore: jest.fn(),
    });

    render(<TweetClient singleTimeline={[]} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("should redirect to tweet status page when tweet is clicked", () => {
    const mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  
    (useTimeline as jest.Mock).mockReturnValue({
      timeline: [
        {
          id: "1",
          userName: "Juan",
          content: "Hola mundo",
          likesCount: 5,
          sharedCount: 2,
          createdAt: 2321231232,
          avatar: "avatar.jpg",
          img: null,
          usersLiked: [],
          usersComments: [],
        },
      ],
      retweets: [],
      loading: false,
      isFetchingMore: false,
      handleLoadMore: jest.fn(),
    });
  
    render(<TweetClient singleTimeline={[]} />);
  
    fireEvent.click(screen.getByRole("article", { name: "Tweet" }));
  
    expect(mockPush).toHaveBeenCalledWith("/status/1");
  });
});
