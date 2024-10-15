import { renderHook } from "@testing-library/react";
import useUploadImg from "../../../hooks/useUploadImg";

describe("useUploadImg", () => {
    it("should", () => {
        const { result } = renderHook(() => 
            useUploadImg()
        )
    })
})