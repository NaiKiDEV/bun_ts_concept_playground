import { Button } from "@/components/ui/button";
import { createStore, useStore } from "../store";

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

const Counter = () => {
  const { counter } = useStore(store);

  return <p>State: {counter}</p>;
};

const StoreExample = () => {
  return (
    <div>
      <Counter />
      <Button type="button" onClick={() => store.increment()}>
        Increment
      </Button>
      <Button type="button" onClick={() => store.setSomething(0)}>
        Reset
      </Button>
    </div>
  );
};

export { StoreExample };
