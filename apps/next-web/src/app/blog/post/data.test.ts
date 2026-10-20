import { beforeEach, describe, expect, it, vi } from "vitest";
import { getPost, POSTS } from "./data";

beforeEach(() => {
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("getPost", () => {
  it("존재하는 slug → 올바른 포스트 반환", () => {
    const post = getPost("hello-world");
    expect(post).toEqual(POSTS[0]);
  });

  it("존재하지 않는 slug → undefined 반환", () => {
    expect(getPost("없는-포스트")).toBeUndefined();
  });

  it("존재하는 slug → console.info 호출", () => {
    getPost("hello-world");
    expect(console.info).toHaveBeenCalledWith(expect.stringContaining("hello-world"));
  });

  it("없는 slug → console.warn 호출", () => {
    getPost("없는-포스트");
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining("없는-포스트"));
  });
});
