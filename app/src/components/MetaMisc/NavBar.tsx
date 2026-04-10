import { NavLink } from "react-router-dom";

const linkClass = () =>
  `flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52] `;

export function NavBar() {
  return (
    <div className="flex ml-8 text-xl flex-row justify-start  w-2/4 min-w-120 font-bold">
      <NavLink to="/" end className={linkClass}>
        Taxpayer Reciept
      </NavLink>
      <div className="w-0.5 h-8 bg-white/80 ml-2 self-center rounded-full" />
      <div className="flex flex-row gap-4 pl-4">
        <NavLink to="/income" className={linkClass}>
          Income
        </NavLink>
        <NavLink to="/sales" className={linkClass}>
          Sales
        </NavLink>
        <NavLink to="/property" className={linkClass}>
          Property
        </NavLink>
        <NavLink to="/fees" className={linkClass}>
          Fuel & Fees
        </NavLink>
        <NavLink to="/leg" className={linkClass}></NavLink>
      </div>
    </div>
  );
}
