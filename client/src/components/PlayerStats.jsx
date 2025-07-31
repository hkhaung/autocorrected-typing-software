import { useState, useEffect } from "react";

function PlayerStats({ wpm, accuracy, timer, errors, reset }) {
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
    setTime(null);
  }, [reset]);

  return (
    <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-blue-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-blue-600">
          {wpm ? wpm : 0}
        </div>
        <div className="text-sm text-blue-500">WPM</div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-green-600">
          {accuracy ? `${accuracy}%` : "100%"}
        </div>
        <div className="text-sm text-green-500">Accuracy</div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg text-center">
        <div className="text-2xl font-bold text-purple-600">
          {(time / 1000).toFixed(1)}s
        </div>
        <div className="text-sm text-purple-500">Time Elapsed</div>
      </div>
    </div>
  );
}

export default PlayerStats;
