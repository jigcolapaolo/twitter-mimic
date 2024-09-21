import { ClipLoader } from "react-spinners";
import { DRAG_IMAGE_STATES } from "../../../../../hooks/useUploadImg";
import styles from "./imgLoadingMsg.module.css";

export default function ImgLoadingMsg({
  drag,
  uploadProgress,
}: {
  drag: number;
  uploadProgress: number;
}) {
  return (
    <section className={styles.section}>
      {drag === DRAG_IMAGE_STATES.UPLOADING ? (
        <div className="flex items-center">
          <ClipLoader color="#78b2f7" size={20} />
          <span className="ml-2">{uploadProgress}%</span>
        </div>
      ) : null}
      {drag === DRAG_IMAGE_STATES.ERROR &&
        "La imagen no pudo subirse, por favor intenta de nuevo"}
      {drag === DRAG_IMAGE_STATES.COMPLETE && "Imagen subida ✅"}
    </section>
  );
}
