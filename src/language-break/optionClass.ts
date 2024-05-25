enum OptionType {
  Some,
  None,
}

class OptionC<T, E extends Error> {
  private value: T | null = null;
  private error: E | null = null;
  private optionType: OptionType | undefined;

  constructor(value: T | E | Error) {
    if (
      value instanceof Error ||
      (typeof value === "object" &&
        value &&
        "message" in value &&
        "name" in value)
    ) {
      this.error = value as E;
      this.optionType = OptionType.None;
    } else {
      this.value = value as T;
      this.optionType = OptionType.Some;
    }
  }

  unwrapValue(): T {
    if (this.value === null) {
      throw new Error("Option is None");
    }

    return this.value;
  }

  unwrapError(): E | Error {
    if (this.error === null) {
      throw new Error("Option is Some");
    }

    return this.error;
  }

  isSome(): boolean {
    return this.optionType === OptionType.Some;
  }

  isNone(): boolean {
    return this.optionType === OptionType.None;
  }
}

const createOptionC = <T, E extends Error>(
  value: T | E | Error,
): OptionC<T, E> => {
  return new OptionC<T, E>(value);
};

const invokeSyncActionC = <T, E extends Error>(
  callback: () => T,
): OptionC<T, E> => {
  try {
    const result = callback();

    return createOptionC<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in error
    ) {
      return createOptionC<T, E>(error as E);
    }

    return createOptionC<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`),
    );
  }
};

const createLazySyncActionC =
  <T, E extends Error>(callback: () => T) =>
  () =>
    invokeSyncActionC<T, E>(callback);

const invokeAsyncActionC = async <T, E extends Error>(
  callback: () => Promise<T>,
): Promise<OptionC<T, E>> => {
  try {
    const result = await callback();

    return createOptionC<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in error
    ) {
      return createOptionC<T, E>(error as E);
    }

    return createOptionC<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`),
    );
  }
};

const createLazyAsyncActionC =
  <T, E extends Error>(callback: () => Promise<T>) =>
  () =>
    invokeAsyncActionC<T, E>(callback);

export {
  OptionC,
  createOptionC,
  invokeSyncActionC,
  createLazySyncActionC,
  invokeAsyncActionC,
  createLazyAsyncActionC,
};
