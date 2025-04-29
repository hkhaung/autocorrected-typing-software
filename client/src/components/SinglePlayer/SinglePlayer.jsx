import "./SinglePlayer.css";
import { useState, useEffect } from "react";
import Words from "../Words/Words";
import TypingArea from "../TypingArea/TypingArea";
import PlayerStats from "../PlayerStats";

const wordsList = ["hello", "world", "react", "rocks!"];

function SinglePlayer({ isSinglePlayer = true }) {
  const [currentText, setCurrentText] = useState("");
  const [timer, setTimer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reset, setReset] = useState(false);  // is a switch, bool vals not used

  function handleTypingStart() {
    setTimer(true);
  }

  function handleTextChange(text) {
    setCurrentText(text);
    const expectedLength = wordsList.join(" ").length;
    if (text.length >= expectedLength) {
      setIsFinished(true);
    }
  }

  function handleReset() {
    setCurrentText("");
    setTimer(false);
    setIsFinished(false);
    setReset(!reset);
  }

  return (
    <>
      <h1>Autocorrected Typing Software</h1>
      <PlayerStats timer={timer} reset={reset} />

      <div>
        <div className="words-typing-area">
          <Words words={wordsList} currentText={currentText} />
          <TypingArea
            onTypingStart={handleTypingStart}
            onTextChange={handleTextChange}
            isFinished={isFinished}
            setTimer={setTimer}
            reset={reset}
          />
        </div>

        <div className="typing-features">
          <div className="feature">
            <input type="checkbox" id="autocorrect" />
            <label htmlFor="autocorrect">Enable auto correct</label>
          </div>
        </div>

        <div className="buttons">
          <button id="restart-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default SinglePlayer;
