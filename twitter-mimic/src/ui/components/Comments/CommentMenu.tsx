import MenuIcon from "@/ui/icons/MenuIcon";
import { MouseEventHandler } from "react";
import { toast } from "sonner";
import styles from "./commentMenu.module.css"
import EditIcon from "@/ui/icons/EditIcon";
import DeleteIcon from "@/ui/icons/DeleteIcon";


export default function CommentMenu({
    id,
    userId,
    isMenuOpen,
    setIsMenuOpen,
    deleteUserComment,
  }: {
    id: string;
    userId: string | undefined;
    isMenuOpen: string | undefined;
    setIsMenuOpen: React.Dispatch<React.SetStateAction<string | undefined>>;
    deleteUserComment: ({ commentId, userId }: { commentId: string; userId: string }) => Promise<void>;
  }) {


    const handleMenuClick: MouseEventHandler<HTMLButtonElement> = (e) => {
      e.preventDefault();
      e.stopPropagation();
  
      setIsMenuOpen(isMenuOpen === id ? undefined : id);
    };
  
    const handleDeleteComment = async () => {
        if (!userId) return;
    
        try {
          await deleteUserComment({ commentId:id, userId });
          toast.success("Comentario eliminado");
        } catch (error) {
          toast.error("Error al eliminar el comentario");
        }
      }
  
    // const handleEditClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    //   e.preventDefault();
    //   e.stopPropagation();
    //   router.push(`/status/edit/${id}`);
  
    // }

    return (
    <div className={styles.commentMenuDiv}>
      <button onClick={handleMenuClick}>
        <MenuIcon />
      </button>

      <div
        className={`${
          isMenuOpen === id ? styles.opacityOpen : styles.opacityClosed
        }`}
      >
        <button>
          <EditIcon />
          Editar
        </button>
        <button onClick={handleDeleteComment}>
          <DeleteIcon />
          Eliminar
        </button>
      </div>
    </div>
    )
}