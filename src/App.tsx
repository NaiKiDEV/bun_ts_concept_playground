import "./App.css";
import {
  invokeSyncAction,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
  createLazySyncAction,
} from "./language-break";
import { createStore, useStore } from "./store";

type TestState = {
  counter: number;
  optional?: string;
};

type TestActions = {
  test: () => void;
  setSomething: (value: number) => void;
  increment: () => void;
};

const defaultState: TestState = {
  counter: 123,
};

const store = createStore<TestState, TestActions>((get, set) => ({
  test: () => console.log(get()),
  setSomething: (value: number) => {
    set({ counter: value });
  },
  increment: () => {
    const currentState = get();
    set({ counter: currentState.counter + 1 });
  },
}))(defaultState);

// store.test();
// store.setSomething(456);
// store.test();

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }

  test() {
    console.log("Test");
  }
}

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

const Counter = () => {
  const { counter } = useStore(store);

  return <p>State: {counter}</p>;
};

const App = () => {
  return (
    <div className="content">
      <div>
        <Counter />
        <button type="button" onClick={() => store.increment()}>
          Increment
        </button>
        <button type="button" onClick={() => store.setSomething(0)}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default App;
