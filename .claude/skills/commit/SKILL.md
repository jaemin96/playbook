---
name: commit
description: Write a Conventional Commit for current changes and commit. Use when the user runs /commit or asks to commit.
argument-hint: "[-y] [--review] [#issue]"
allowed-tools: Bash(git:*), Bash(pnpm:*), Read, Grep, Glob, Edit
---

## Context
- Branch: !`git branch --show-current`
- Status: !`git status --porcelain`
- Staged: !`git diff --cached --stat`
- Recent: !`git log --oneline -8`

Args: `$ARGUMENTS` — `-y` commit without confirmation, `--review` review first, `#N` issue override.

## Rules
- Talk to the user in Korean, briefly. Commit message language follows recent commits.
- Biome (pre-commit) and typecheck/test (pre-push) are enforced by lefthook. Do NOT run them yourself.
- Never use --no-verify, --amend, push, reset, rebase. If on `main`, stop and suggest /start.
- Token economy: read `--stat` first, open full diff only where needed. Skip lockfiles, dist, .turbo, dot/raw, dot/final.

## Steps
1. **Scope**: staged changes if any; otherwise `git add -A`. If anything looks like a secret (.env, keys, tokens), unstage it and warn.
   If changes are clearly unrelated, say so in one line and suggest splitting; otherwise proceed as one commit.
2. **Review** (only with `--review`): changed lines only. 🔴 blocking (bugs, runtime errors, security, `any`/`@ts-ignore`, missing error handling) and 🟡 recommended, one line each. If any 🔴, stop and ask.
3. **Issue**: `#N` arg, else number in branch name (`feat/12-x`, `12-x`). Trailer `Refs #N` (the PR closes it).
4. **Message**: `type(scope): subject` (feat|fix|refactor|perf|style|test|docs|build|ci|chore). Scope = app/package name under apps/ or packages/, `root` for root config. Subject ~50 chars. Body: why/what bullets, intent-focused. Trailers: `Refs #N`, `Reviewed: yes` when applicable.
5. **Commit**: without `-y`, show the message and ask once (커밋/수정). Then `git commit -F <tmpfile>`.
6. **Hook failure**: read only the error lines. If in files of this commit, fix once, re-stage, retry, and tell the user what changed. If it fails again, stop and report.
7. Report: short hash + subject.
