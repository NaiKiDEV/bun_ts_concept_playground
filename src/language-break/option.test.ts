import { test, expect, describe, it } from "bun:test";
import { isNone, isSome } from "./option";

describe("functional option", () => {
  describe("isNone", () => {
    it("should return true when object contains error prop", () => {
      expect(isNone({ error: new Error("error") })).toBe(true);
    });

    it("should return false when object does not contain error prop", () => {
      expect(isNone({ value: true })).toBe(false);
    });
  });

  describe("isSome", () => {
    it("should return true when object contains value prop", () => {
      expect(isSome({ value: true })).toBe(true);
    });

    it("should return false when object does not contain value prop", () => {
      expect(isSome({ error: new Error("error") })).toBe(false);
    });
  });
});
