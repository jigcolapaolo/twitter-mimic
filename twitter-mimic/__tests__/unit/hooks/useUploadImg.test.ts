/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { act, renderHook, waitFor } from "@testing-library/react";
import useUploadImg from "../../../hooks/useUploadImg";
import { DRAG_IMAGE_STATES } from "../../../hooks/useUploadImg";
import { uploadImage } from "../../../firebase/client";
import { getDownloadURL } from "firebase/storage";

jest.mock("../../../firebase/client", () => ({
  uploadImage: jest.fn(),
}));
jest.mock("firebase/storage", () => ({
  getDownloadURL: jest.fn().mockResolvedValue("https://mockurl.com/image.jpg"),
}));
jest.mock("../../../firebase/client", () => ({
  uploadImage: jest.fn().mockResolvedValue({
    // Asegúrate de que aquí tienes el método on
    on: jest.fn((event, onProgress, onError, onComplete) => {
      // Simular el progreso de carga
      setTimeout(() => {
        onProgress({ bytesTransferred: 100, totalBytes: 100 }); // Simula progreso completo
        onComplete(); // Simula que la carga se completa
      }, 100); // Tiempo de simulación
    }),
    snapshot: {
      ref: {
        // Mockea la referencia necesaria para getDownloadURL
      },
    },
  }),
}));

describe("useUploadImg", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should initialize states correctly", () => {
    const { result } = renderHook(() => useUploadImg());

    expect(result.current.drag).toBe(DRAG_IMAGE_STATES.NONE);
    expect(result.current.imgURLs).toEqual([]);
    expect(result.current.uploadProgress).toBe(0);
  });

  it("should handle drag enter event", () => {
    const { result } = renderHook(() => useUploadImg());

    act(() => {
      result.current.handleDragEnter({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.drag).toBe(DRAG_IMAGE_STATES.DRAG_OVER);
  });

  it("should handle drag leave event", () => {
    const { result } = renderHook(() => useUploadImg());

    act(() => {
      result.current.handleDragLeave({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.drag).toBe(DRAG_IMAGE_STATES.NONE);
  });

  it("should handle image upload correctly", async () => {
    const mockFile = new File(["content"], "test.jpg", { type: "image/jpeg" });

    const mockEvent = {
      dataTransfer: {
        files: [mockFile],
      },
    };

    // Mock de uploadImage
    const mockTask = {
      on: jest.fn((event, onProgress, onError, onComplete) => {
        // Carga
        onProgress({ bytesTransferred: 100, totalBytes: 100 }); // Progreso completo
        onComplete(); // Carga completa

        return jest.fn(); // Retornar un mock de unsubscribe
      }),
      snapshot: {
        ref: {}, // Referencia necesaria para getDownloadURL
      },
    };

    (uploadImage as jest.Mock).mockReturnValue(mockTask);

    const { result } = renderHook(() => useUploadImg());

    act(() => {
      result.current.handleDrop(mockEvent);
    });

    expect(uploadImage).toHaveBeenCalledWith(mockFile);

    // Se llama a getDownloadURL y se actualizan los estados
    await waitFor(() => {
      expect(getDownloadURL).toHaveBeenCalled();
      expect(result.current.imgURLs).toHaveLength(1);
      expect(result.current.drag).toBe(DRAG_IMAGE_STATES.COMPLETE);
      expect(result.current.uploadProgress).toBe(100);
    });
  });

  it("should handle upload errors correctly", () => {
    const mockFile = new File([], "test.png");
    const mockEvent = {
      dataTransfer: {
        files: [mockFile],
      },
    };

    // Mock de la tarea con error simulado
    const mockTask = {
      on: jest.fn((eventType, onProgress, onError) => {
        if (eventType === "state_changed") {
          onError();
        }
        return jest.fn(); // Retornar un mock de unsubscribe
      }),
      snapshot: {
        ref: {},
      },
    };

    (uploadImage as jest.Mock).mockReturnValue(mockTask);

    const { result } = renderHook(() => useUploadImg());

    act(() => {
      result.current.handleDrop(mockEvent);
    });

    expect(result.current.drag).toBe(DRAG_IMAGE_STATES.ERROR);
  });
});
