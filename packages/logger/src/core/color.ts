/** 네임스페이스 문자열로 고정 색상(hex)을 결정한다. */

const COLORS = [
  "#0ea5e9", // sky
  "#8b5cf6", // violet
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#ec4899", // pink
  "#f97316", // orange
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#6366f1", // indigo
];

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h) ^ str.charCodeAt(i);
  }
  return Math.abs(h);
}

export function colorFor(namespace: string): string {
  return COLORS[hash(namespace) % COLORS.length];
}
