import { createContext, useContext, useReducer, type ReactNode } from "react";

export type Timer = {
  name: string;
  duration: number;
};

type TimersState = {
  isRunning: boolean;
  timers: Timer[];
};

const initialState: TimersState = {
  isRunning: true,
  timers: [],
};

type TimersContextValue = TimersState & {
  addTimer: (timerData: Timer) => void;
  startTimers: () => void;
  stopTimers: () => void;
};

export const TimersContext = createContext<TimersContextValue | null>(null);

export function useTimersContext() {
  const timersCtx = useContext(TimersContext);

  if (timersCtx == null)
    throw new Error("TimersContext is null - that should not be the case");

  return timersCtx;
}

type TimersContextProviderProps = {
  children: ReactNode;
};

type StartTimersAction = {
  type: "START TIMERS";
};

type AddTimersAction = {
  type: "ADD TIMERS";
  payload: Timer;
};

type StopTimersAction = {
  type: "STOP TIMERS";
};

type Action = StartTimersAction | AddTimersAction | StopTimersAction;

function timersReducer(state: TimersState, action: Action): TimersState {
  switch (action.type) {
    case "START TIMERS":
      return { ...state, isRunning: true };
    case "STOP TIMERS":
      return { ...state, isRunning: false };
    case "ADD TIMERS":
      return {
        ...state,
        timers: [
          ...state.timers,
          { duration: action.payload.duration, name: action.payload.name },
        ],
      };
    default:
      return state;
  }
}

export default function TimersContextProvider({
  children,
}: TimersContextProviderProps) {
  const [timersState, dispatch] = useReducer(timersReducer, initialState);
  const { isRunning, timers } = timersState;

  const ctx: TimersContextValue = {
    timers: timers,
    isRunning: isRunning,
    addTimer(timerData) {
      dispatch({ type: "ADD TIMERS", payload: timerData });
    },
    startTimers() {
      dispatch({ type: "START TIMERS" });
    },
    stopTimers() {
      dispatch({ type: "STOP TIMERS" });
    },
  };
  return (
    <TimersContext.Provider value={ctx}>{children}</TimersContext.Provider>
  );
}
