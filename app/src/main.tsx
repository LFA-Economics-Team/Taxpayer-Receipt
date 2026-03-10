import { createRoot } from "react-dom/client";
import "./index.css";

import { TC_40 } from "./components/TC-40.tsx";

function App() {
  return (
    <div>
      <p className="text-white">Test</p>
      <TC_40 />
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
