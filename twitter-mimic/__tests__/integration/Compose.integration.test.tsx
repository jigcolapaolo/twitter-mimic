import { fireEvent, render, screen } from "@testing-library/react";
import ComposeTweet from "@/app/compose/tweet/page";
import useTextChange from "../../hooks/useTextChange";
import useUploadImg, { DRAG_IMAGE_STATES } from "../../hooks/useUploadImg";
import { addTweet } from "../../firebase/client";

const mockPush = jest.fn();

const defaultMessage = {
  message: "",
  handleChange: jest.fn(),
  isButtonDisabled: true,
  setStatus: jest.fn(),
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
    ...defaultMessage,
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
    ...defaultUploadImg,
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
      const defaultMessageWithMessage = {
        ...defaultMessage,
        message: "Hola mundo",
        isButtonDisabled: false,
      };
      (useTextChange as jest.Mock).mockReturnValue({
        ...defaultMessageWithMessage
      });

    render(<ComposeTweet />);

    expect(screen.getByRole("button", { name: /tweet/i })).toBeEnabled();
  })

  it("should display an image when an image is dropped", () => {
    const defaultUploadImgWithImage = {
      ...defaultUploadImg,
      imgURLs: ["image.png"],
    };

    (useUploadImg as jest.Mock).mockReturnValue({
      ...defaultUploadImgWithImage
    })

    render(<ComposeTweet />);

    const image = screen.getByAltText("Image to Upload");
    expect(image).toBeInTheDocument();
  })

  it("should submit the tweet and redirect to /home", async () => {
    const defaultMessageWithMessage = {
      ...defaultMessage,
      message: "Hola mundo",
      isButtonDisabled: false,
    };

    (useTextChange as jest.Mock).mockReturnValue({
        ...defaultMessageWithMessage
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