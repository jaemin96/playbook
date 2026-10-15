---
name: pr
description: Push the current branch, open a GitHub PR linked to its issue, and enable auto-merge. Use when the user runs /pr or asks to open a PR.
argument-hint: "[--review] [--draft] [--no-merge]"
allowed-tools: Bash(git:*), Bash(gh:*), Bash(pnpm:*), Read, Glob, Write
---

## Context
- Branch: !`git branch --show-current`
- Uncommitted: !`git status --porcelain`

Args: `$ARGUMENTS` — `--review` ask Claude to review on GitHub (no auto-merge), `--draft` draft PR (no auto-merge), `--no-merge` skip auto-merge.

## Rules
- Talk to the user in Korean, briefly. Don't ask for confirmation unless something is ambiguous or fails.
- Never force-push, never push to main.
- Token economy: `git log --oneline` and `git diff --stat` against the base; no full diffs unless needed.

## Steps
1. **Guard**: on `main` → stop. Uncommitted changes → tell the user to /commit first and stop.
2. **Commits**: `git fetch origin main`, then `git log --oneline origin/main..HEAD` and `git diff --stat origin/main...HEAD`. No commits → stop.
3. **Changeset**: only if `.changeset/` exists and changed public packages lack one: create it (`feat` → minor, else patch, breaking → ask) and commit as `chore: add changeset`.
4. **Push**: `git push -u origin HEAD` (pre-push runs typecheck/test). On failure, show the failing lines and stop.
5. **PR**:
   - If a PR already exists for this branch (`gh pr view`), just report its URL and stop.
   - Title: single commit → its subject; multiple → one Conventional Commit summary (it becomes the squash commit on main).
   - Body: fill `.github/PULL_REQUEST_TEMPLATE.md` — Summary (1-2 lines), Describe your changes (bullets), Issue number and link (`Closes #N` from branch name).
   - `gh pr create --base main --title ... --body-file <tmpfile> --assignee @me` (+ `--draft`).
6. **Merge / review**:
   - `--review`: `gh pr comment --body "@claude review this PR. Report blocking issues first."`, no auto-merge.
   - default: `gh pr merge --auto --squash --delete-branch`. If auto-merge isn't available, say so in one line and leave the PR open.
7. Report: PR URL + next state (auto-merge after CI / waiting for review). Remind: next task → `/start`.
