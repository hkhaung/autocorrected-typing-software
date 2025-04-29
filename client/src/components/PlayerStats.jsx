import { useState, useEffect } from "react";

function PlayerStats({ timer, reset }) {
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    let interval;
    if (timer) {
      interval = setInterval(() => {
          setTime((prevTime) => prevTime + 10);
      }, 10);

    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setWpm(null);
    setAccuracy(null);
    setTime(null);
  }, [reset]);

  return (
    <div className="stats">
      <div id="wpm" className="">
        WPM: {wpm ? wpm : "None"}
      </div>
      <div id="accuracy" className="">
        Accuracy: {accuracy ? `${accuracy}%` : "None"}
      </div>
      <div id="time-elapsed" className="">
        Time: {(time / 1000).toFixed(1)}s
      </div>
    </div>
  );
}

export default PlayerStats;
