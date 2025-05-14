import { useEffect, useRef, useState } from "react";

function TypingArea({
  onTypingStart,
  onTextChange,
  isFinished,
  setTimer,
  reset,
  autocorrect,
  setCurrentText,
}) {
  const [hasStarted, setHasStarted] = useState(false);
  const inputRef = useRef(null);

  function handleInput() {
    if (!hasStarted) {
      setHasStarted(true);
      onTypingStart();
    }

    const text = inputRef.current.innerText;
    onTextChange(text);
  }

  function handleNewlines(e) {
    if (e.key === "Enter") {
      e.preventDefault();  // Stops newlines from being added
    }
  }

  useEffect(() => {
    if (!inputRef.current) {
      return;
    }

    if (isFinished) {
      inputRef.current.setAttribute("contenteditable", "false");
      setTimer(false);
    }
  }, [isFinished, setTimer]);

  useEffect(() => {
    inputRef.current.innerHTML = "";
    inputRef.current.setAttribute("contenteditable", "true");
    setHasStarted(false);
  }, [reset]);

  useEffect(() => {
    async function handleAutocorrect() {
      // autocorrect last word when user inputs a space
      const text = inputRef.current.innerText;
      const words = text.split(" ");
      const lastChar = words[words.length - 1];

      if (lastChar === "" && words.length > 1) {
        const lastWord = words[words.length - 2];

        try {
          const res = await fetch("http://127.0.0.1:5000/api/autocorrect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ typed: lastWord }),
          });

          const data = await res.json();
          if (data.corrected_word && data.corrected_word !== lastWord) {
            words[words.length - 2] = data.corrected_word;
            const newText = words.join(" ");

            const el = inputRef.current;
            // Save selection position
            const selection = window.getSelection();
            const range = document.createRange();
            // Update the content
            el.innerText = newText;
            // Move caret to end
            range.selectNodeContents(el);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            setCurrentText(newText);
          }
        } catch (err) {
          console.error("Autocorrect error:", err);
        }
      }
    }

    if (autocorrect) {
      console.log("adding event listener");
      inputRef.current.addEventListener("input", handleAutocorrect);
    } else {
      console.log("removing event listener");
      inputRef.current.removeEventListener("input", handleAutocorrect);
    }
  }, [autocorrect, setCurrentText]);


  return (
    <div className="typing-area">
      <label htmlFor="typing-input" className="typing-label">
        And type them below:
      </label>
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
