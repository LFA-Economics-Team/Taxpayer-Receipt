"use client";

import { useState } from "react";
import { InputBlock } from "./InputBlock";
import { PropertyMapBlock } from "./PropertyMapBlock";
//import { PropertyMapBlockHybrid } from "./PropertyMapBlockHybrid";
import { PropertyResultsBlock } from "./PropertyResultsBlock";
import type { Property } from "./types";

export function PropertyContent() {
  const [properties, setProperties] = useState<Property[]>([]);

  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      { id: prev.length + 1, address: "", value: 0, prime: false, rent: false },
    ]);
  };

  const updateProperty = (updated: Property) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === updated.id) return updated;
        return updated.prime ? { ...p, prime: false } : p;
      }),
    );
  };

  const removeProperty = (id: number) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="flex flex-row h-full w-full text-black">
      <InputBlock
        properties={properties}
        onAdd={addProperty}
        onUpdate={updateProperty}
        onRemove={removeProperty}
      />
      <PropertyMapBlock properties={properties} />
      <PropertyResultsBlock />
    </div>
  );
}
