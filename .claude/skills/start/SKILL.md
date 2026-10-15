---
name: start
description: Start a new piece of work - create a GitHub issue from a topic and check out a linked branch. Use when the user runs /start or wants to begin a new task/study topic.
argument-hint: "<topic> [--bug] [#existing-issue]"
allowed-tools: Bash(git:*), Bash(gh:*), Write
---

## Context
- Branch: !`git branch --show-current`
- Uncommitted: !`git status --porcelain`

Args: `$ARGUMENTS` — free-text topic, `--bug` for a bug issue, `#N` to start from an existing issue instead of creating one.

## Rules
- Talk to the user in Korean, briefly. Ask nothing unless the topic is empty.
- Never discard uncommitted work.

## Steps
1. **Guard**: if there are uncommitted changes, stop and suggest /commit first.
2. **Clean up previous branch**: if the current branch is not `main`, check `gh pr view --json state -q .state`. If `MERGED`, switch to main and delete the local branch with `git branch -D <branch>`. Otherwise just switch to main.
3. **Sync**: `git switch main && git pull --prune`.
4. **Issue**:
   - `#N` given → use it, read its title with `gh issue view N --json title`.
   - Otherwise create one following `.github/ISSUE_TEMPLATE/`:
     - feature (default): label `enhancement`, body sections `## Summary` (1-3 lines from the topic) and `## Todo` (2-5 concrete checklist items you derive from the topic).
     - `--bug`: label `bug`, sections `## Description`, `## Screenshots` (leave empty), `## ETC`.
     - `gh issue create --title "<short title>" --body-file <tmpfile> --label <label> --assignee @me`
5. **Branch**: prefix `feat` (or `fix` for bugs), slug = 2-4 English kebab-case words.
   `gh issue develop N --name <prefix>/N-<slug> --base main --checkout`
6. Report in 2 lines: issue URL, branch name.
