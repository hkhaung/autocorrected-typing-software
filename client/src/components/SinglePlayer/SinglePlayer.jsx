import "./SinglePlayer.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Words from "../Words/Words";
import TypingArea from "../TypingArea/TypingArea";
import PlayerStats from "../PlayerStats";

function SinglePlayer({ isSinglePlayer = true }) {
  const [currentText, setCurrentText] = useState("");
  const [startTimer, setStartTimer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [reset, setReset] = useState(false); // is a switch, bool vals not used
  const [wordsList, setWordsList] = useState([]);

  const [socket, setSocket] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [acc, setAcc] = useState(null);

  async function fetchWordsList() {
    try {
      const res = await fetch("http://127.0.0.1:5000/api/get_words_list");
      const data = await res.json();
      setWordsList(data.words);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }

  function handleTypingStart() {
    if (!socket) {
      setupSocket();
    }
    setStartTimer(true);
  }

  function handleTextChange(text) {
    setCurrentText(text);
    const expectedLength = wordsList.join(" ").length;
    if (text.length >= expectedLength) {
      setIsFinished(true);
    } else if (socket && socket.connected) {
      console.log("sending start_typing", text);
      socket.emit("start_typing", { typed: text });
    }
  }

  function handleReset() {
    if (socket) {
      socket.disconnect();
      setSocket(null);
    }
    setCurrentText("");
    setStartTimer(false);
    setIsFinished(false);
    setReset(!reset);
    fetchWordsList();
    setWpm(null);
    setAcc(null);
  }

  function handleSubmit() {
    if (isFinished) {
      handleReset();
    }
  }

  function setupSocket() {
    if (socket) return null;

    // const newSocket = io();
    const newSocket = io("http://127.0.0.1:5000", {
      reconnectionAttempts: 5,
      timeout: 20000,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("wpm_update", (data) => {
      console.log("WPM update received:", data.wpm);
      setWpm(data.wpm);
    });

    newSocket.on("timeout", (data) => {
      alert(data.message);
      handleReset();
    });

    setSocket(newSocket);
    return newSocket;
  }

  useEffect(() => {
    fetchWordsList();
  }, []);

  useEffect(() => {
    if (isFinished) {
      let btn = document.getElementById("submit-btn-disabled");
      btn.id = "submit-btn-finished";
    } else {
      let btn = document.getElementById("submit-btn-finished");
      if (btn) {
        btn.id = "submit-btn-disabled";
      }
    }
  }, [isFinished]);

  useEffect(() => {
    if (isFinished && socket) {
      socket.emit("finish_typing", { finished: true }, () => {
        socket.disconnect();
        setSocket(null);
      });
    }
  }, [isFinished, socket]);

  return (
    <>
      <h1>Autocorrected Typing Software</h1>
      <PlayerStats wpm={wpm} accuracy={acc} timer={startTimer} reset={reset} />

      <div>
        <div className="words-typing-area">
          <Words words={wordsList} currentText={currentText} />
          <TypingArea
            onTypingStart={handleTypingStart}
            onTextChange={handleTextChange}
            isFinished={isFinished}
            setTimer={setStartTimer}
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
