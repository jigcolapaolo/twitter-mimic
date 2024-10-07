import { MouseEventHandler } from "react";
import MenuIcon from "../icons/MenuIcon";
import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import styles from "../styles/home.module.css";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function TweetMenu({
  id,
  isMenuOpen,
  setIsMenuOpen,
}: {
  id: string;
  isMenuOpen: string | undefined;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
}) {
  const router = useRouter();
  
  const handleMenuClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsMenuOpen(isMenuOpen === id ? undefined : id);
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    fetch(`/api/tweets/delete/${id}`, {
      method: "DELETE",
    }).then((response) => {
      if (response.ok) {
        toast.success("Tweet eliminado exitosamente");
        setIsMenuOpen(undefined);
        router.push("/home");
      } else {
        toast.error("Error al eliminar el tweet");
      }
    });
  };

  const handleEditClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/status/edit/${id}`);

  }

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
        <button onClick={handleEditClick}>
          <EditIcon />
          Editar Tweet
        </button>
        <button onClick={handleDeleteClick}>
          <DeleteIcon />
          Eliminar Tweet
        </button>
      </div>
    </div>
  );
}
