"use client";

import { RecieptSankey } from "./RecieptSankey";

export function SankeyBlock() {
  return (
    <div className="flex flex-col h-90vh w-3/5 place-content-center text-center my-2 rounded-xl shadow-xl/20 bg-[#e0e0e0]">
      <div>Sankey Block</div>
      <RecieptSankey />
    </div>
  );
}
