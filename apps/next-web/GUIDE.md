# Next.js 학습 가이드

## 학습 순서

### 1단계 — App Router 기초
- `app/layout.tsx` / `app/page.tsx` 구조 이해
- Server Component vs Client Component (`"use client"` 경계)
- `app/loading.tsx`, `app/error.tsx`, `app/not-found.tsx` 특수 파일
- 동적 라우팅: `app/posts/[id]/page.tsx`
- 중첩 레이아웃: `app/dashboard/layout.tsx`

### 2단계 — 데이터 패칭
- Server Component에서 직접 `fetch()` (no useEffect)
- `cache: 'force-cache'` / `revalidate` / `no-store` 옵션
- `generateStaticParams` — 정적 페이지 사전 생성
- Suspense + 스트리밍 렌더링

### 3단계 — 서버 액션
- `"use server"` 로 서버에서 실행되는 함수 정의
- 폼 제출 처리 (`<form action={serverAction}>`)
- `useActionState` / `useFormStatus` 훅
- Optimistic UI 패턴

### 4단계 — 클라이언트 상태 + API 연동
- TanStack Query로 클라이언트 사이드 캐싱
- Zustand 전역 상태 (Server Component와 경계 명확히)
- Route Handlers (`app/api/*/route.ts`)

### 5단계 — 폼 & 검증
- React Hook Form + Zod 조합
- Server Action에서 Zod 검증
- 에러 핸들링 패턴

### 6단계 — UI
- shadcn/ui 컴포넌트 추가 (`pnpm dlx shadcn@latest add button`)
- Tailwind CSS v4 (CSS-first 설정 방식)
- 다크모드 (`next-themes`)

### 7단계 — 성능 & 배포
- `next/image` 이미지 최적화
- `next/font` 폰트 최적화
- Metadata API (SEO)
- Vercel 배포 + 환경변수 설정

---

## 도입해볼 기술 목록

| 기술 | 용도 | 설치 |
|---|---|---|
| TanStack Query | 클라이언트 서버 상태 | `@tanstack/react-query` |
| Zustand | 전역 UI 상태 | `zustand` |
| React Hook Form | 폼 관리 | `react-hook-form` |
| Zod | 스키마 검증 | `zod` |
| shadcn/ui | UI 컴포넌트 | `pnpm dlx shadcn@latest init` |
| next-themes | 다크모드 | `next-themes` |
| Playwright | E2E 테스트 | `@playwright/test` |

---

## @repo/logger — Next.js에서 활용

### 제약사항 먼저

`@repo/logger`는 `console` + `import.meta.env`를 사용해서 **브라우저 전용**이에요.
Next.js Server Component에서는 직접 사용 불가 — Node.js 환경이라 `import.meta.env`가 없음.

### 사용 가능한 곳

| 환경 | 사용 가능 여부 |
|---|---|
| Client Component (`"use client"`) | ✅ 정상 동작 |
| Server Component | ❌ `import.meta` 없음 |
| Route Handler (`route.ts`) | ❌ Node.js 환경 |
| `"use server"` 액션 | ❌ Node.js 환경 |

### 사용 패턴

```tsx
// app/dashboard/page.tsx (Client Component)
"use client";

import { createLogger } from "@repo/logger";

const log = createLogger("dashboard");

export function Dashboard() {
  log.info("렌더링");
  // ...
}
```

### 네임스페이스 활용 예시

```tsx
// 페이지/기능별로 네임스페이스 분리
const log = createLogger("auth");      // [auth] 로그
const log = createLogger("dashboard"); // [dashboard] 로그
const log = createLogger("api");       // [api] 로그

// 브라우저 콘솔에서 필터링
// localStorage.setItem("debug", "auth,dashboard")
```

### 서버 로깅이 필요하면

Server Component / Route Handler에서는 `console.log` 직접 사용하거나
추후 `@repo/logger`에 Node.js 환경 지원을 추가하는 식으로 확장 가능.
