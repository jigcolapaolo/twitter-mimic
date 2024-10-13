import CommentMenu from "@/ui/components/Comments/CommentMenu";
import { fireEvent, render, screen } from "@testing-library/react";
import { toast } from "sonner";

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn()
    }
}))

describe("CommentMenu component", () => {

    const setIsMenuOpenMock = jest.fn();
    const deleteUserCommentMock = jest.fn();
    const setIsEditOpen = jest.fn();

    const defaultProps = {
        id: "comment123",
        userId: "user123",
        isMenuOpen: undefined,
        setIsMenuOpen: setIsMenuOpenMock,
        deleteUserComment: deleteUserCommentMock,
        isEditOpen: undefined,
        setIsEditOpen: setIsEditOpen,
    }

    it("should toggle visibility of the comment menu when menu button is clicked", () => {

        render(<CommentMenu {...defaultProps} />)

        fireEvent.click(screen.getByRole("button", { name: "CommentMenuBtn" }))

        expect(setIsMenuOpenMock).toHaveBeenCalledWith(defaultProps.id)
    })

    it("should toggle visibility of the comment editor when edit button is clicked", () => {
        render(<CommentMenu {...defaultProps} />)

        fireEvent.click(screen.getByRole("button", { name: /editar/i }))

        expect(setIsEditOpen).toHaveBeenCalledWith(defaultProps.id)

    })

    it("should delete comment when delete button is clicked", async () => {
        render(<CommentMenu {...defaultProps} />)

        fireEvent.click(screen.getByRole("button", { name: /eliminar/i }))

        expect(deleteUserCommentMock).toHaveBeenCalledWith({ commentId: defaultProps.id, userId: defaultProps.userId })
        await deleteUserCommentMock()

        expect(toast.success).toHaveBeenCalledWith("Comentario eliminado")
    })

    it("should show error message when delete fails", async () => {

        deleteUserCommentMock.mockRejectedValueOnce(new Error("Error al eliminar"))
        
        render(<CommentMenu {...defaultProps} />)

        fireEvent.click(screen.getByRole("button", { name: /eliminar/i }))

        try {
            await deleteUserCommentMock();
        } catch (error: any) {
            expect(error.message).toBe("Error al eliminar");
        }

        expect(toast.error).toHaveBeenCalledWith("Error al eliminar el comentario")
    })

    // npm test "CommentMenu.test.tsx"
})