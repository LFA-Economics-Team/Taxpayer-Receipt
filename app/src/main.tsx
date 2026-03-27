import { createRoot } from "react-dom/client";
import "./index.css";
import { HomeContent } from "./components/Home/HomeContent";
import { Header } from "./components/MetaMisc/Header";
import { Footer } from "./components/MetaMisc/Footer";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen justify-between">
      <Header />
      <HomeContent />
      <Footer />
    </div>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
