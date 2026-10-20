"use client";

import { LogBoundary } from "@repo/logger/react";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogBoundary name="blog" fallback={<p>블로그 에러가 발생했습니다.</p>}>
      <section>{children}</section>
    </LogBoundary>
  );
}
