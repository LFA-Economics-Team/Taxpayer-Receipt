"use client";

import { ControlBlock } from "./ControlBlock";
import { SankeyBlock } from "./SankeyBlock";
import { ResultsBlock } from "./ResultsBlock";

export function HomeContent() {
  return (
    <div className="flex flex-row h-full w-full text-black">
      <ControlBlock />
      <SankeyBlock />
      <ResultsBlock />
    </div>
  );
}
