import { User } from "@/lib/definitions";
import styles from "./userListModal.module.css";
import { Avatar } from "../Avatar";
import { SyncLoader } from "react-spinners";

interface UserListModalProps {
  users: User[] | undefined;
  handleUserSelect: (user: User) => void;
}

export default function UserListModal({
  users,
  handleUserSelect,
  className = "",
  loadingUsers = false,
}: UserListModalProps & { className?: string; loadingUsers?: boolean }) {

  return (
    <>
      {loadingUsers ? (
        <section className={className !== "" ? className : styles.autocompleteList}>
          <div className={styles.autocompleteItem}>
            <SyncLoader size={5} color="#78b2f7" />
          </div>
        </section>
      ) : users && users.length > 0 ? (
        <section className={className !== "" ? className : styles.autocompleteList}>
          {users.map((user) => (
            <figure
              key={user.uid}
              className={styles.autocompleteItem}
              onClick={() => handleUserSelect(user)}
            >
              <Avatar src={user.avatar} alt={user.displayName} />
              {user.displayName}
            </figure>
          ))}
        </section>
      ) : users && users.length === 0 ? (
        <section className={className !== "" ? className : styles.autocompleteList}>
          <div className={styles.autocompleteItem}>No hay resultados</div>
        </section>
      ) : null }
    </>
  );
  
}
