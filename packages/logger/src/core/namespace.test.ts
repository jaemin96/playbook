import { afterEach, describe, expect, it, vi } from "vitest";
import { isEnabled } from "./namespace.js";

describe("isEnabled", () => {
  function setDebug(value: string | null) {
    const store: Record<string, string> = {};
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => (value !== null && k === "debug" ? value : null),
      setItem: (k: string, v: string) => {
        store[k] = v;
      },
      removeItem: (k: string) => {
        delete store[k];
      },
    });
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when localStorage.debug is empty", () => {
    setDebug("");
    expect(isEnabled("app:auth")).toBe(false);
  });

  it("matches exact namespace", () => {
    setDebug("app:auth");
    expect(isEnabled("app:auth")).toBe(true);
    expect(isEnabled("app:ui")).toBe(false);
  });

  it("matches wildcard *", () => {
    setDebug("app:*");
    expect(isEnabled("app:auth")).toBe(true);
    expect(isEnabled("app:ui")).toBe(true);
    expect(isEnabled("lib:core")).toBe(false);
  });

  it("excludes with - prefix", () => {
    setDebug("app:*,-app:noisy");
    expect(isEnabled("app:auth")).toBe(true);
    expect(isEnabled("app:noisy")).toBe(false);
  });

  it("handles multiple patterns", () => {
    setDebug("app:auth, lib:*");
    expect(isEnabled("app:auth")).toBe(true);
    expect(isEnabled("lib:core")).toBe(true);
    expect(isEnabled("app:ui")).toBe(false);
  });

  it("returns false when localStorage is unavailable", () => {
    vi.stubGlobal("localStorage", undefined);
    expect(isEnabled("app:auth")).toBe(false);
  });
});
