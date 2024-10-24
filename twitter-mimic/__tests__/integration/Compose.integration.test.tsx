import { fireEvent, render, screen } from "@testing-library/react";
import ComposeTweet from "@/app/compose/tweet/page";
import useTextChange from "../../hooks/useTextChange";
import useUploadImg, { DRAG_IMAGE_STATES } from "../../hooks/useUploadImg";
import { addTweet } from "../../firebase/client";

const mockPush = jest.fn();
const mockSetStatus = jest.fn();
const mockHandleChange = jest.fn();
const mockSetImgURLs = jest.fn();
const mockHandleDragEnter = jest.fn();
const mockHandleDragLeave = jest.fn();
const mockHandleDrop = jest.fn();
const mockHandleFileChange = jest.fn();
const mockHandleOpenFileDialog = jest.fn();


jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockImplementation(() => ({
    push: mockPush,
  })),
}));

jest.mock("../../hooks/useUser", () => ({
  __esModule: true,
  default: jest.fn( () => ({
    uid: "user123",
    displayName: "Test User",
    avatar: "avatar.png",
  })),
  USER_STATES: {
    NOT_LOGGED: null,
    NOT_KNOWN: undefined,
  },
}));

jest.mock("../../hooks/useTextChange", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    message: "",
    handleChange: mockHandleChange,
    isButtonDisabled: true,
    setStatus: mockSetStatus,
  })),
  TEXT_STATES: {
    NONE: 0,
    LOADING: 1,
    ERROR: 2,
  },
}));

jest.mock("../../hooks/useUploadImg", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    drag: DRAG_IMAGE_STATES.NONE,
    imgURLs: [],
    uploadProgress: 0,
    setImgURLs: mockSetImgURLs,
    handleDragEnter: mockHandleDragEnter,
    handleDragLeave: mockHandleDragLeave,
    handleDrop: mockHandleDrop,
    handleFileChange: mockHandleFileChange,
    handleOpenFileDialog: mockHandleOpenFileDialog,
  })),
  DRAG_IMAGE_STATES: {
    NONE: 0,
    DRAG_OVER: 1,
    UPLOADING: 2,
    COMPLETE: 3,
    ARRAYFULL: 4,
    ERROR: 5,
  }
}));

jest.mock("../../firebase/client", () => ({
    addTweet: jest.fn(),
  }));


describe("ComposeTweet integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should disable tweet button when message is empty", () => {
    render(<ComposeTweet />);

    expect(screen.getByRole("button", { name: /tweet/i })).toBeDisabled();
  });

  it("should enable tweet button when message is not empty", () => {
      (useTextChange as jest.Mock).mockReturnValue({
        message: "Hola mundo",
        handleChange: mockHandleChange,
        isButtonDisabled: false,
        setStatus: mockSetStatus,
      });

    render(<ComposeTweet />);

    expect(screen.getByRole("button", { name: /tweet/i })).toBeEnabled();
  })

  it("should display an image when an image is dropped", () => {
    (useUploadImg as jest.Mock).mockReturnValue({
        drag: DRAG_IMAGE_STATES.NONE,
        imgURLs: ["image.png"],
        uploadProgress: 0,
        setImgURLs: mockSetImgURLs,
        handleDragEnter: mockHandleDragEnter,
        handleDragLeave: mockHandleDragLeave,
        handleDrop: mockHandleDrop,
        handleFileChange: mockHandleFileChange,
        handleOpenFileDialog: mockHandleOpenFileDialog,
    })

    render(<ComposeTweet />);

    const image = screen.getByAltText("Image to Upload");
    expect(image).toBeInTheDocument();
  })

  it("should submit the tweet and redirect to /home", async () => {
    (useTextChange as jest.Mock).mockReturnValue({
        message: "Hola mundo",
        handleChange: mockHandleChange,
        isButtonDisabled: false,
        setStatus: mockSetStatus,
      });
      
      (addTweet as jest.Mock).mockResolvedValue(Promise.resolve());
  
      render(<ComposeTweet />);
  
      const button = screen.getByRole("button", { name: /tweet/i });
  
      fireEvent.click(button);
  
      await expect(addTweet).toHaveBeenCalledWith({
        avatar: "avatar.png",
        content: "Hola mundo",
        userId: "user123",
        userName: "Test User",
        img: ["image.png"],
      });
  
      expect(mockPush).toHaveBeenCalledWith("/home");
  })

});

// npm test "Compose.integration.test.tsx"
