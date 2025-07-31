import './Words.css';
import ProgressBar from './ProgressBar';


function Words({ words, currentText }) {
  const typedWords = currentText.trim().split(' ');

  function renderHighlightedWord(word, wordIndex) {
    const typedWord = typedWords[wordIndex] || '';
    let mismatchCount = 0;

    for (let i = 0; i < word.length; i++) {
      if (typedWord[i] && typedWord[i] !== word[i]) {
        mismatchCount++;
      }
    }

    let wordClass = '';
    if (typedWord.length === word.length) {
      if (mismatchCount === 0) {
        wordClass = 'word-highlight-all-correct';
      } else if (mismatchCount === 1) {
        wordClass = 'word-highlight-one-wrong';
      } else {
        wordClass = 'word-highlight-multiple-wrong';
      }
    }

    return (
      <span key={wordIndex} className={wordClass} style={{ marginRight: '4px' }}>
        {word.split('').map((char, i) => {
          const typedChar = typedWord[i];
          let className = '';

          if (typedChar != null) {
            className = typedChar === char ? 'correct' : 'incorrect';
          } else if (wordIndex === typedWords.length - 1 && i === typedWord.length) {
            className = 'current animate-pulse';
          }

          return (
            <span key={i} className={className}>
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className='mb-6'>
      <ProgressBar words={words} currentText={currentText} />

      <div className='p-6 bg-gray-50 border-2 border-gray-200 border-t-0 rounded-b-lg leading-relaxed'>
        <div className='break-words whitespace-normal'>
          {words && words.map((word, wordIndex) => renderHighlightedWord(word, wordIndex))}
        </div>
      </div>
    </div>
  );
}

export default Words;
