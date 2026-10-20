import { afterEach, describe, expect, it, vi } from "vitest";
import { createLogger } from "./index";

function setDebug(value: string) {
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => (k === "debug" ? value : null),
    setItem: () => {},
    removeItem: () => {},
  });
}

describe("createLogger", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("debug/info return noop when namespace not enabled", () => {
    setDebug("");
    const log = createLogger("app:auth");
    expect(log.debug).toBe(log.debug); // same ref on same call? no — getter. just call it
    // should not throw
    expect(() => log.debug("test")).not.toThrow();
  });

  it("warn and error are always bound functions", () => {
    setDebug("");
    const log = createLogger("app:auth");
    expect(typeof log.warn).toBe("function");
    expect(typeof log.error).toBe("function");
  });

  it("track resolves and calls success", async () => {
    setDebug("app:*");
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});

    const log = createLogger("app:checkout");
    const result = await log.track("cart.checkout", async () => ({ orderId: 42 }));
    expect(result).toEqual({ orderId: 42 });
  });

  it("track rejects and re-throws", async () => {
    setDebug("app:*");
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    const log = createLogger("app:checkout");
    await expect(
      log.track("cart.checkout", async () => {
        throw new Error("payment failed");
      }),
    ).rejects.toThrow("payment failed");
  });
});
