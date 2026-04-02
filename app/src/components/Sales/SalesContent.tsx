"use client";

import { InputBlock } from "./InputBlock";
import { SalesMapBlock } from "./SalesMapBlock";
import { SalesResultsBlock } from "./SalesResultsBlock";

export function SalesContent() {
  return (
    <div className="flex flex-row h-full w-full text-black">
      <InputBlock />
      <SalesMapBlock />
      <SalesResultsBlock />
    </div>
  );
}
