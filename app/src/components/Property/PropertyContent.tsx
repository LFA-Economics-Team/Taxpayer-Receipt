"use client";

import { InputBlock } from "./InputBlock";
import { PropertyMapBlock } from "./PropertyMapBlock";
import { PropertyResultsBlock } from "./PropertyResultsBlock";

export function PropertyContent() {
  return (
    <div className="flex flex-row h-full w-full text-black">
      <InputBlock />
      <PropertyMapBlock />
      <PropertyResultsBlock />
    </div>
  );
}
