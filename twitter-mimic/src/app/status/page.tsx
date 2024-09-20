"use client";

import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";

export default function StatusPage() {
  const { replace } = useRouter();

  replace(`/home`);

  return (
    <>
      <section className="flex justify-center items-center w-full h-full">
        <SyncLoader color="#78b2f7" />
      </section>
    </>
  );
}
