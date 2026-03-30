"use client";

import { NavBar } from "./NavBar";

export function Header() {
  return (
    <div className="flex flex-col  h-1/10 max-h-34 justify-start static">
      <div className="flex bg-[#ca9b54] h-1/3 items-center"></div>
      <div className="flex bg-[#47443e] h-2/3  rounded-b-xl ">
        <a href="https://le.utah.gov/" className="flex ">
          <img
            className="p-2 ml-12 rounded-xl hover:bg-[#5e5a52]"
            src="/assets/Leg Logo White.png"
            alt="logo"
          />{" "}
        </a>
        <NavBar />
      </div>
    </div>
  );
}
