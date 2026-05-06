import { NavLink } from "react-router-dom";
import { useAppContext } from "../../AppContext";

export function NavBar() {
  const { tutorialOpen, setTutorialOpen } = useAppContext();

  return (
    <div className="flex ml-8 text-xl flex-row justify-start w-2/4 min-w-120 font-bold">
      <NavLink to="/" end className="linkClass ">
        Taxpayer Receipt
      </NavLink>
      <div className="w-0.5 h-8 bg-white/80 ml-2 self-center rounded-full" />
      <div className="flex flex-row gap-4 pl-4">
        <NavLink to="/income" className="linkClass ">
          Income
        </NavLink>
        <NavLink to="/sales" className="linkClass ">
          Sales
        </NavLink>
        <NavLink to="/property" className="linkClass ">
          Property
        </NavLink>
        <NavLink to="/fees" className="linkClass ">
          Fuel & Fees
        </NavLink>
        <NavLink to="/leg" className="linkClass "></NavLink>
      </div>
      <button
        onClick={() => setTutorialOpen(!tutorialOpen)}
        className="linkClass ml-8"
      >
        User Guide
      </button>
    </div>
  );
}
