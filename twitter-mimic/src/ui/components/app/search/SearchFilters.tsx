"use client";

import { User } from "@/lib/definitions";
import styles from "@/ui/styles/search.module.css";
import { ChangeEvent, useState } from "react";
import SearchIcon from "@/ui/icons/SearchIcon";
import UserListModal from "../../UserListModal/UserListModal";
import useSearchUsers, {
  SEARCH_STATES,
} from "../../../../../hooks/useSearchUsers";
import { SyncLoader } from "react-spinners";
import { FilterState } from "@/app/search/page";

export const TWEET_FILTER = {
  TOP: "top",
  RECENT: "recent",
  MY_TWEETS: "myTweets",
};

interface SearchFiltersProps {
  userId: string | undefined;
  filterState: FilterState;
  onFilterChange: (newFilter: string, newFilterUserId?: string) => void;
}

export default function SearchFilters({
  userId,
  filterState,
  onFilterChange,
}: SearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { filteredUsers, setFilteredUsers, searchState } = useSearchUsers({
    searchQuery,
  });

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    const newFilterUserId =
      value === TWEET_FILTER.MY_TWEETS
        ? userId
        : selectedUser
        ? selectedUser.uid
        : undefined;
    onFilterChange(value, newFilterUserId);
    if (value === TWEET_FILTER.MY_TWEETS) {
      setSelectedUser(null);
    }
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setFilteredUsers(undefined);

    onFilterChange(TWEET_FILTER.TOP, user.uid);
  };

  const handleUserRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setSelectedUser(null);
    setFilteredUsers(undefined);
    onFilterChange(TWEET_FILTER.TOP, undefined);
  };

  return (
    <>
      <section className={styles.filterSection} data-testid="search-filters">
        <div className={styles.searchDiv}>
          <div>
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder={"Buscar usuarios..."}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          {searchState === SEARCH_STATES.LOADING && (
            <SyncLoader size={5} color="#78b2f7" />
          )}
          {selectedUser && (
            <button onClick={handleUserRemove} className={styles.userRemoveBtn}>
              {selectedUser.displayName}
            </button>
          )}
          {searchQuery !== "" && (
            <button
              onClick={() => setSearchQuery("")}
              className={styles.cleanQueryBtn}
            >
              X
            </button>
          )}
        </div>
        <div className={styles.filtersDiv}>
          <div className={styles.checkboxDiv}>
            <input
              type="radio"
              id="top"
              value={TWEET_FILTER.TOP}
              checked={filterState.filter === TWEET_FILTER.TOP}
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
              checked={filterState.filter === TWEET_FILTER.RECENT}
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
              checked={filterState.filter === TWEET_FILTER.MY_TWEETS}
              onChange={handleChangeFilter}
            />
            <label className={styles.label} htmlFor="myTweets">
              Mis Tweets
            </label>
          </div>
        </div>
      </section>
      <UserListModal
        className={styles.searchUserListModal}
        users={filteredUsers || undefined}
        handleUserSelect={handleUserSelect}
      />
    </>
  );
}
