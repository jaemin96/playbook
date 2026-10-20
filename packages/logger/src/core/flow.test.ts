import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createFlow } from "./flow";

describe("createFlow", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "groupCollapsed").mockImplementation(() => {});
    vi.spyOn(console, "groupEnd").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("calls groupCollapsed on success", () => {
    const f = createFlow("app:auth", "login.submit", { email: "a@b.com" }, true);
    f.step("validate");
    f.success({ userId: 1 });
    expect(console.groupCollapsed).toHaveBeenCalledOnce();
  });

  it("calls groupCollapsed + error on fail", () => {
    const f = createFlow("app:auth", "login.submit", undefined, true);
    f.fail(new Error("bad creds"));
    expect(console.groupCollapsed).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledOnce();
  });

  it("fail always outputs even when inactive", () => {
    const f = createFlow("app:auth", "login.submit", undefined, false);
    f.fail(new Error("network"));
    expect(console.groupCollapsed).toHaveBeenCalledOnce();
    expect(console.error).toHaveBeenCalledOnce();
  });

  it("success does not output when inactive", () => {
    const f = createFlow("app:auth", "login.submit", undefined, false);
    f.success();
    expect(console.groupCollapsed).not.toHaveBeenCalled();
  });

  it("step logs each step", () => {
    const f = createFlow("app:auth", "login.submit", undefined, true);
    f.step("validate");
    f.step("request", { url: "/api/login" });
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});
