import type { Metadata } from "next";
import { Footer, Header } from "@/components/layout";

export const metadata: Metadata = {
  title: "web",
  description: "playbook web app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
