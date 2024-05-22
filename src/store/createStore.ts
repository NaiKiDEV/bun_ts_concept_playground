import { useSyncExternalStore } from "react";

type Store<T> = {
  getState: () => T;
  subscribe: (listener: () => void) => () => void;
};

type StateGetter<T> = () => T;
type StateSetter<T extends Object> = (value: Partial<T>) => void;

type StateAction = (...args: any[]) => void;

function createStore<T extends Object, U extends Record<string, StateAction>>(
  actions: (
    get: StateGetter<T>,
    set: StateSetter<T>,
  ) => U extends Record<string, StateAction> ? U : never,
): (defaultState: T) => Store<T> & U {
  let storeChangeListeners: Function[] = [];

  const emitChange = () => {
    for (const listener of storeChangeListeners) {
      listener();
    }
  };

  const subscribe = (listener: Function) => {
    storeChangeListeners.push(listener);
    return () => {
      storeChangeListeners = storeChangeListeners.filter(
        (storeChangeListener) => storeChangeListener !== listener,
      );
    };
  };

  return (defaultState) => {
    let state = { ...defaultState };

    const getter: StateGetter<T> = () => state;
    const setter: StateSetter<T> = (value) => {
      state = { ...state, ...value };
      emitChange();
    };

    const stateActions = actions(getter, setter);
    return {
      ...stateActions,
      getState: getter,
      subscribe,
    };
  };
}

const useStore = <T>(store: Store<T>) =>
  useSyncExternalStore(store.subscribe, store.getState);

export { createStore, useStore };
