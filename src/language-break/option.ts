enum OptionType {
  Some,
  None,
}

type Some<T> = { value: T; optionType: OptionType.Some };
type None<E extends Error> = { error: E | Error; optionType: OptionType.None };

// TODO: Doesn't really work for functional programming
// Should I do prototype injection for these?
type OptionMethods = {
  //   unwrapValue: <T, E extends Error>(option: Option<T, E>) => T;
  //   unwrapError: <T, E extends Error>(
  //     option: Option<TemplateStringsArray, E>
  //   ) => E | Error;
  //   isSome: boolean;
  //   isNone: <T, E extends Error>(
  //     option: Partial<Option<T, E>>
  //   ) => option is None<E>;
};

type Option<T, E extends Error> = OptionMethods & (Some<T> | None<E>);

const unwrapValue = <T, E extends Error>(option: Option<T, E>): T => {
  if (option.optionType === OptionType.None) {
    throw new Error("Option is None");
  }

  return option.value;
};

const unwrapError = <T, E extends Error>(option: Option<T, E>): E | Error => {
  if (option.optionType === OptionType.Some) {
    throw new Error("Option is Some");
  }

  return option.error;
};

const isSome = <T, E extends Error>(
  option: Partial<Option<T, E>>,
): option is Some<T> => {
  return option.optionType === OptionType.Some;
};

const isNone = <T, E extends Error>(
  option: Partial<Option<T, E>>,
): option is None<E> => {
  return option.optionType === OptionType.None;
};

const optionMethods: OptionMethods = {
  //   unwrapValue,
  //   unwrapError,
  //   isSome,
  //   isNone,
};

const createOption = <T, E extends Error>(
  value: T | E | Error,
): Option<T, E> => {
  if (
    value instanceof Error ||
    (typeof value === "object" &&
      value &&
      "message" in value &&
      "name" in value)
  ) {
    return {
      ...optionMethods,
      error: value as E,
      optionType: OptionType.None,
    };
  }

  return {
    ...optionMethods,
    value,
    optionType: OptionType.Some,
  };
};

const invokeSyncAction = <T, E extends Error>(
  callback: () => T,
): Option<T, E> => {
  try {
    const result = callback();

    return createOption<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in error
    ) {
      return createOption<T, E>(error as E);
    }

    return createOption<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`),
    );
  }
};

const createLazySyncAction =
  <T, E extends Error>(callback: () => T) =>
  () =>
    invokeSyncAction<T, E>(callback);

const invokeAsyncAction = async <T, E extends Error>(
  callback: () => Promise<T>,
): Promise<Option<T, E>> => {
  try {
    const result = await callback();

    return createOption<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in error
    ) {
      return createOption<T, E>(error as E);
    }

    return createOption<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`),
    );
  }
};

const createLazyAsyncAction =
  <T, E extends Error>(callback: () => Promise<T>) =>
  () =>
    invokeAsyncAction<T, E>(callback);

export {
  createOption,
  invokeSyncAction,
  invokeAsyncAction,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
  createLazySyncAction,
  createLazyAsyncAction,
};
export type { OptionMethods, Some, None, Option, OptionType };
