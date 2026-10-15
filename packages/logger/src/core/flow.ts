import { colorFor } from "./color.js";

export interface FlowStep {
  label: string;
  elapsedMs: number;
  ctx?: unknown;
}

export interface Flow {
  step(label: string, ctx?: unknown): void;
  success(ctx?: unknown): void;
  fail(error: unknown, ctx?: unknown): void;
}

let idCounter = 0;
function shortId(): string {
  return (++idCounter).toString(36).padStart(3, "0");
}

export function createFlow(namespace: string, name: string, ctx: unknown, active: boolean): Flow {
  const flowId = shortId();
  const startedAt = performance.now();
  const color = colorFor(namespace);
  const steps: FlowStep[] = [];
  const tag = `%c[${namespace}]%c`;
  const tagStyle = [`color:${color};font-weight:bold`, ""];

  function elapsed(): number {
    return Math.round(performance.now() - startedAt);
  }

  return {
    step(label, stepCtx) {
      const s: FlowStep = { label, elapsedMs: elapsed(), ctx: stepCtx };
      steps.push(s);
      if (active) {
        console.log(
          `${tag} %c${flowId}%c ${name} › ${label} +${s.elapsedMs}ms`,
          ...tagStyle,
          "color:gray",
          "",
          ...(stepCtx !== undefined ? [stepCtx] : []),
        );
      }
    },

    success(resultCtx) {
      const ms = elapsed();
      if (active) {
        console.groupCollapsed(
          `${tag} ${name} %c✓ ${ms}ms%c  #${flowId}`,
          ...tagStyle,
          "color:#10b981;font-weight:bold",
          "color:gray",
        );
        if (ctx !== undefined) console.log("context", ctx);
        for (const s of steps) {
          console.log(`  +${s.elapsedMs}ms  ${s.label}`, ...(s.ctx !== undefined ? [s.ctx] : []));
        }
        if (resultCtx !== undefined) console.log("result", resultCtx);
        console.groupEnd();
      }
    },

    fail(error, resultCtx) {
      const ms = elapsed();
      // 실패는 비활성 상태에서도 항상 출력
      console.groupCollapsed(
        `${tag} ${name} %c✗ ${ms}ms%c  #${flowId}`,
        ...tagStyle,
        "color:#ef4444;font-weight:bold",
        "color:gray",
      );
      if (ctx !== undefined) console.log("context", ctx);
      for (const s of steps) {
        console.log(`  +${s.elapsedMs}ms  ${s.label}`, ...(s.ctx !== undefined ? [s.ctx] : []));
      }
      if (resultCtx !== undefined) console.log("result", resultCtx);
      console.error(error);
      console.groupEnd();
    },
  };
}
