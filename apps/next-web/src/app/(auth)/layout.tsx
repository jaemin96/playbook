"use client";

import { LogBoundary } from "@repo/logger/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogBoundary name="auth" fallback={<p>인증 에러가 발생했습니다.</p>}>
      <section>
        <span>{"auth 공통 레이아웃"}</span>
        {children}
      </section>
    </LogBoundary>
  );
}
