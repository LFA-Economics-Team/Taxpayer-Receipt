"use client";

import { PropertyInputBlock } from "./PropertyInputBlock";
import { PropertyMapBlock } from "./PropertyMapBlock";
import { PropertyResultsBlock } from "./PropertyResultsBlock";
import { useAppContext } from "../../AppContext";
import { PropertyTutorial } from "../MetaMisc/Tutorials";

export function PropertyContent() {
  const {
    properties,
    addProperty,
    updateProperty,
    removeProperty,
    entities,
    tutorialOpen,
  } = useAppContext();

  return (
    <div className="flex flex-row overflow-hidden h-full w-full text-black">
      <PropertyInputBlock
        properties={properties}
        onAdd={addProperty}
        onUpdate={updateProperty}
        onRemove={removeProperty}
      />
      <PropertyMapBlock properties={properties} />
      <PropertyResultsBlock entities={entities} />
      {tutorialOpen && <PropertyTutorial />}
    </div>
  );
}
