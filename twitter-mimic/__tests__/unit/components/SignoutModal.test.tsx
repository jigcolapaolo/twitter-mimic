import SignoutModal from "@/ui/components/SignoutModal/SignoutModal";
import useUser from "../../../hooks/useUser";
import { fireEvent, render, screen } from "@testing-library/react";
import { userSignOut } from "../../../firebase/client";

jest.mock("../../../hooks/useUser")
jest.mock("../../../firebase/client", () => ({
    userSignOut: jest.fn()
}))

describe("SignoutModal", () => {
    const setIsModalOpenMock = jest.fn()

    beforeEach(() => {
        (useUser as jest.Mock).mockReturnValue({
            uid: "123"
        })
        jest.clearAllMocks()
    })

    it("should be seen when opened", () => {
        render(<SignoutModal isModalOpen={true} setIsModalOpen={setIsModalOpenMock} />)

        expect(screen.getByLabelText("SignoutModal")).toHaveClass("opacityOpen")
    })

    it("should sign out when clicked on yes button", () => {
        render(<SignoutModal isModalOpen={true} setIsModalOpen={setIsModalOpenMock} />)

        fireEvent.click(screen.getByRole("button", { name: /si/i }))

        expect(userSignOut).toHaveBeenCalledTimes(1)
    })

    it("should not be seen when clicked on no button", () => {
        render(<SignoutModal isModalOpen={true} setIsModalOpen={setIsModalOpenMock} />)

        fireEvent.click(screen.getByRole("button", { name: /no/i }))
        expect(setIsModalOpenMock).toHaveBeenCalledWith(false)

        render(<SignoutModal isModalOpen={false} setIsModalOpen={setIsModalOpenMock} />);
    })
})