# Project

Personal learning monorepo. Every piece of work starts from a GitHub issue and lands on main through a PR.

## Communication
- Talk to the user in Korean. Be brief.
- Commit messages and PR titles: Conventional Commits, Korean subject is fine (follow recent history).

## Stack
- pnpm 10 workspace + Turborepo. Apps in `apps/*`, shared code in `packages/*`.
- Shared dependency versions live only in the `catalog:` of `pnpm-workspace.yaml`. In app/package `package.json`, use `"react": "catalog:"`. Add new shared deps to the catalog first.
- Biome is the only linter/formatter (no ESLint/Prettier).
- Each app/package that has types or tests exposes `typecheck` (`tsc --noEmit`) and `test` (`vitest run`, never watch mode) scripts so turbo can pick them up.

## Workflow
- `/start <topic>`: create issue + branch. `/commit`: commit. `/pr`: push + PR + auto-merge.
- Branch names start with the issue number: `feat/12-xxx`, `fix/12-xxx`.
- Git hooks (lefthook) enforce Biome on commit and typecheck/test on push. Never bypass them (`--no-verify`, `LEFTHOOK=0`).
- Never push to main directly, never force-push.

## Token economy
- Prefer `git diff --stat` before full diffs. Skip `pnpm-lock.yaml`, `dist/`, `.turbo/`, `dot/raw`, `dot/final`.
- Run turbo with `--output-logs=errors-only`.
