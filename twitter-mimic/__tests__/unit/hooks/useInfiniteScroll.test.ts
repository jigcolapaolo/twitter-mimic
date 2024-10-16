import { renderHook } from "@testing-library/react";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";

describe("useInfiniteScroll", () => {

    const handleLoadMoreMock = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()

    })

    it("should initialize ref correctly", () => {
        const { result } = renderHook(() => useInfiniteScroll({ handleLoadMore: handleLoadMoreMock }))

        expect(result.current.sectionRef).toBeDefined()
        expect(result.current.sectionRef.current).toBeNull()
    })

})