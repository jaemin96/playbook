"use client";

import { LogBoundary } from "@repo/logger/react";
import { Aside } from "@/components/layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogBoundary name="dashboard" fallback={<p>대시보드 에러가 발생했습니다.</p>}>
      <section>
        <Aside />
        {children}
      </section>
    </LogBoundary>
  );
}
