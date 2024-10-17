import SearchFilters from "@/ui/components/app/search/SearchFilters";
import { fireEvent, render, screen } from "@testing-library/react";
import { TWEET_FILTER } from "@/ui/components/app/search/SearchFilters";

describe("SearchFilters component", () => {

    const onFilterChangeMock = jest.fn()

    const defaultProps = {
        userId: "user1",
        filterState: {
            filter: undefined,
            filterUserId: undefined,
        },
        onFilterChange: onFilterChangeMock,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it("should render initial component correctly", () => {
        render(<SearchFilters  {...defaultProps}/>)

        expect(screen.getByPlaceholderText("Buscar usuarios...")).toBeInTheDocument()
        expect(screen.getByRole("radio", { name: /top/i })).toBeInTheDocument()
        expect(screen.getByRole("radio", { name: /recientes/i })).toBeInTheDocument()
        expect(screen.getByRole("radio", { name: /mis tweets/i })).toBeInTheDocument()
    })

    it("should change the filter when a new radio input is selected", () => {
        render(<SearchFilters {...defaultProps} />)

        fireEvent.click(screen.getByRole("radio", { name: /recientes/i }))

        expect(onFilterChangeMock).toHaveBeenCalledWith(TWEET_FILTER.RECENT, undefined)
    })
    
    it("should update searchQuery state when input changes", () => {
        render(<SearchFilters {...defaultProps} />)

        const inputChange = screen.getByPlaceholderText("Buscar usuarios...")

        fireEvent.change(inputChange, { target: { value: "Juan" } })

        expect(inputChange).toHaveValue("Juan")
    })
})