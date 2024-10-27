import { useEffect, useRef } from "react";

interface UseInfiniteScrollProps {
  handleLoadMore: () => void;
}

export default function useInfiniteScroll({ handleLoadMore }: UseInfiniteScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const sectionElement = sectionRef.current;

    if (!sectionElement) return;

    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = sectionElement!;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        handleLoadMore();
      }
    };

    sectionRef.current.addEventListener('scroll', handleScroll);

    return () => {
      sectionElement?.removeEventListener('scroll', handleScroll);
    };
  }, [handleLoadMore]);

  return { sectionRef };
}
