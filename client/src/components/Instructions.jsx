function Instructions() {
  return (
    <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-semibold text-blue-800 mb-2">Instructions:</h4>
      <ul className="text-blue-700 text-sm space-y-1">
        <li>- Type the text as shown above</li>
        <li>- Green highlights show correct words</li>
        <li>- Yellow highlights show words with at least one incorrect character</li>
        <li>- Red highlights show errors</li>
        <li>- Your typing speed (WPM) and accuracy are calculated in real-time</li>
        <li>- Good luck!</li>
      </ul>
    </div>
  );
}

export default Instructions;
