import "./App.css";
import SinglePlayer from "./components/SinglePlayer";

function App() {
  const background =
    "absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)] ";

  return (
    <>
      <div className={background + "min-h-screen bg-gray-50"}>
        <div className="max-w-4xl mx-auto py-18">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <SinglePlayer />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
