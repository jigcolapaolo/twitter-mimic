import EditTweetPage from "@/app/status/edit/[Id]/page";
import { DRAG_IMAGE_STATES } from "../../hooks/useUploadImg";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import useTextChange from "../../hooks/useTextChange";
import useUser from "../../hooks/useUser";

const mockSetMessage = jest.fn();
const defaultMessage = {
  message: "",
  setMessage: mockSetMessage,
  setStatus: jest.fn(),
  isButtonDisabled: true,
  handleChange: jest.fn(),
};

const defaultUploadImg = {
  drag: DRAG_IMAGE_STATES.NONE,
  imgURLs: [],
  uploadProgress: 0,
  setImgURLs: jest.fn(),
  handleDragEnter: jest.fn(),
  handleDragLeave: jest.fn(),
  handleDrop: jest.fn(),
  handleFileChange: jest.fn(),
  handleOpenFileDialog: jest.fn(),
};

const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockPush,
  })),
}));

jest.mock("../../hooks/useUser", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    uid: "user123",
    displayName: "Test User",
    avatar: "avatar.png",
  })),
  USER_STATES: {
    NOT_LOGGED: null,
    NOT_KNOWN: undefined,
  },
}));

jest.mock("../../hooks/useUploadImg", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ...defaultUploadImg,
  })),
  DRAG_IMAGE_STATES: {
    NONE: 0,
    DRAG_OVER: 1,
    UPLOADING: 2,
    COMPLETE: 3,
    ARRAYFULL: 4,
    ERROR: 5,
  },
}));

jest.mock("../../hooks/useTextChange", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ...defaultMessage,
  })),
  TEXT_STATES: {
    NONE: 0,
    LOADING: 1,
    ERROR: 2,
  },
}));

const tweetMock = {
  id: "tweet1",
  userName: "Test User",
  userId: "user123",
  content: "Test content",
  img: [],
};

describe("EditTweetPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should fetch data and render correctly", async () => {
    (useTextChange as jest.Mock).mockReturnValue({
      ...defaultMessage,
      message: tweetMock.content,
    });

    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(tweetMock),
    });

    window.fetch = mockFetch;

    render(<EditTweetPage params={{ Id: "tweet1" }} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/tweets/tweet1", {
        method: "GET",
      });
    });

    const textarea = await screen.findByRole("textbox");
    expect(textarea).toHaveValue(tweetMock.content);
  });

  test("should redirect to home if tweet is not found", async () => {
    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    window.fetch = mockFetch;

    render(<EditTweetPage params={{ Id: "tweet1" }} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/tweets/tweet1", {
        method: "GET",
      });
    });

    expect(mockPush).toHaveBeenCalledWith("/home");
  });

  test("should redirect to home if user is not logged in", async () => {
    (useUser as jest.Mock).mockReturnValue({
      default: () => null
    });

    (useTextChange as jest.Mock).mockReturnValue({
      ...defaultMessage,
      message: tweetMock.content,
    });

    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(tweetMock),
    });

    window.fetch = mockFetch;

    render(<EditTweetPage params={{ Id: "tweet1" }} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/tweets/tweet1", {
        method: "GET",
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/home");
    });
  });

  // should call submit with correct data when save button is clicked
  test("should call submit with correct data when save button is clicked", async () => {
    (useTextChange as jest.Mock).mockReturnValue({
        ...defaultMessage,
        message: tweetMock.content,
        isButtonDisabled: false,
    });
  

    const mockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(tweetMock),
    });
  
    window.fetch = mockFetch;
  
    render(<EditTweetPage params={{ Id: "tweet1" }} />);
  
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/tweets/tweet1", {
        method: "GET",
      });
    });
  
    const putMockFetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Tweet actualizado" }),
    });
    window.fetch = putMockFetch;

    const saveButton = screen.getByRole("button", { name: "Guardar" });
    expect(saveButton).toBeEnabled();
  
    fireEvent.click(saveButton);
  
    await waitFor(() => {
      expect(putMockFetch).toHaveBeenCalled();
    });
  
    await waitFor(() => {
      expect(putMockFetch).toHaveBeenCalledWith("/api/tweets/put/tweet1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: tweetMock.content,
          img: tweetMock.img,
        }),
      });
    });
  });
});
