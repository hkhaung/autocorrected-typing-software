import "./SinglePlayer.css";
import { useState, useEffect, useRef } from "react";
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

  const socket = useRef(null);
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
    if (!socket.current) {
      setupSocket();
    }
    setStartTimer(true);
  }

  function handleTextChange(text) {
    setCurrentText(text);
    const expectedLength = wordsList.join(" ").length;
    if (text.length >= expectedLength) {
      setIsFinished(true);
    }
    
    if (socket.current && socket.current.connected) {
      socket.current.emit("start_typing", { wordsList: wordsList, typed: text });
    }
  }

  function handleReset() {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
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
    if (socket.current || isFinished) return null;

    // const newSocket = io();
    const newSocket = io("http://127.0.0.1:5000", {
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["polling", "websocket"],
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    newSocket.on("wpm_acc_update", (data) => {
      setWpm(data.wpm);
      setAcc(data.acc);
    });

    newSocket.on("done", () => {
      setTimeout(() => {
        newSocket.disconnect();
        socket.current = null;
      }, 1000);
    });

    newSocket.on("timeout", (data) => {
      alert(data.message);
      handleReset();
    });

    socket.current = newSocket;
    return newSocket;
  }

  useEffect(() => {
    if (isFinished && socket) {
      socket.current.emit("finish_typing", { finished: true });
    }
  }, [isFinished, socket]);

  useEffect(() => {
    fetchWordsList();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
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
