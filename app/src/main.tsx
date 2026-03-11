import { createRoot } from "react-dom/client";
import "./index.css";

import { TC_40 } from "./components/Income/TC-40.tsx";

function App() {
  return (
    <div className="text-black">
      <TC_40 />
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
