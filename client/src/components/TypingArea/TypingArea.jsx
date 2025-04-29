import './TypingArea.css';
import { useEffect, useRef, useState } from 'react';


function TypingArea({ onTypingStart, onTextChange, isFinished, setTimer }) {
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef(null);

  function handleInput() {
    if (!hasStarted) {
      setHasStarted(true);
      onTypingStart();
    }

    const text = inputRef.current.innerText;
    onTextChange(text);
  };

  function handleNewlines(e) {
    if (e.key === 'Enter') {
      e.preventDefault();  // Stops newlines from being added
    }
  };

  useEffect(() => {
    if (isFinished && inputRef.current) {
      inputRef.current.setAttribute('contenteditable', 'false');
      setTimer(false);
    }
  }, [isFinished, setTimer]);

  return (
    <div className="typing-area">
      <label htmlFor="typing-input" className="typing-label">And type them below:</label>
      <div
        id="typing-input"
        contentEditable={true}
        ref={inputRef}
        role="textbox"
        aria-placeholder="Start typing..."
        onInput={handleInput}
        onKeyDown={handleNewlines}
        className="typing-input"
        spellCheck={false}
      ></div>
    </div>
  );
}

export default TypingArea;
