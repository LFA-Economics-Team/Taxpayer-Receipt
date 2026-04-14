"use client";

import { useState, useMemo } from "react";
import { PropertyInputBlock } from "./PropertyInputBlock";
import { PropertyMapBlock } from "./PropertyMapBlock";
import { PropertyResultsBlock } from "./PropertyResultsBlock";
import type { Property, Entity } from "../MetaMisc/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import Property2025 from "../../data/Geospacial/Property2025.json";

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

  const entities = useMemo<Entity[]>(() => {
    const geocoded = properties.filter(
      (p) => p.lat !== undefined && p.lon !== undefined && p.value > 0,
    );
    if (geocoded.length === 0) return [];

    const data = Property2025 as GeoJSON.FeatureCollection;
    const results: Entity[] = [];

    for (const feature of data.features) {
      const props = feature.properties;
      if (!props) continue;

      const rate: number = props.ENT_RATE ?? 0;
      let totalValue = 0;

      for (const prop of geocoded) {
        const pt = point([prop.lon!, prop.lat!]);
        if (booleanPointInPolygon(pt, feature as any)) {
          totalValue += prop.prime ? prop.value * 0.55 : prop.value; // this applies the primary residential exemption by scaling the property value to 55% of the user input.
        }
      }

      if (totalValue > 0) {
        results.push({
          id: props.ENT_NBR,
          name: props.ENT_DESC,
          type: props.entity_type,
          county: props.county,
          rate,
          value: totalValue,
          liability: rate * totalValue,
        });
      }
    }

    return results.sort((a, b) => b.liability - a.liability);
  }, [properties]);

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
    </div>
  );
}
