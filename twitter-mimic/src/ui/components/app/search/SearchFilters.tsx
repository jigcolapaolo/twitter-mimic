import { Timeline, User } from "@/lib/definitions";
import styles from "@/ui/styles/search.module.css";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import useFilters, { TWEET_FILTER } from "../../../../../hooks/useFilters";
import SearchIcon from "@/ui/icons/SearchIcon";
import { fetchUsersByQuery } from "../../../../../firebase/client";
import { Avatar } from "../../Avatar";
import { useDebounce } from "../../../../../hooks/useDebounce";

interface SearchFiltersProps {
  timeline: Timeline[];
  onFilterChange: (filter: Timeline[]) => void;
  userId: string | undefined;
}

export default function SearchFilters({
  timeline,
  onFilterChange,
  userId,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { filter, setFilter, handleChangeFilter, filteredTweets } = useFilters({
    timeline,
    userId,
    selectedUser,
    setSelectedUser
  });


  useEffect(() => {
    onFilterChange(filteredTweets);
  }, [filteredTweets, onFilterChange]);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchQuery) {
        fetchUsersByQuery(debouncedSearchQuery)
          .then((users) => {
            setFilteredUsers(users);
          })
          .catch((error) => {
            throw new Error(error);
          });
      } else {
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFilteredUsers([]);
    setSearchQuery("");

    if (filter === TWEET_FILTER.MY_TWEETS) {
      setFilter(TWEET_FILTER.TOP);
    }

  };

  const filteredUsersMemorized = useMemo(() => filteredUsers, [filteredUsers]);



  return (
    <>
      <section className={styles.filterSection}>
        <div className={styles.searchDiv}>
          <div>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className={styles.filtersDiv}>
          <div className={styles.checkboxDiv}>
            <input
              type="radio"
              id="top"
              value={TWEET_FILTER.TOP}
              checked={filter === TWEET_FILTER.TOP}
              onChange={handleChangeFilter}
            />
            <label className={styles.label} htmlFor="top">
              Top
            </label>
          </div>
          <div className={styles.divisor}></div>

          <div className={styles.checkboxDiv}>
            <input
              type="radio"
              id="recent"
              value={TWEET_FILTER.RECENT}
              checked={filter === TWEET_FILTER.RECENT}
              onChange={handleChangeFilter}
            />
            <label className={styles.label} htmlFor="recent">
              Recientes
            </label>
          </div>
          <div className={styles.divisor}></div>
          <div className={styles.checkboxDiv}>
            <input
              type="radio"
              id="myTweets"
              value={TWEET_FILTER.MY_TWEETS}
              checked={filter === TWEET_FILTER.MY_TWEETS}
              onChange={handleChangeFilter}
            />
            <label className={styles.label} htmlFor="myTweets">
              Mis Tweets
            </label>
          </div>
        </div>
      </section>
      {filteredUsersMemorized.length > 0 && (
        <div className={styles.autocompleteList}>
          {filteredUsersMemorized.map((user) => (
            <div
              key={user.uid}
              className={styles.autocompleteItem}
              onClick={() => handleUserSelect(user)}
            >
              <Avatar src={user.avatar} alt={user.displayName} />
              {user.displayName}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
