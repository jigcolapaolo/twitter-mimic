import { act, renderHook } from "@testing-library/react";
import useTimeAgo from "../../../hooks/useTimeAgo";

describe("useTimeAgo", () => {

    let originalIntl: any;

    beforeAll(() => {
        originalIntl = global.Intl;
    });

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock de Intl.RelativeTimeFormat
        const mockFormat = jest.fn((value: number, unit: string) => {
            const unitMap: any = {
                second: value === 1 ? "segundo" : "segundos",
                minute: value === 1 ? "minuto" : "minutos",
                hour: value === 1 ? "hora" : "horas",
                day: value === 1 ? "día" : "días",
                month: value === 1 ? "mes" : "meses",
                year: value === 1 ? "año" : "años",
            };

            return `hace ${value - (value * 2)} ${unitMap[unit]}`;
        });

        Object.defineProperty(global, 'Intl', {
            value: {
                RelativeTimeFormat: jest.fn().mockImplementation(() => ({
                    format: mockFormat,
                })),
            },
            configurable: true,
        });
    });

    afterAll(() => {
        global.Intl = originalIntl;
    });

    it("should return 'hace 0 segundos' if timestamp is null", () => {
        const { result } = renderHook(() => useTimeAgo(null));
        expect(result.current).toBe("hace 1 segundos");
    });

    it("should calculate time ago correctly for past timestamps", () => {
        const pastTimestamp = Date.now() - 300000; // 5 min
        const { result } = renderHook(() => useTimeAgo(pastTimestamp));

        expect(result.current).toMatch("hace 5 minutos");
    });

    it("should update the time every 5 seconds", () => {
        jest.useFakeTimers()

        const pastTimestamp = Date.now() - 300000; // 5 min
        const { result } = renderHook(() => useTimeAgo(pastTimestamp))

        expect(result.current).toMatch("hace 5 minutos")

        act(() => {
            jest.advanceTimersByTime(60000) // Avanzo 1 min
        })

        expect(result.current).toMatch("hace 6 minutos")
    })

    // npm test "useTimeAgo.test.ts"
})