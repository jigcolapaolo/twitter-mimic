import { act, renderHook } from "@testing-library/react";
import useTextChange, { MAX_CHARS, TEXT_STATES } from "../../../hooks/useTextChange";

describe("useTextChange", () => {

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should initialize states correctly", () => {
        const { result } = renderHook(() => useTextChange())

        expect(result.current.message).toEqual(undefined)
        expect(result.current.status).toBe(TEXT_STATES.NONE)
        expect(result.current.isButtonDisabled).toBe(true)
    })

    it("should update message on handleChange", () => {
        const { result } = renderHook(() => useTextChange())

        act(() => {
            result.current.handleChange({ target: { value: "Nuevo mensaje" } } as any)
        })

        expect(result.current.message).toEqual("Nuevo mensaje")
    })

    it("should not update message when MAX_CHARS are exceeded", () => {
        const { result } = renderHook(() => useTextChange())

        act(() => {
            result.current.handleChange({ target: { value: "a".repeat(MAX_CHARS + 1) } } as any)
        })

        expect(result.current.message).toBeUndefined()
    })

    it("should disable button when status is loading", () => {
        const { result } = renderHook(() => useTextChange())

        act(() => {
            result.current.handleChange({ target: { value: "Loading" } } as any)
            result.current.setStatus(TEXT_STATES.LOADING)
        })

        expect(result.current.isButtonDisabled).toBe(true)
    })
})