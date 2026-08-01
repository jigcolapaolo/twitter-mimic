import type { Metadata, Viewport } from "next";
import "@/ui/styles/globals.css";
import { lusitana } from "@/ui/fonts";
import { Toaster } from "sonner";
import AuthInitializer from "@/ui/components/AuthInitializer";

export const metadata: Metadata = {
  title: "Twitter Mimic",
  description: "This is a copy of Twitter in Next.js",
  icons: {
    icon: "/TwitterMimicLogo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>
        <AuthInitializer />
        <div className="divApp">
          <main className="mainApp">{children}</main>
        </div>
        <Toaster theme="dark" position="top-center" richColors />
      </body>
    </html>
  );
}
