import { useEffect, useRef, useState } from "react";

function TypingArea({
  wordsList,
  onTypingStart,
  onTextChange,
  isFinished,
  setTimer,
  reset,
  autocorrect,
  setCurrentText,
}) {
  const [wordsListIndex, setWordsListIndex] = useState(0);
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

  function getCurrWordsListIndex(words) {
    if (!words.length) return 0;
    
    let i = 0;
    for (; i < words.length; i++) {
      if (wordsList[i] !== words[i]) {
        break;
      }
    }

    setWordsListIndex(i ? 0 : i - 1);
  }

  async function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();  // Stops newlines from being added
      return;
    }

    // Handle autocorrect when space is pressed
    if (e.key === " " && autocorrect) {
      const text = inputRef.current.textContent || "";
      const words = text.split(" ");
      
      // Get the current word (last word before the space)
      const currentWord = words[words.length - 1];
      getCurrWordsListIndex(words);

      if (currentWord && currentWord.trim().length > 0 && words[wordsListIndex] !== currentWord) {
        try {
          const res = await fetch("/api/autocorrect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ typed: currentWord }),
          });

          const data = await res.json();

          // If the word is corrected, update the content
          if (data.corrected_word && data.corrected_word !== currentWord) {            
            // Replace the last word with the corrected word
            words[words.length - 1] = data.corrected_word;
            const newText = words.join(" ");

            const el = inputRef.current;
            // Update the content of the div
            el.textContent = newText;
            
            // Move caret to the end and add the space
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            // Add the space that was just pressed
            el.textContent = newText + " ";
            
            // Move caret to end again
            range.selectNodeContents(el);
            range.collapse(false);
            selection.removeAllRanges();
            selection.addRange(range);

            setCurrentText(newText + " ");
            
            // Prevent the default space from being added
            e.preventDefault();
          }
        } catch (err) {
          console.error("Autocorrect error:", err);
        }
      }
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

  return (
    <div className="mb-6">
      <label htmlFor="typing-input"/>
      <div
        contentEditable={true}
        ref={inputRef}
        role="textbox"
        aria-placeholder="Start typing..."
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        className="text-[16px] w-full px-6 py-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-lg leading-relaxed"
        spellCheck={false}
        autoFocus
      ></div>
    </div>
  );
}

export default TypingArea;