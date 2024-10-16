import { act, renderHook } from "@testing-library/react";
import { useDebounce } from "../../../hooks/useDebounce";


describe("useDebounce", () => {
    it("should initialize state correctly", () => {
        const { result } = renderHook(() => useDebounce("john", 500))

        expect(result.current).toEqual("john")
    })

    it("should update debounced value after the delay", () => {
        jest.useFakeTimers()

        const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
          initialProps: { value: "initial" },
        });
    
        // Cambiar el valor
        rerender({ value: "updated" });
    
        // El valor debounced aún debe ser el anterior hasta que pase el delay
        expect(result.current).toBe("initial");
    
        act(() => {
          jest.advanceTimersByTime(500);
        });
    
        expect(result.current).toBe("updated");
      });
})