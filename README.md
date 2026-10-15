# Monorepo Template

pnpm workspace + Turborepo + Biome 기반 학습용 모노레포.
모든 작업은 **이슈 → 브랜치 → 커밋 → PR → 자동 머지** 흐름을 따릅니다.

## 매일 쓰는 것 (Claude Code)

| 명령 | 하는 일 |
|---|---|
| `/start <주제>` | 이슈 생성(템플릿·라벨·담당자) → `feat/12-slug` 브랜치 생성·연결·체크아웃. 머지된 이전 브랜치는 정리 |
| `/start #12` | 이미 있는 이슈로 시작 |
| `/start <내용> --bug` | 버그 이슈로 시작 (`fix/` 브랜치) |
| `/commit` | 변경 분석 → Conventional Commit 메시지 → 확인 후 커밋 (`Refs #12`) |
| `/commit -y` · `--review` | 확인 생략 · 커밋 전 코드리뷰 |
| `/pr` | push → PR 생성(`Closes #12`) → CI 통과 시 squash 자동 머지 |
| `/pr --review` · `--no-merge` · `--draft` | GitHub 에서 Claude 리뷰 요청 · 머지는 직접 · 초안 |

자동으로 일어나는 것: 커밋 시 Biome 자동 수정, 푸시 시 영향받는 패키지만 typecheck/test,
PR 에서 CI, 머지 후 이슈 close 와 원격 브랜치 삭제.

## 처음 한 번

GitHub 에 레포가 없는 상태에서 시작합니다. 순서가 중요해요 (`pnpm install` 이 hook 을 설치하려면 git 저장소가 먼저 있어야 함).

```bash
git init -b main                         # 1. 로컬 git 저장소
pnpm install                             # 2. 의존성 + lefthook hook 설치, pnpm-lock.yaml 생성
git add -A && git commit -m "chore: init monorepo"   # 3. 첫 커밋 (Biome hook 동작 확인)

gh auth login                            # 4. (PC 에서 처음 한 번만)
gh repo create <레포이름> --public --source . --remote origin --push
                                         # 5. GitHub 레포 생성 + origin 연결 + main push

pnpm setup:github                        # 6. 머지 옵션 + main 필수 체크(verify)
```

PR 리뷰를 쓰려면 Claude Code 에서 `/install-github-app` → **PR assistant 만** 선택.

> private 레포 + 무료 플랜이면 브랜치 규칙이 안 걸릴 수 있어요. 그땐 `/pr --no-merge` 로 PR 만 만들고 직접 머지.

## 앱/패키지 추가 규칙

- `apps/<이름>` 또는 `packages/<이름>`, 공통 버전은 `pnpm-workspace.yaml` 의 `catalog` 에서만 관리 (`"react": "catalog:"`)
- turbo 가 잡을 수 있게 스크립트 이름을 맞추기:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "typecheck": "tsc --noEmit",
  "test": "vitest run"
}
```

## 구성

| 파일 | 역할 |
|---|---|
| `lefthook.yml` | pre-commit: Biome / pre-push: typecheck·test |
| `.github/workflows/ci.yml` | PR·main: Biome + typecheck·test (affected) |
| `CLAUDE.md` | Claude 가 항상 아는 프로젝트 규칙 |
| `.claude/settings.json` | 자주 쓰는 git/gh/pnpm 명령 승인 생략, 위험 명령 차단 |
| `.claude/skills/{start,commit,pr}` | 위 슬래시 명령 |
| `scripts/setup-github.sh` | GitHub 1회 설정 |

## 비상구

```bash
LEFTHOOK=0 git commit ...    # hook 한 번 건너뛰기
lefthook uninstall           # hook 해제 (다시: pnpm lefthook install)
gh pr merge --disable-auto   # 걸린 auto-merge 취소
```

## 의존성 그래프

```bash
pnpm graph   # dot/final 에 turbo 그래프 생성
```
