import { useState } from "react";
import "./App.css";
import PlayerStats from "./components/PlayerStats";
import Words from "./components/Words/Words";
import TypingArea from "./components/TypingArea/TypingArea";
import SinglePlayer from "./components/SinglePlayer/SinglePlayer";

function App() {
  const [isSinglePlayer, setIsSinglePlayer] = useState(true);

  return (
    <>
      <div className="gradient-bg"></div>

      <div className="main">
        <SinglePlayer isSinglePlayer={isSinglePlayer} />
      </div>
    </>
  );
}

export default App;
