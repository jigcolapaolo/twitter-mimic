"use client"

import { useState } from "react";
import styles from "@/ui/styles/home.module.css";
import Link from "next/link";
import Image from "next/image";
import SignOutIcon from "@/ui/icons/SignOutIcon";
import FooterNav from "@/ui/components/FooterNav/FooterNav";
import SignoutModal from "@/ui/components/SignoutModal/SignoutModal";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <header className={styles.header}>
        <Link href={"/home"}>
          <Image
            priority
            placeholder="blur"
            blurDataURL="/TwitterMimicLogo.png"
            src="/TwitterMimicLogo.png"
            alt="Twitter Mimic Logo"
            width={40}
            height={40}
            className={styles.imageHover}
          />
        </Link>
        <SignOutIcon
          onClick={() => setIsModalOpen(!isModalOpen)}
          width={32}
          height={32}
          stroke="#0099ff"
          fill="white"
        />
      </header>
      {children}
      <FooterNav />
      <SignoutModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}
