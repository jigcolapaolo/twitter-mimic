import { useRouter } from "next/navigation";
import useUser, { USER_STATES } from "../../../hooks/useUser";
import { onAuthStateChanged } from "../../../firebase/client";
import { renderHook } from "@testing-library/react";

useRouter

jest.mock("next/navigation", () => ({
    useRouter: jest.fn(),
}))

jest.mock("../../../firebase/client", () => ({
    onAuthStateChanged: jest.fn((callback) => {
        callback(undefined);
        return jest.fn();
    }),
}));




describe("useUser", () => {
    jest.clearAllMocks()

    const mockPush = jest.fn()
    const userMock = {
        uid: "user1",
        email: "user@user.com",
        avatar: "avatar.png",
        displayName: "Usuario",
        likedTweets: [],
        sharedTweets: [],
        comments: [],
    }

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({
            push: mockPush,
        })

    })

    it("should initialize with USER_STATES.UNKNOWN", () => {
        const { result } = renderHook(() => useUser());

        expect(result.current).toBe(USER_STATES.NOT_KNOWN);
    })

    it("should subscribe and unsubscribe onAuthStateChanged", () => {
        const unsubscribeMock = jest.fn(); // Mock de la función de desuscripción

        // "onAuthStateChanged" devuelva el "unsubscribeMock"
        (onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
            callback(undefined); // Simula que no hay usuario
            return unsubscribeMock;
        });
    
        const { unmount } = renderHook(() => useUser());
    
        // Se verifica que "onAuthStateChanged" se haya llamado una vez
        expect(onAuthStateChanged).toHaveBeenCalled();
    
        // Se desmonta el hook para probar la desuscripción
        unmount();
    
        // Se verifica que se haya llamado a la función de desuscripción una vez
        expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    })

    it("should redirect to `/` if there is no user", () => {

        (onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
            callback(null)
            return jest.fn()
        })

        const { result } = renderHook(() => useUser())

        expect(result.current).toBe(USER_STATES.NOT_LOGGED)

        expect(mockPush).toHaveBeenCalledWith("/")
    })

    it("should return user object if user is logged", () => {
        (onAuthStateChanged as jest.Mock).mockImplementation((callback) => {
            callback(userMock)
            return jest.fn()
        })

        const { result } = renderHook(() => useUser())

        expect(result.current).toEqual(userMock)
    })
})