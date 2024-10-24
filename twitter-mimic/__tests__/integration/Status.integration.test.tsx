import { render, screen } from "@testing-library/react";
import StatusPage from "@/app/status/page";

describe("StatusPage", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("should render correctly", () => {
        render(<StatusPage />);
    })
})