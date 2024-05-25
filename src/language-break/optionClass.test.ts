import { mock, expect, describe, it } from "bun:test";
import {
  createOptionC,
  invokeAsyncActionC,
  invokeSyncActionC,
} from "./optionClass";

describe("class based option", () => {
  describe("isNone", () => {
    it("should return true when object contains error prop", () => {
      const error = new Error("error");
      const option = createOptionC(error);

      expect(option.isNone()).toBe(true);
    });

    it("should return false when object does not contain error prop", () => {
      const option = createOptionC("foo");

      expect(option.isNone()).toBe(false);
    });
  });

  describe("isSome", () => {
    it("should return true when object contains value prop", () => {
      const option = createOptionC("foo");

      expect(option.isSome()).toBe(true);
    });

    it("should return false when object does not contain value prop", () => {
      const error = new Error("error");
      const option = createOptionC(error);

      expect(option.isSome()).toBe(false);
    });
  });

  describe("unwrapValue", () => {
    it("should return value when object contains value prop", () => {
      const option = createOptionC("foo");

      expect(option.unwrapValue()).toBe("foo");
    });

    it("should throw error when object does not contain value prop", () => {
      const error = new Error("error");
      const option = createOptionC(error);

      expect(() => option.unwrapValue()).toThrowError("Option is None");
    });
  });

  describe("unwrapError", () => {
    it("should return error when object contains error prop", () => {
      const error = new Error("error");
      const option = createOptionC(error);

      expect(option.unwrapError()).toBe(error);
    });

    it("should throw error when object does not contain error prop", () => {
      const option = createOptionC("foo");

      expect(() => option.unwrapError()).toThrowError("Option is Some");
    });
  });

  describe("invokeSyncActionC", () => {
    it("should return option with value when callback does not throw", () => {
      const mockCallback = mock().mockReturnValue("foo");

      const option = invokeSyncActionC(mockCallback);

      expect(mockCallback).toBeCalledTimes(1);
      expect(option.isSome()).toBe(true);
      expect(option.unwrapValue()).toBe("foo");
    });

    it("should return option with error when callback throws", () => {
      const mockCallback = mock(() => {
        throw new Error("Mock Error");
      });
      const option = invokeSyncActionC(mockCallback);

      expect(mockCallback).toBeCalledTimes(1);
      expect(option.isNone()).toBe(true);
      expect(option.unwrapError()).toEqual(new Error("Mock Error"));
    });
  });

  describe("invokeAsyncActionC", () => {
    it("should return option with value when callback does not throw", async () => {
      const mockCallback = mock().mockReturnValueOnce("foo");
      const option = await invokeAsyncActionC(mockCallback);

      expect(mockCallback).toBeCalledTimes(1);
      expect(option.isSome()).toBe(true);
      expect(option.unwrapValue()).toBe("foo");
    });

    it("should return option with error when callback throws", async () => {
      const mockCallback = mock(() => {
        throw new Error("Mock Error");
      });

      const option = await invokeAsyncActionC(mockCallback);

      expect(mockCallback).toBeCalledTimes(1);
      expect(option.isNone()).toBe(true);
      expect(option.unwrapError()).toEqual(new Error("Mock Error"));
    });
  });
});
