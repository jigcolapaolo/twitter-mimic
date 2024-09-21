import { userSignOut } from "../../../../firebase/client";
import useUser from "../../../../hooks/useUser";
import styles from "./signoutModal.module.css";

export default function SignoutModal({
  isModalOpen,
  setIsModalOpen,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const user = useUser();

  const handleSignOut = () => {
    if (!user) return;
    userSignOut();
  };

  return (
    <section
      className={`${styles.section} ${
        isModalOpen ? styles.opacityOpen : styles.opacityClosed
      }`}
    >
      <div className={styles.modalContent}>
        <p>¿Cerrar Sesión?</p>
        <div className={styles.divBtns}>
          <button onClick={handleSignOut}>Si</button>
          <button onClick={() => setIsModalOpen(!isModalOpen)}>No</button>
        </div>
      </div>
    </section>
  );
}
