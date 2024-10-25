import {
  createLazySyncAction,
  invokeSyncAction,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
} from "../language-break";

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }

  test() {
    console.log("Test");
  }
}

const OptionsPlayground = () => {
  const result = invokeSyncAction<never, CustomError>(() => {
    throw new CustomError("Custom Error");
    // throw new Error("Error");
  });

  const lazySyncFunction = createLazySyncAction(() => {
    console.log("Lazy sync action invoked");
  });

  // Invoke lazy sync action
  lazySyncFunction();

  const positiveResult = invokeSyncAction(() => {
    return {
      name: "John",
    };
  });

  if (isNone(result)) {
    if (result.error instanceof CustomError) {
      console.error(result.error.test());
    }
    console.error(unwrapError(result));
  }

  // This throws!
  // unwrapValue(result);

  if (isSome(positiveResult)) {
    console.log(positiveResult.value);

    const value = unwrapValue(positiveResult);
    console.log(value);
  }

  // Intentionally not render anything
  return <></>;
};

export { OptionsPlayground };
