import { User } from "@/lib/definitions";
import UserListModal from "@/ui/components/UserListModal/UserListModal";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("react-spinners", () => ({
    SyncLoader: jest.fn(() => <div>Loading...</div>)
}))


describe("UserListModal component", () => {

    const handleUserSelectMock = jest.fn()

    const defaultProps = {
        users: [{ uid: "user", avatar: "avatar.png", displayName: "Juan" }] as User[],
        handleUserSelect: handleUserSelectMock,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should initialize correctly with users", () => {
        render(<UserListModal {...defaultProps} />)

        expect(screen.getByText(defaultProps.users[0].displayName)).toBeInTheDocument()
    })

    it("should show no results message if users array is empty", () => {

        const noUsersProps = {...defaultProps, users: []}

        render(<UserListModal {...noUsersProps} />)

        expect(screen.getByText("No hay resultados")).toBeInTheDocument()
    })

    it("should show loader if loadingUsers is true", () => {
        const loadingProps = { ...defaultProps, loadingUsers: true }
        render(<UserListModal {...loadingProps} />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("should call handleUserSelect when clicking on an user", () => {
        render(<UserListModal {...defaultProps} />)

        fireEvent.click(screen.getByText(defaultProps.users[0].displayName))

        expect(handleUserSelectMock).toHaveBeenCalledWith(defaultProps.users[0])
    })

})