#!/usr/bin/env node

/**
 * gen-graph.mjs
 * 모노레포 의존성 그래프를 DOT 형식으로 생성한다.
 *
 * - turbo --graph 출력에서 task 노드와 엣지를 파싱
 * - package.json workspace:* 의존성을 직접 읽어 패키지 간 관계 추가
 * - apps / packages 클러스터 분리, 형태로 종류 구분
 * - dot/final/mono.dot 에 항상 같은 이름으로 덮어씀 (타임스탬프 누적 없음)
 * - graphviz(dot) 가 설치되어 있으면 .svg 도 함께 출력
 */

import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "../..");
const dotDir = path.resolve(__dirname, "..");
const finalDir = path.join(dotDir, "final");
const tmpDot = path.join(dotDir, "raw", "_turbo_tmp.dot");

fs.mkdirSync(finalDir, { recursive: true });
fs.mkdirSync(path.join(dotDir, "raw"), { recursive: true });

// ─── 1. 루트 패키지명 ────────────────────────────────────────────────────────
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, "package.json"), "utf8"));
const repoName = rootPkg.name ?? "mono";

// ─── 2. workspace 패키지 수집 ────────────────────────────────────────────────
function collectPackages(baseDir, kind) {
  if (!fs.existsSync(baseDir)) return [];
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => {
      const pkgPath = path.join(baseDir, e.name, "package.json");
      if (!fs.existsSync(pkgPath)) return null;
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      return { name: pkg.name ?? e.name, dir: e.name, kind };
    })
    .filter(Boolean);
}

const allPkgs = [
  ...collectPackages(path.join(rootDir, "apps"), "app"),
  ...collectPackages(path.join(rootDir, "packages"), "package"),
];

// name → kind 맵
const pkgKind = Object.fromEntries(allPkgs.map((p) => [p.name, p.kind]));

// ─── 3. workspace 의존성 엣지 수집 ───────────────────────────────────────────
// A → B: A가 B에 의존 (의존 방향대로 화살표)
const workspaceEdges = [];
for (const pkg of allPkgs) {
  const pkgJsonPath = path.join(
    rootDir,
    pkg.kind === "app" ? "apps" : "packages",
    pkg.dir,
    "package.json",
  );
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf8"));
  const deps = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
    ...pkgJson.peerDependencies,
  };
  for (const [dep, ver] of Object.entries(deps)) {
    if (typeof ver === "string" && ver.startsWith("workspace:") && pkgKind[dep]) {
      workspaceEdges.push({ from: pkg.name, to: dep });
    }
  }
}

// ─── 4. turbo --graph 실행 ────────────────────────────────────────────────────
console.log("▶ turbo graph 생성 중...");
try {
  execSync(`npx turbo run build --graph="${tmpDot}"`, {
    stdio: "pipe",
    cwd: rootDir,
  });
} catch (e) {
  // turbo는 graph 생성 후 exit 1을 낼 때가 있음 — 파일만 있으면 무시
  if (!fs.existsSync(tmpDot)) {
    console.error("❌ turbo graph 파일 생성 실패:", e.message);
    process.exit(1);
  }
}

// ─── 5. turbo raw DOT 파싱 ────────────────────────────────────────────────────
const raw = fs.readFileSync(tmpDot, "utf8");

// 엣지 추출: "A" -> "B"
const turboEdgeRe = /"([^"]+)"\s*->\s*"([^"]+)"/g;
const turboEdges = [];
let m;
while ((m = turboEdgeRe.exec(raw)) !== null) {
  turboEdges.push({ from: m[1], to: m[2] });
}

// 노드명 정제: "[root] @repo/logger#build" → { pkg: "@repo/logger", task: "build" }
function parseNode(raw) {
  const inner = raw.replace(/^\[root\]\s*/, "");
  const hashIdx = inner.lastIndexOf("#");
  if (hashIdx === -1) return { pkg: inner, task: null };
  return { pkg: inner.slice(0, hashIdx), task: inner.slice(hashIdx + 1) };
}

// 유효 노드 목록 (___ROOT___ 제외)
const turboNodeRaws = new Set(
  turboEdges.flatMap((e) => [e.from, e.to]).filter((n) => !n.includes("___ROOT___")),
);

// ─── 6. DOT 생성 헬퍼 ────────────────────────────────────────────────────────
function q(s) {
  return `"${s}"`;
}

function nodeId(pkgName, task) {
  return task ? `${pkgName}#${task}` : pkgName;
}

// 노드 스타일
// app    → ellipse, 파란 계열
// package → box rounded, 어두운 회색
// root   → diamond, accent
function nodeAttrs(pkgName, task) {
  const kind = pkgKind[pkgName];
  const label = task ? `${pkgName}\\n· ${task}` : pkgName;

  if (kind === "app") {
    return `label=${q(label)}, shape=ellipse, fillcolor="#0f4c81", fontcolor="white", color="#1e7fc4", penwidth=2`;
  }
  if (kind === "package") {
    return `label=${q(label)}, shape=box, style="filled,rounded", fillcolor="#1e2d3d", fontcolor="white", color="#3a7bd5", penwidth=2`;
  }
  // 알 수 없는 노드 (root 등)
  return `label=${q(label)}, shape=diamond, fillcolor="#007acc", fontcolor="white", color="#005fa3", penwidth=3`;
}

// ─── 7. 클러스터별 노드 분류 ─────────────────────────────────────────────────
const appNodes = [];
const pkgNodes = [];
const otherNodes = [];

for (const rawNode of turboNodeRaws) {
  const { pkg, task } = parseNode(rawNode);
  const id = nodeId(pkg, task);
  const attrs = nodeAttrs(pkg, task);
  const kind = pkgKind[pkg];

  if (kind === "app") appNodes.push({ id, attrs });
  else if (kind === "package") pkgNodes.push({ id, attrs });
  else otherNodes.push({ id, attrs });
}

// workspace 의존성에만 나오는 노드 추가 (turbo 그래프에 없는 경우 대비)
const turboNodeIds = new Set(
  [...turboNodeRaws].map((r) => {
    const { pkg, task } = parseNode(r);
    return nodeId(pkg, task);
  }),
);
for (const pkg of allPkgs) {
  const id = nodeId(pkg.name, null);
  if (!turboNodeIds.has(id) && !turboNodeIds.has(`${pkg.name}#build`)) {
    const attrs = nodeAttrs(pkg.name, null);
    if (pkg.kind === "app") appNodes.push({ id, attrs });
    else pkgNodes.push({ id, attrs });
  }
}

// ─── 8. 엣지 변환 ────────────────────────────────────────────────────────────
function convertEdge(fromRaw, toRaw) {
  const from = parseNode(fromRaw);
  const to = parseNode(toRaw);
  return { from: nodeId(from.pkg, from.task), to: nodeId(to.pkg, to.task) };
}

const allEdges = [
  // turbo task 엣지 (___ROOT___ 연결은 제외 — 노이즈)
  ...turboEdges
    .filter((e) => !e.from.includes("___ROOT___") && !e.to.includes("___ROOT___"))
    .map((e) => ({ ...convertEdge(e.from, e.to), style: "task" })),
  // workspace 의존성 엣지
  ...workspaceEdges.map((e) => ({ from: nodeId(e.from, null), to: nodeId(e.to, null), style: "dep" })),
];

// 중복 제거
const edgeSet = new Set();
const uniqueEdges = allEdges.filter((e) => {
  const key = `${e.from}→${e.to}:${e.style}`;
  if (edgeSet.has(key)) return false;
  edgeSet.add(key);
  return true;
});

// ─── 9. DOT 렌더링 ────────────────────────────────────────────────────────────
function indent(str, n = 4) {
  const pad = " ".repeat(n);
  return str
    .split("\n")
    .map((l) => (l.trim() ? pad + l : ""))
    .join("\n");
}

function renderNodes(nodes) {
  return nodes.map((n) => `    ${q(n.id)} [${n.attrs}];`).join("\n");
}

function renderEdge(e) {
  if (e.style === "dep") {
    // workspace 의존 — 굵고 밝은 엣지
    return `    ${q(e.from)} -> ${q(e.to)} [color="#3a7bd5cc", penwidth=2.5, style=solid, arrowsize=1.0];`;
  }
  // turbo task 엣지 — 가늘고 흐리게
  return `    ${q(e.from)} -> ${q(e.to)} [color="#ffffff40", penwidth=1.2, style=dashed, arrowsize=0.8];`;
}

const dot = `\
digraph ${q(repoName)} {
    // ── layout ──────────────────────────────────────────────────
    graph [
        bgcolor="#0d1117",
        fontcolor="#c9d1d9",
        fontname="monospace",
        fontsize=12,
        rankdir=LR,
        splines=ortho,
        nodesep=0.8,
        ranksep=1.4,
        pad=1.2,
        margin=0,
    ];
    node [
        fontname="monospace",
        fontsize=11,
        fontcolor="white",
        margin="0.25,0.18",
    ];
    edge [
        fontname="monospace",
        fontsize=9,
    ];

    // ── apps cluster ─────────────────────────────────────────────
    subgraph cluster_apps {
        label="apps";
        style="filled,rounded";
        fillcolor="#0f1f33";
        color="#1e4a7a";
        fontcolor="#58a6ff";
        fontsize=13;
        penwidth=1.5;
        margin=20;
${renderNodes(appNodes)}
    }

    // ── packages cluster ─────────────────────────────────────────
    subgraph cluster_packages {
        label="packages";
        style="filled,rounded";
        fillcolor="#111d2b";
        color="#1a3a5c";
        fontcolor="#79c0ff";
        fontsize=13;
        penwidth=1.5;
        margin=20;
${renderNodes(pkgNodes)}
    }

${otherNodes.length > 0 ? `    // ── other ──────────────────────────────────────────────────\n${renderNodes(otherNodes)}\n` : ""}
    // ── edges ────────────────────────────────────────────────────
${uniqueEdges.map(renderEdge).join("\n")}
}
`;

// ─── 10. 파일 출력 ────────────────────────────────────────────────────────────
const outDot = path.join(finalDir, `${repoName}.dot`);
fs.writeFileSync(outDot, dot);
console.log("✅ DOT 생성 완료:", outDot);

// graphviz 있으면 SVG도 출력
const gv = spawnSync("dot", ["-Tsvg", "-o", outDot.replace(".dot", ".svg"), outDot]);
if (gv.status === 0) {
  console.log("✅ SVG 생성 완료:", outDot.replace(".dot", ".svg"));
} else {
  console.log("ℹ️  graphviz 미설치 — SVG 생략 (dot 명령어를 설치하면 자동 생성됩니다)");
}
