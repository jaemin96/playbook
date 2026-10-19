# playbook

pnpm workspace + Turborepo + Biome 기반 모노레포 학습/실험 공간.

## 워크플로우

```
/start <주제>   이슈 + 브랜치
/commit         Conventional Commit
/pr             push + PR + auto-merge
```

커밋 시 Biome 체크, 푸시 시 typecheck/test 자동 실행.

## 패키지

| 패키지 | 설명 |
|---|---|
| `@repo/logger` | 네임스페이스 기반 브라우저 로거 |
| `@repo/biome-config` | 공통 Biome 설정 (`biome.base.json`) |
| `@repo/tsconfig` | 공통 TS 설정 (base / library / app / node) |

## 앱/패키지 추가 시

- 공통 버전은 `pnpm-workspace.yaml` catalog에서만 관리
- turbo가 잡으려면 스크립트명 통일: `dev` / `build` / `typecheck` / `test`
- tsconfig는 `@repo/tsconfig/<preset>`으로 extends
- 새 공통 dep은 catalog에 먼저 추가 후 `"react": "catalog:"` 형태로 사용

## 초기 세팅 (새 레포 클론 후)

```bash
pnpm install
gh auth login          # 처음 한 번만
pnpm setup:github      # 머지 옵션 + branch protection
```
