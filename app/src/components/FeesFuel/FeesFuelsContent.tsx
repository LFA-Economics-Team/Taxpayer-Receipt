"use client";

// Inputs for make, model, year, add vehilce

export function FeesFuelsContent() {
  return (
    <div className="flex flex-row h-full w-full gap-2">
      <div className="flex flex-col h-90vh w-1/2 bg-[#17301b]/90 my-2 ml-2 rounded-xl">
        {" "}
        Fuels
      </div>
      <div className="flex flex-col h-90vh w-1/2 bg-[#e0e0e0] text-black my-2 mr-2 rounded-xl">
        {" "}
        Fees
      </div>
    </div>
  );
}
