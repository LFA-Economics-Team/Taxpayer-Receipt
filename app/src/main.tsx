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
import { LegMap } from "./components/MetaMisc/Extras/LegMap";
import { AppProvider } from "./AppContext";

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col h-screen w-screen justify-between">
          <Header />
          <Routes>
            <Route path="/" element={<HomeContent />} />
            <Route path="/income" element={<IncomeContent />} />
            <Route path="/sales" element={<SalesContent />} />
            <Route path="/property" element={<PropertyContent />} />
            <Route path="/fees" element={<FeesFuelsContent />} />
            <Route path="/leg" element={<LegMap />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

const rootEl = document.getElementById("root");
if (rootEl) {
  createRoot(rootEl).render(<App />);
}

export default App;
