import { colorFor } from "./core/color.js";
import { createFlow, type Flow } from "./core/flow.js";
import { isEnabled } from "./core/namespace.js";

const isProd = typeof process !== "undefined" && process.env?.NODE_ENV === "production";
const noop = (): void => undefined;

export interface Logger {
  debug: (...args: unknown[]) => void;
  info: (...args: unknown[]) => void;
  warn: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
  flow(name: string, ctx?: unknown): Flow;
  track<T>(name: string, fn: () => Promise<T>, ctx?: unknown): Promise<T>;
}

export function createLogger(namespace: string): Logger {
  const color = colorFor(namespace);
  const tag = `%c[${namespace}]%c`;
  const tagStyles = [`color:${color};font-weight:bold`, ""];

  function makeMethod(method: "log" | "warn" | "error", active: () => boolean) {
    if (!active()) return noop;
    // bind으로 반환 → DevTools에 실제 호출 파일/줄 번호 표시
    return console[method].bind(console, tag, ...tagStyles);
  }

  function isActive(): boolean {
    if (isProd) return false;
    return isEnabled(namespace);
  }

  return {
    get debug() {
      return makeMethod("log", isActive);
    },
    get info() {
      return makeMethod("log", isActive);
    },
    get warn() {
      // warn/error는 항상 출력
      return console.warn.bind(console, tag, ...tagStyles);
    },
    get error() {
      return console.error.bind(console, tag, ...tagStyles);
    },

    flow(name, ctx) {
      return createFlow(namespace, name, ctx, isActive());
    },

    async track<T>(name: string, fn: () => Promise<T>, ctx?: unknown): Promise<T> {
      const f = createFlow(namespace, name, ctx, isActive());
      try {
        const result = await fn();
        f.success(result);
        return result;
      } catch (err) {
        f.fail(err);
        throw err;
      }
    },
  };
}

export type { Flow };
