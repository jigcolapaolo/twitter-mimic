/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { renderHook, waitFor } from "@testing-library/react";
import useSearchUsers, { SEARCH_STATES } from "../../../hooks/useSearchUsers";
import { toast } from "sonner";
import { fetchUsersByQuery } from "../../../firebase/client";

jest.mock("../../../firebase/client",() => ({
    fetchUsersByQuery: jest.fn()
}))

jest.mock("sonner", () => ({
    toast: {
        error: jest.fn()
    }
}))

describe("useSearchUsers", () => {

    beforeEach(() => {
        jest.clearAllMocks()


    })

    it("should initialize states correctly", () => {
        const { result } = renderHook(() => useSearchUsers({ searchQuery: "" }))

        expect(result.current.filteredUsers).toBeUndefined()
        expect(result.current.searchState).toEqual(SEARCH_STATES.WAITING)
    })

    it("should set loading state and fetch users when searchQuery changes", async () => {
        const mockUsers = [{ uid: "user1", displayName: "John" }, { uid: "user2", displayName: "Matt" }];
        
        (fetchUsersByQuery as jest.Mock).mockResolvedValue(mockUsers)
        
        const { result } = renderHook(() => useSearchUsers({ searchQuery: "John" }));
        

        expect(result.current.searchState).toEqual(SEARCH_STATES.LOADING)

        await waitFor(() => {
            expect(fetchUsersByQuery).toHaveBeenCalledWith("John")
            expect(result.current.searchState).toEqual(SEARCH_STATES.WAITING)
        })
    })

    it("should show error message if fetchUsersByQuery fails", async () => {
        (fetchUsersByQuery as jest.Mock).mockRejectedValueOnce(new Error("Error al obtener usuarios"))

        renderHook(() => useSearchUsers({ searchQuery: "Matt" }))

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error al obtener los usuarios")
        })
    })
})