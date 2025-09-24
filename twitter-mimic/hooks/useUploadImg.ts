import { DragEventHandler, MouseEventHandler, useRef, useState } from "react";
import { uploadImage } from "../firebase/client";

export const DRAG_IMAGE_STATES = {
  ARRAYFULL: -2,
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
};

export default function useUploadImg() {
  const [drag, setDrag] = useState<number>(DRAG_IMAGE_STATES.NONE);
  const [imgURLs, setImgURLs] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);


  const handleDragEnter: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };

  const handleDragLeave: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };


  const handleDrop = async (e: any) => {
    if (imgURLs.length >= 5) return setDrag(DRAG_IMAGE_STATES.ARRAYFULL);
    const file = e.dataTransfer.files[0];
    setDrag(DRAG_IMAGE_STATES.UPLOADING);

    try {
      const url = await uploadImage(file, (progress) => setUploadProgress(progress));
      setImgURLs(prev => [...prev, url]);
      setDrag(DRAG_IMAGE_STATES.COMPLETE);
    } catch (err) {
      setDrag(DRAG_IMAGE_STATES.ERROR);
    } finally {
      setTimeout(() => setDrag(DRAG_IMAGE_STATES.NONE), 2000);
      setUploadProgress(0);
    }
  };


  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = async (e: any) => {
    e.preventDefault();
    if (imgURLs.length >= 5) return setDrag(DRAG_IMAGE_STATES.ARRAYFULL);

    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setDrag(DRAG_IMAGE_STATES.UPLOADING);

      try {
        const url = await uploadImage(file, (progress) => setUploadProgress(progress));
        setImgURLs((prev) => [...prev, url]);
        setDrag(DRAG_IMAGE_STATES.COMPLETE);
      } catch (err) {
        setDrag(DRAG_IMAGE_STATES.ERROR);
      } finally {
        setTimeout(() => setDrag(DRAG_IMAGE_STATES.NONE), 2000);
        setUploadProgress(0);
      }
    }
  };

  const handleOpenFileDialog: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    if (imgURLs.length >= 5) return setDrag(DRAG_IMAGE_STATES.ARRAYFULL);
    fileInputRef.current?.click();
  };

  return {
    drag,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    imgURLs,
    setImgURLs,
    uploadProgress,
    fileInputRef,
    handleFileChange,
    handleOpenFileDialog,
  };
}
