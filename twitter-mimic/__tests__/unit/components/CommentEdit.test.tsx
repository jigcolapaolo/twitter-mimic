import CommentEdit from "@/ui/components/Comments/CommentEdit";
import { fireEvent, render, screen } from "@testing-library/react";

import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
  },
}));

describe("CommentEdit component", () => {
  const mockEditUserComment = jest.fn();
  const mockSetIsEditOpen = jest.fn();

  const defaultProps = {
    id: "tweet123",
    content: "This is a tweet",
    userId: "user123",
    editUserComment: mockEditUserComment,
    setIsEditOpen: mockSetIsEditOpen,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update comment when user edits and submits", async () => {
    render(<CommentEdit {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Escribe un comentario");
    const submitBtn = screen.getByRole("button", { name: /guardar/i });

    fireEvent.change(textarea, { target: { value: "Comentario editado" } });

    fireEvent.click(submitBtn);

    await expect(mockEditUserComment).toHaveBeenCalledWith({
      commentId: "tweet123",
      userId: "user123",
      content: "Comentario editado",
    });

    expect(mockSetIsEditOpen).toHaveBeenCalledWith(undefined);
  });

  it("should not allow saving if content is empty or unchanged", () => {
    render(<CommentEdit {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Escribe un comentario");
    const submitBtn = screen.getByRole("button", { name: /guardar/i });

    fireEvent.click(submitBtn);
    expect(mockEditUserComment).not.toHaveBeenCalled();

    fireEvent.change(textarea, { target: { value: "" } });
    fireEvent.click(submitBtn);
    expect(mockEditUserComment).not.toHaveBeenCalled();
  });

  it("should show loading state when editing comment", async () => {
    render(<CommentEdit {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Escribe un comentario");
    const submitBtn = screen.getByRole("button", { name: /guardar/i });

    fireEvent.change(textarea, { target: { value: "Comentario editado" } });
    fireEvent.click(submitBtn);

    expect(submitBtn).toHaveTextContent("Guardando...");

    await expect(mockEditUserComment).toHaveBeenCalled();
  });

  it("should show error message when edit fails", async () => {
    mockEditUserComment.mockRejectedValueOnce(new Error("Error al editar"));

    render(<CommentEdit {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Escribe un comentario");
    const submitBtn = screen.getByRole("button", { name: /guardar/i });

    fireEvent.change(textarea, { target: { value: "Comentario editado" } });
    fireEvent.click(submitBtn);

    await expect(mockEditUserComment).toHaveBeenCalled();

    expect(toast.error).toHaveBeenCalledWith("Error al editar el comentario");
  });
});
