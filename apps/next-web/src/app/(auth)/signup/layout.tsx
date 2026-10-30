"use client";

import { LogBoundary } from "@repo/logger/react";

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <LogBoundary name="sign-up" fallback={<p>회원가입 에러가 발생했습니다.</p>}>
      <section>
        <span>회원가입 페이지 레이아웃</span>
        {children}
      </section>
    </LogBoundary>
  );
}
