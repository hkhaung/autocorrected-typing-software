import "./SinglePlayer.css";
import { useState, useEffect } from "react";
import Words from "../Words/Words";
import TypingArea from "../TypingArea/TypingArea";
import PlayerStats from "../PlayerStats";


function SinglePlayer({ isSinglePlayer = true }) {
  const [currentText, setCurrentText] = useState("");
  const [timer, setTimer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reset, setReset] = useState(false);  // is a switch, bool vals not used
  const [wordsList, setWordsList] = useState([]);

  async function fetchWordsList() {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/get_words_list');
      const data = await res.json();
      setWordsList(data.words);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }

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
    fetchWordsList();
  }

  function handleSubmit() {
    if (isFinished) {

      handleReset();
    }
  }

  useEffect(() => {
    fetchWordsList();
  }, []);

  useEffect(() => {
    if (isFinished) {
      let btn = document.getElementById('submit-btn-disabled');
      btn.id = 'submit-btn-finished';
    } else {
      let btn = document.getElementById('submit-btn-finished');
      if (btn) {
        btn.id = 'submit-btn-disabled';
      }
    }
  }, [isFinished]);

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
          <button id="submit-btn-disabled" onClick={handleSubmit}>
            Submit
          </button>
          <button id="restart-btn" onClick={handleReset}>
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

export default SinglePlayer;
