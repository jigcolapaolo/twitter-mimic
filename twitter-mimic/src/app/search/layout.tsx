import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Buscar Tweets / Twitter Mimic",
    description: "Explora los tweets en Twitter Mimic.",
    icons: {
        icon: "/TwitterMimicLogo.png",
    },
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
