import './SinglePlayer.css';
import { useState, useEffect } from "react";
import Words from "../Words/Words";
import TypingArea from "../TypingArea/TypingArea";
import PlayerStats from "../PlayerStats";

const wordsList = ["hello", "world", "react", "rocks!"];

function SinglePlayer({ isSinglePlayer = true }) {
  const [currentText, setCurrentText] = useState("");
  const [timer, setTimer] = useState(false);

  const expectedLength = wordsList.join(" ").length;
  const isFinished = currentText.length >= expectedLength;

  function handleTypingStart() {
    setTimer(true);
  }

  function handleTextChange(text) {
    setCurrentText(text);
  }

  return (
    <>
      <h1>Autocorrected Typing Software</h1>
      <PlayerStats isTypingStarted={timer} />

      <div>
        <div className="words-typing-area">
          <Words words={wordsList} currentText={currentText} />
          <TypingArea
            onTypingStart={handleTypingStart}
            onTextChange={handleTextChange}
            isFinished={isFinished}
            setTimer={setTimer}
          />
        </div>

        <div className="typing-features">
          <div className="feature">
            <input type="checkbox" id="autocorrect" />
            <label htmlFor="autocorrect">Enable auto correct</label>
          </div>
        </div>

        <div className="buttons">
          <button id="restart-btn">Restart</button>
        </div>
      </div>
    </>
  );
}

export default SinglePlayer;
