import ImgLoadingMsg from "@/ui/components/composeTweet/ImgLoadingMsg/ImgLoadingMsg";
import { DRAG_IMAGE_STATES } from "../../../hooks/useUploadImg";
import { render, screen } from "@testing-library/react";

jest.mock("react-spinners", () => ({
    ClipLoader: jest.fn(() => <div>Loading...</div>)
}))

describe("ImgLoadingMsg component", () => {
    it("should show loading message when img is being uploaded", () => {
        render(<ImgLoadingMsg drag={DRAG_IMAGE_STATES.UPLOADING} uploadProgress={0} />)

        expect(screen.getByText("Loading...")).toBeInTheDocument()
    })

    it("should show error message when drag is ERROR", () => {
        render(<ImgLoadingMsg drag={DRAG_IMAGE_STATES.ERROR} uploadProgress={0} />);

        expect(screen.getByText("La imagen no pudo subirse, por favor intenta de nuevo")).toBeInTheDocument();
    });

    it("should show success message when drag is COMPLETE", () => {
        render(<ImgLoadingMsg drag={DRAG_IMAGE_STATES.COMPLETE} uploadProgress={100} />);

        expect(screen.getByText("Imagen subida ✅")).toBeInTheDocument();
    });

    it("should show array full message when drag is ARRAYFULL", () => {
        render(<ImgLoadingMsg drag={DRAG_IMAGE_STATES.ARRAYFULL} uploadProgress={0} />);

        expect(screen.getByText("Ya no puedes subir mas imagenes (5 max.)")).toBeInTheDocument();
    });

})