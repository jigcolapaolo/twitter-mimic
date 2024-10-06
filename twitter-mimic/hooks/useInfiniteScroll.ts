import { useEffect, useRef } from "react";

export default function useInfiniteScroll({ handleLoadMore }: any) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {

    if(!sectionRef) return;
    const handleScroll = () => {
      const section = sectionRef.current;
      if (section && section.scrollHeight - section.scrollTop === section.clientHeight) {
        handleLoadMore()
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (section) {
        section.removeEventListener('scroll', handleScroll);
      }
    };
  }, [sectionRef, handleLoadMore]);

  return {
    sectionRef,
  };
}