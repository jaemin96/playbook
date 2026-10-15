#!/usr/bin/env bash
# 레포를 GitHub 에 처음 push 한 뒤 한 번만 실행: pnpm setup:github
set -euo pipefail

repo=$(gh repo view --json nameWithOwner -q .nameWithOwner)
echo "▶ $repo 설정"

# squash merge 만 허용, auto-merge 허용, 머지 후 브랜치 자동 삭제
gh repo edit "$repo" \
  --enable-auto-merge \
  --delete-branch-on-merge \
  --enable-squash-merge \
  --enable-merge-commit=false \
  --enable-rebase-merge=false
echo "✅ 머지 옵션"

# main 에 CI(verify) 통과를 필수로 → auto-merge 가 'CI 통과 후 머지'로 동작
if gh api "repos/$repo/rulesets" --method POST --input - > /dev/null 2>&1 << 'JSON'
{
  "name": "main-ci-required",
  "target": "branch",
  "enforcement": "active",
  "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
  "rules": [
    {
      "type": "required_status_checks",
      "parameters": {
        "strict_required_status_checks_policy": false,
        "required_status_checks": [{ "context": "verify" }]
      }
    }
  ]
}
JSON
then
  echo "✅ main 필수 체크(verify)"
else
  echo "⚠️  브랜치 규칙 생성 실패 (이미 있거나, 무료 플랜 private 레포일 수 있음)"
  echo "   → 레포를 public 으로 두거나, /pr --no-merge 로 PR 만 만들고 직접 머지하세요."
fi
