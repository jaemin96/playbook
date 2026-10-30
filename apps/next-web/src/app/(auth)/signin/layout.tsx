"use client";

import { LogBoundary } from "@repo/logger/react";

export default function SigninLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogBoundary name="sign-in" fallback={<p>로그인 에러가 발생했습니다.</p>}>
      <section className="flex flex-col">
        <span className="text-xl font-bold">로그인 페이지 레이아웃</span>
        {children}
      </section>
    </LogBoundary>
  );
}
