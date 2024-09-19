import { User } from "@/lib/definitions";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "../firebase/client";
import { useRouter } from "next/navigation";

export const USER_STATES = {
  NOT_LOGGED: null,
  NOT_KNOWN: undefined,
};

export default function useUser() {
  const [user, setUser] = useState<User | null | undefined>(
    USER_STATES.NOT_KNOWN
  );
  const { push } = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(setUser);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    user === USER_STATES.NOT_LOGGED && push("/");
  }, [user, push]);

  return user;
}
