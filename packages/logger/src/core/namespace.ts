/** localStorage.debug 패턴으로 네임스페이스 활성화 여부를 판단한다. */

function getDebugPattern(): string {
  try {
    return (typeof localStorage !== "undefined" && localStorage.getItem("debug")) || "";
  } catch {
    return "";
  }
}

function toRegExp(pattern: string): RegExp {
  return new RegExp(`^${pattern.replace(/\*/g, ".*?")}$`);
}

export function isEnabled(namespace: string): boolean {
  const raw = getDebugPattern();
  if (!raw) return false;

  const patterns = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let enabled = false;

  for (const p of patterns) {
    if (p.startsWith("-")) {
      if (toRegExp(p.slice(1)).test(namespace)) return false;
    } else {
      if (toRegExp(p).test(namespace)) enabled = true;
    }
  }

  return enabled;
}
