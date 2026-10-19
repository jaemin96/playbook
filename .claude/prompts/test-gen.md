# 테스트 생성

다음 코드에 대한 테스트를 작성해주세요.

## 테스트 타입

- [ ] Happy path (정상 케이스)
- [ ] Error handling (에러 케이스)
- [ ] Edge cases (경계값)

## Frontend (Vitest + RTL)

```typescript
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("ComponentName", () => {
  it("renders correctly", () => {});
  it("handles user click", async () => {
    const user = userEvent.setup();
  });
  it("shows error state", () => {});
});
```

## Backend (Vitest)

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("ServiceName", () => {
  it("should create user successfully", async () => {});
  it("should throw error when email exists", async () => {});
});
```

## 원칙

- 명확한 테스트명
- Given-When-Then 패턴
- 독립적으로 실행 가능
- `vi.fn()` / `vi.spyOn()` 으로 모킹 (Jest의 `jest.fn()` 사용 금지)
