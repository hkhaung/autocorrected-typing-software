function ProgressBar({ words, currentText }) {
  const typedWords = currentText.trim().split(' ');
  const totalWords = words.length;

  let completedWords = 0;
  for (let i = 0; i < typedWords.length; i++) {
    if (words[i] === typedWords[i]) {
      completedWords++;
    } else {
      break;
    }
  }

  const progressPercent = totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;


  return (
    <>
      <div className="flex justify-between items-center mb-3">
        <span className="text-sm font-medium text-gray-700">Progress</span>
        <span className="text-sm text-gray-500">
          {completedWords}/{totalWords} words ({progressPercent}% complete)
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-t-lg h-2 mb-0">
        <div
          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-t-lg transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        >
        </div>
      </div>
    </>
  );
};


export default ProgressBar;
