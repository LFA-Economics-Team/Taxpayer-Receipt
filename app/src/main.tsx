import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="flex-col text-black h-screen w-screen">
      <p>Test</p>
      <div className="w-full h-1/10 bg-blue-500"> Test 2</div>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
