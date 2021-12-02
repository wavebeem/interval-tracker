import { useEffect, useRef, useState } from "react";
import "tachyons";
import { NumberInput } from "./NumberInput";

interface Configuration {
  warmupCooldownDuration: number;
  runDuration: number;
  walkDuration: number;
  runCount: number;
}

interface RunningState extends Configuration {
  type: "running";
  lastTouch: Date;
  tick: Date;
}

interface ConfiguringState extends Configuration {
  type: "configuring";
}

type State = RunningState | ConfiguringState;

function App(): JSX.Element {
  const runningRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<State>({
    type: "configuring",
    warmupCooldownDuration: 5,
    runDuration: 5,
    walkDuration: 3,
    runCount: 3,
  });

  useEffect(() => {
    if (state.type === "configuring") {
      document.exitFullscreen();
      return;
    }
    if (runningRef.current) {
      runningRef.current.requestFullscreen({
        navigationUI: "hide",
      });
    }
    const interval = setInterval(() => {
      setState((state) => ({
        ...state,
        tick: new Date(),
      }));
    }, 250);
    return () => {
      clearInterval(interval);
    };
  }, [state.type]);

  function start() {
    if (state.type !== "configuring") {
      return;
    }
    const date = new Date();
    setState((state) => ({
      ...state,
      lastTouch: date,
      tick: date,
      type: "running",
    }));
  }

  function stop() {
    if (state.type !== "running") {
      return;
    }
    setState((state) => ({ ...state, type: "configuring" }));
  }

  switch (state.type) {
    case "configuring": {
      return (
        <div className="mw6 center">
          <header>
            <h1>Intervals</h1>
          </header>
          <main>
            <NumberInput
              label="Run duration"
              unit="minute(s)"
              min={1}
              max={10}
              value={state.runDuration}
              onChange={(runDuration) => {
                setState((state) => ({ ...state, runDuration }));
              }}
            />
            <NumberInput
              label="Walk duration"
              unit="minute(s)"
              min={1}
              max={10}
              value={state.walkDuration}
              onChange={(walkDuration) => {
                setState((state) => ({ ...state, walkDuration }));
              }}
            />
            <NumberInput
              label="Warmup/cooldown duration"
              unit="minute(s)"
              min={1}
              max={10}
              value={state.warmupCooldownDuration}
              onChange={(warmupCooldownDuration) => {
                setState((state) => ({ ...state, warmupCooldownDuration }));
              }}
            />
            <NumberInput
              label="Count"
              unit="time(s)"
              min={1}
              max={10}
              value={state.runCount}
              onChange={(runCount) => {
                setState((state) => ({ ...state, runCount }));
              }}
            />
            <button
              type="button"
              className="f3 bg-dark-green white ph3 pv2 br2 bn"
              onClick={start}
            >
              Start
            </button>
          </main>
        </div>
      );
    }
    case "running": {
      const shouldBlankScreen =
        state.tick.valueOf() - state.lastTouch.valueOf() > 1000;
      return (
        <div className="mw6 center" ref={runningRef}>
          <header>
            <h1>Intervals</h1>
          </header>
          {shouldBlankScreen ? (
            <div
              className="bg-black fixed top-0 left-0 bottom-0 right-0"
              onClick={() => {
                setState((state) => ({
                  ...state,
                  lastTouch: new Date(),
                }));
              }}
            />
          ) : (
            <main>
              <p>Running...</p>

              <p>
                Last touch:{" "}
                <span className="tabular-nums">
                  {state.lastTouch.toISOString()}
                </span>
              </p>
              <p>
                Tick:{" "}
                <span className="tabular-nums">{state.tick.toISOString()}</span>
              </p>
              <p>Blank? {String(shouldBlankScreen)}</p>

              <button
                type="button"
                className="f3 bg-dark-blue white ph3 pv2 br2 bn"
                onClick={stop}
              >
                Stop
              </button>
            </main>
          )}
        </div>
      );
    }
    default: {
      throw new Error(`uh-oh... ${JSON.stringify(state)}`);
    }
  }
}

export default App;
