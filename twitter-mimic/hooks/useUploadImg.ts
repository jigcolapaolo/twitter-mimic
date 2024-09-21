import { getDownloadURL, UploadTask } from "firebase/storage";
import { DragEventHandler, useEffect, useState } from "react";
import { uploadImage } from "../firebase/client";

export const DRAG_IMAGE_STATES = {
  ERROR: -1,
  NONE: 0,
  DRAG_OVER: 1,
  UPLOADING: 2,
  COMPLETE: 3,
};

export default function useUploadImg() {
  const [drag, setDrag] = useState<number>(DRAG_IMAGE_STATES.NONE);
  const [task, setTask] = useState<UploadTask | null>(null);
  const [imgURL, setImgURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  useEffect(() => {
    if (task) {
      const onProgress = (snapshot: any) => {
        setDrag(DRAG_IMAGE_STATES.UPLOADING);
        setUploadProgress(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
      };
      const onError = () => {
        setDrag(DRAG_IMAGE_STATES.ERROR);
      };
      const onComplete = () => {
        // Obtengo la url de la imagen cargada para mostrarla
        getDownloadURL(task.snapshot.ref).then((url) => {
          setImgURL(url);
        });

        setDrag(DRAG_IMAGE_STATES.COMPLETE);

        setTimeout(() => {
          setDrag(DRAG_IMAGE_STATES.NONE);

          setTask(null);
          setUploadProgress(0);
        }, 2000);
      };

      const unsubscribe = task.on("state_changed", onProgress, onError, onComplete);

      return () => {
        unsubscribe();
      };
    }
  }, [task]);

  const handleDragEnter: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.DRAG_OVER);
  };

  const handleDragLeave: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    setDrag(DRAG_IMAGE_STATES.NONE);
  };

  const handleDrop: DragEventHandler<HTMLTextAreaElement> = (e) => {
    e.preventDefault();
    // console.log(e.dataTransfer.files[0])
    setDrag(DRAG_IMAGE_STATES.NONE);
    const file = e.dataTransfer.files[0];
    const task = uploadImage(file);
    setTask(task);
  };

  return {
    drag,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    imgURL,
    setImgURL,
    uploadProgress,
  };
}
