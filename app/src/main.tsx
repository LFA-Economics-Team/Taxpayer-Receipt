import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import "leaflet/dist/leaflet.css";
import { Header } from "./components/MetaMisc/Header";
import { Footer } from "./components/MetaMisc/Footer";
import { HomeContent } from "./components/Home/HomeContent";
import { IncomeContent } from "./components/Income/IncomeContent";
import { SalesContent } from "./components/Sales/SalesContent";
import { PropertyContent } from "./components/Property/PropertyContent";
import { FeesFuelsContent } from "./components/FeesFuel/FeesFuelsContent";

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen w-screen justify-between">
        <Header />
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/income" element={<IncomeContent />} />
          <Route path="/sales" element={<SalesContent />} />
          <Route path="/property" element={<PropertyContent />} />
          <Route path="/fees" element={<FeesFuelsContent />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
