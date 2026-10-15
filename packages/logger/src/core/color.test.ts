import { describe, expect, it } from "vitest";
import { colorFor } from "./color.js";

describe("colorFor", () => {
  it("returns a hex color string", () => {
    expect(colorFor("app:auth")).toMatch(/^#[0-9a-f]{6}$/i);
  });

  it("returns the same color for the same namespace", () => {
    expect(colorFor("app:auth")).toBe(colorFor("app:auth"));
  });

  it("returns different colors for different namespaces (usually)", () => {
    const colors = new Set(["app:a", "app:b", "app:c", "lib:x", "lib:y"].map(colorFor));
    expect(colors.size).toBeGreaterThan(1);
  });
});
