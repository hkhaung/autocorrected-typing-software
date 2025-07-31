import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Words from "./Words/Words";
import TypingArea from "./TypingArea";
import PlayerStats from "./PlayerStats";
import Instructions from "./Instructions";

function SinglePlayer() {
  const [currentText, setCurrentText] = useState("");
  const [reset, setReset] = useState(false);  // is a switch, bool vals not used
  const [wordsList, setWordsList] = useState([]);
  const [expectedWords, setExpectedWords] = useState("");

  const socket = useRef(null);
  const [wpm, setWpm] = useState(null);
  const [acc, setAcc] = useState(null);
  const [startTimer, setStartTimer] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [autocorrect, setAutocorrect] = useState(false);

  async function fetchWordsList() {
    try {
      const res = await fetch("/api/get_words_list");
      const data = await res.json();
      setWordsList(data.words);
      setExpectedWords(data.words.join(" "));
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
    if (text === expectedWords) {
      setIsFinished(true);
    }

    if (socket.current && socket.current.connected) {
      socket.current.emit("start_typing", {
        wordsList: wordsList,
        typed: text,
      });
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
    setAutocorrect(false);
    setWpm(null);
    setAcc(null);
  }

  function handleNewText() {
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
    setCurrentText("");
    setStartTimer(false);
    setIsFinished(false);
    setReset(!reset);
    setAutocorrect(false);
    fetchWordsList();
    setWpm(null);
    setAcc(null);
  }

  function handleAutocorrect() {
    if (isFinished) {
      return;
    }
    setAutocorrect(!autocorrect);
  }

  function handleSubmit() {
    if (isFinished) {
      handleReset();
    }
  }

  function setupSocket() {
    if (socket.current || isFinished) return null;
    if (socket.current && socket.current.connected) return;

    const newSocket = io({
      reconnectionAttempts: 5,
      timeout: 10000,
      transports: ["polling", "websocket"],
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
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
    if (isFinished && socket.current && socket.current.connected) {
      socket.current.emit("finish_typing", { finished: true });
    }
  }, [isFinished, socket]);

  useEffect(() => {
    fetchWordsList();
  }, []);

  // when component unmounts, disconnect the socket
  useEffect(() => {
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        socket.current = null;
      }
    };
  }, []);

  return (
    <>
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Autocorrected Typing Software
        </h1>
      </div>

      <PlayerStats wpm={wpm} accuracy={acc} timer={startTimer} reset={reset} />

      <Words words={wordsList} currentText={currentText} />

      <TypingArea
        wordsList={wordsList}
        onTypingStart={handleTypingStart}
        onTextChange={handleTextChange}
        isFinished={isFinished}
        setTimer={setStartTimer}
        reset={reset}
        autocorrect={autocorrect}
        setCurrentText={setCurrentText}
      />

      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex">
          <label className="inline-flex items-center cursor-pointer">
            <span className="px-3">Enable autocorrect</span>
            <input
              type="checkbox"
              value=""
              className="sr-only peer"
              checked={autocorrect}
              onChange={handleAutocorrect}
            />
            <div className="relative w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500 dark:peer-checked:bg-blue-500"></div>
          </label>
        </div>

        <button
          className="flex items-center gap-2 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors"
          onClick={handleNewText}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="w-4 h-4 text-white"
            fill="currentColor"
          >
            <path d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
          </svg>
          New Text
        </button>

        <button
          className="flex items-center gap-2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={handleReset}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 640"
            className="w-4 h-4 text-white"
            fill="currentColor"
          >
            <path d="M88 256L232 256C241.7 256 250.5 250.2 254.2 241.2C257.9 232.2 255.9 221.9 249 215L202.3 168.3C277.6 109.7 386.6 115 455.8 184.2C530.8 259.2 530.8 380.7 455.8 455.7C380.8 530.7 259.3 530.7 184.3 455.7C174.1 445.5 165.3 434.4 157.9 422.7C148.4 407.8 128.6 403.4 113.7 412.9C98.8 422.4 94.4 442.2 103.9 457.1C113.7 472.7 125.4 487.5 139 501C239 601 401 601 501 501C601 401 601 239 501 139C406.8 44.7 257.3 39.3 156.7 122.8L105 71C98.1 64.2 87.8 62.1 78.8 65.8C69.8 69.5 64 78.3 64 88L64 232C64 245.3 74.7 256 88 256z" />
          </svg>
          Restart
        </button>
      </div>

      <Instructions />
    </>
  );
}

export default SinglePlayer;
