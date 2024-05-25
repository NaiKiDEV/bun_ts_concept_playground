import { test, expect, describe, it } from "bun:test";
import {
  createOption,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
} from "./option";

describe("functional option", () => {
  describe("isNone", () => {
    it("should return true when object contains error prop", () => {
      const option = createOption(new Error("error"));

      expect(isNone(option)).toBe(true);
    });

    it("should return false when object does not contain error prop", () => {
      const option = createOption("foo");

      expect(isNone(option)).toBe(false);
    });
  });

  describe("isSome", () => {
    it("should return true when object contains value prop", () => {
      const option = createOption("foo");

      expect(isSome(option)).toBe(true);
    });

    it("should return false when object does not contain value prop", () => {
      const option = createOption(new Error("error"));

      expect(isSome(option)).toBe(false);
    });
  });

  describe("unwrapValue", () => {
    it("should return value when object contains value prop", () => {
      const option = createOption("foo");

      expect(unwrapValue(option)).toBe("foo");
    });

    it("should throw error when object does not contain value prop", () => {
      const error = new Error("error");
      const option = createOption(error);

      expect(() => unwrapValue(option)).toThrowError("Option is None");
    });
  });

  describe("unwrapError", () => {
    it("should return error when object contains error prop", () => {
      const error = new Error("error");
      const option = createOption(error);

      expect(unwrapError(option)).toBe(error);
    });

    it("should throw error when object does not contain error prop", () => {
      const option = createOption("foo");

      expect(() => unwrapError(option)).toThrowError("Option is Some");
    });
  });
});
