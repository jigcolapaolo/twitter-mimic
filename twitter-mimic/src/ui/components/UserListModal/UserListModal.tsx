import { User } from "@/lib/definitions";
import styles from "./userListModal.module.css";
import { Avatar } from "../Avatar";
import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";

interface UserListModalProps {
  users: User[];
  handleUserSelect: (user: User) => void;
}

export default function UserListModal({
  users,
  handleUserSelect,
  className = "",
  loadingUsers = false,
}: UserListModalProps & { className?: string; loadingUsers?: boolean }) {
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    if (users.length === 0) {
      setShowNoResults(true);

      const timer = setTimeout(() => {
        setShowNoResults(false);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setShowNoResults(false);
    }
  }, [users]);

  return (
    <>
      {loadingUsers ? (
        <section className={className !== "" ? className : styles.autocompleteList}>
          <div className={styles.autocompleteItem}>
            <SyncLoader size={5} color="#78b2f7" />
          </div>
        </section>
      ) : users.length > 0 ? (
        <section className={className !== "" ? className : styles.autocompleteList}>
          {users.map((user) => (
            <div
              key={user.uid}
              className={styles.autocompleteItem}
              onClick={() => handleUserSelect(user)}
            >
              <Avatar src={user.avatar} alt={user.displayName} />
              {user.displayName}
            </div>
          ))}
        </section>
      ) : (
        showNoResults && (
          <section className={className !== "" ? className : styles.autocompleteList}>
            <div className={styles.autocompleteItem}>No hay resultados</div>
          </section>
        )
      )}
    </>
  );
}
