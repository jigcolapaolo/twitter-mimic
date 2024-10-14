import Comments from "@/ui/components/Comments/Comments";
import { fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";
import useUser from "../../../hooks/useUser";
import useComment from "../../../hooks/useComment";

jest.mock("../../../hooks/useUser");
jest.mock("../../../hooks/useComment");
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("Comments component", () => {
  const mockAddNewComment = jest.fn();
  const mockDeleteUserComment = jest.fn();
  const mockEditUserComment = jest.fn();

    const user = {
        uid: "user123",
        displayName: "Usuario",
        avatar: "avatar.png",
    }

  beforeEach(() => {
    jest.clearAllMocks();

    (useUser as jest.Mock).mockReturnValue(user);

    (useComment as jest.Mock).mockReturnValue({
      comments: [
        {
          id: "comment1",
          content: "Buena foto!",
          tweetId: "tweet1",
          userId: "user123",
          userName: "Usuario",
          avatar: "avatar.png",
          createdAt: 2323242421,
        },
      ],
      addNewComment: mockAddNewComment,
      deleteUserComment: mockDeleteUserComment,
      editUserComment: mockEditUserComment,
      loading: false,
    });
  });
  

  it("should render comments correctly", () => {
    render(<Comments tweetId="tweet123" />);

    expect(screen.getByText("Buena foto!")).toBeInTheDocument()
    expect(screen.getByText("Usuario")).toBeInTheDocument()
  });

  it("should add a new comment", async () => {
    render(<Comments tweetId="tweet123" />)

    const textarea = screen.getByPlaceholderText("Escribe un comentario")
    const submitBtn = screen.getByRole("button", { name: /comentar/i })

    fireEvent.change(textarea, { target: { value: "Nuevo comentario!" } })
    fireEvent.click(submitBtn)

    await expect(mockAddNewComment).toHaveBeenCalledWith({
        message: "Nuevo comentario!",
        user,
    })
  })

  it("should show error message when adding comment fails", async () => {
    mockAddNewComment.mockRejectedValueOnce(new Error("Error al agregar comentario"))

    render(<Comments tweetId="tweet123" />)

    const textarea = screen.getByPlaceholderText("Escribe un comentario")
    const submitBtn = screen.getByRole("button", { name: /comentar/i })

    fireEvent.change(textarea, { target: { value: "Nuevo comentario!" } })

    fireEvent.click(submitBtn)

    await expect(mockAddNewComment).toHaveBeenCalled()

    expect(toast.error).toHaveBeenCalledWith("Error al agregar el comentario")

  })

  it("should not add a new comment if textarea is empty", () => {
    render(<Comments tweetId="tweet123" />)

    const submitBtn = screen.getByRole("button", { name: /comentar/i })

    fireEvent.click(submitBtn)

    expect(mockAddNewComment).not.toHaveBeenCalled()

  })

  // npm test "Comments.test.tsx"
});
