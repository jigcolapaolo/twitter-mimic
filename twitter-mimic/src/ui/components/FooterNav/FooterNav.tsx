import CreateIcon from "@/ui/icons/Create";
import HomeIcon from "@/ui/icons/Home";
import SearchIcon from "@/ui/icons/SearchIcon";
import Link from "next/link";
import styles from "@/ui/styles/home.module.css"
import { usePathname } from "next/navigation";

export default function FooterNav() {
    const pathname = usePathname();


  return (
    <nav className={styles.nav}>
      <Link href="/home" className={ pathname === "/home" ? styles.selectedNav : ""} aria-label="HomeLink">
        <HomeIcon width={32} height={32} stroke="#09f" />
      </Link>
      <Link href="/search" className={ pathname === "/search" ? styles.selectedNav : ""} aria-label="SearchLink">
        <SearchIcon width={32} height={32} stroke="#09f" />
      </Link>
      <Link href="/compose/tweet" aria-label="ComposeLink">
        <CreateIcon width={32} height={32} stroke="#09f" />
      </Link>
    </nav>
  );
}
