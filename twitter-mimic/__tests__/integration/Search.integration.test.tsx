import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import SearchPage from "@/app/search/page";
import { onAuthStateChanged } from "../../firebase/client";



const mockUser = {
  uid: "user123",
  avatar: "avatar.png",
  displayName: "Test User",
}

const mockPush = jest.fn();

  jest.mock("next/navigation", () => ({
    useRouter: jest.fn().mockImplementation(() => ({
      push: mockPush,
    })),
    usePathname: jest.fn(),
  }))

  jest.mock('../../firebase/client', () => ({
    onAuthStateChanged: jest.fn(),
    listenLatestTweets: jest.fn(),
  }));


describe("SearchPage", () => {


  beforeEach(() => {
    jest.clearAllMocks();

    (onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(mockUser);
      return () => {};
    });
  });

  test("should render with HomeLayout, SearchPage and TweetClient", async () => {

    render(<SearchPage />);

    expect(screen.getByTestId("home-layout")).toBeInTheDocument();
    expect(screen.getByTestId("search-filters")).toBeInTheDocument();
    expect(screen.getByTestId("tweet-client")).toBeInTheDocument();
  });

  test("should have 3 filters and 1 input rendered correctly", async () => {
    render(<SearchPage />);

    expect(screen.getByTestId("search-filters")).toHaveTextContent("Top");
    expect(screen.getByTestId("search-filters")).toHaveTextContent("Recientes");
    expect(screen.getByTestId("search-filters")).toHaveTextContent(
      "Mis Tweets"
    );
    expect(screen.getByPlaceholderText("Buscar usuarios...")).toBeInTheDocument();
  });

  test("should have top filter selected by default", async () => {
    render(<SearchPage />);

    const topFilter = screen.getByRole("radio", { name: /top/i });
    expect(topFilter).toBeChecked();
  })

  test("should change the filter when a new radio input is selected", async () => {
    render(<SearchPage />);

    const recentFilter = screen.getByRole("radio", { name: /recientes/i });
    expect(recentFilter).not.toBeChecked();

    fireEvent.click(recentFilter);

    expect(recentFilter).toBeChecked();
  })

  test("should redirect to login page if user is not logged in", async () => {

    (onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
      callback(null);
      return () => {};
    });
    
    render(<SearchPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/');
    });

  })
});
