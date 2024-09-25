import { Timeline } from "@/lib/definitions";
import styles from "@/ui/styles/search.module.css";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

const TWEET_FILTER = {
  TOP: "top",
  RECENT: "recent",
  MY_TWEETS: "myTweets",
};

export default function SearchFilters({
  timeline,
  onFilterChange,
  userId,
}: {
  timeline: Timeline[];
  onFilterChange: (filter: Timeline[]) => void;
  userId: string | undefined;
}) {
  const [filter, setFilter] = useState(TWEET_FILTER.TOP);

  const handleChangeFilter = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilter(value);
  };

  const filteredTweets = useMemo(() => {
    switch (filter) {
      case TWEET_FILTER.TOP:
        return [...timeline].sort((a, b) => b.likesCount - a.likesCount);
      case TWEET_FILTER.RECENT:
        return [...timeline].sort((a, b) => b.createdAt - a.createdAt);
      case TWEET_FILTER.MY_TWEETS:
        return timeline.filter((tweet) => tweet.userId === userId);
      default:
        return timeline;
    }
  }, [filter, timeline, userId]);

  useEffect(() => {
    onFilterChange(filteredTweets);
  }, [filteredTweets, onFilterChange]);

  return (
    <div className={styles.filterSection}>
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
  );
}
