import { MouseEventHandler } from "react";
import MenuIcon from "../icons/MenuIcon";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import styles from "../styles/home.module.css";

export default function TweetMenu({
  id,
  isMenuOpen,
  setIsMenuOpen,
}: {
  id: string;
  isMenuOpen: string | undefined;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {

  const handleMenuClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMenuOpen(isMenuOpen === id ? undefined : id);
  };

  return (
    <div className={styles.tweetMenuDiv}>
      <button onClick={handleMenuClick}>
        <MenuIcon />
      </button>

      <div
        className={`${
          isMenuOpen === id ? styles.opacityOpen : styles.opacityClosed
        }`}
      >
        <p>
          <EditIcon />
          Editar Tweet
        </p>
        <p>
          <DeleteIcon />
          Eliminar Tweet
        </p>
      </div>
    </div>
  );
}
