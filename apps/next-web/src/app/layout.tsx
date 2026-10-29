import type { Metadata } from "next";
import { Footer, Header } from "@/components/layout";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "web",
  description: "playbook web app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  console.log("Server component");

  return (
    <html lang="ko">
      <body>
        <Header />
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
