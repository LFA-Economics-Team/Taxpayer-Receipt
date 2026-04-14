"use client";

import { useState, useMemo } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { SalesInputBlock } from "./SalesInputBlock";
import { SalesMapBlock } from "./SalesMapBlock";
import { SalesResultsBlock } from "./SalesResultsBlock";
import type {
  SalesLocation,
  SalesLocationWithFeature,
} from "../MetaMisc/types";
import Sales2025 from "../../data/Geospacial/Sales2025.json";

export function SalesContent() {
  const [locations, setLocations] = useState<SalesLocation[]>([]);

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? prev[prev.length - 1].id + 1 : 0,
        address: "",
        nonFoodSpending: 0,
        foodSpending: 0,
      },
    ]);
  };

  const updateLocation = (updated: SalesLocation) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l)),
    );
  };

  const removeLocation = (id: number) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const locationsWithFeatures = useMemo<SalesLocationWithFeature[]>(() => {
    const data = Sales2025 as GeoJSON.FeatureCollection;
    return locations
      .filter((l) => l.lat !== undefined && l.lon !== undefined)
      .map((l) => ({
        location: l,
        feature:
          data.features.find((f) =>
            booleanPointInPolygon(point([l.lon!, l.lat!]), f as any),
          ) ?? null,
      }));
  }, [locations]);

  return (
    <div className="flex flex-row h-full w-full text-black">
      <SalesInputBlock
        locations={locations}
        onAdd={addLocation}
        onUpdate={updateLocation}
        onRemove={removeLocation}
      />
      <SalesMapBlock locationsWithFeatures={locationsWithFeatures} />
      <SalesResultsBlock locationsWithFeatures={locationsWithFeatures} />
    </div>
  );
}
