import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div>
      <p className="text-white">Test</p>
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
