import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { User } from "@/lib/definitions";
import { fetchUsersByQuery } from "../firebase/client";
import { toast } from "sonner";

export const SEARCH_STATES = {
  LOADING: "loading",
  WAITING: "waiting",
};

export default function useSearchUsers({
  searchQuery,
}: {
  searchQuery: string;
}) {
  const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>(undefined);
  const [searchState, setSearchState] = useState(SEARCH_STATES.WAITING);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchQuery) {
        setSearchState(SEARCH_STATES.LOADING);
        fetchUsersByQuery(debouncedSearchQuery)
          .then((users) => {
            setFilteredUsers(users);
            setSearchState(SEARCH_STATES.WAITING);
          })
          .catch(() => {
            toast.error("Error al obtener los usuarios");
            setSearchState(SEARCH_STATES.WAITING);
          });
      } else {
        setFilteredUsers(undefined);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery]);

  return {
    filteredUsers,
    setFilteredUsers,
    searchState,
  };
}
