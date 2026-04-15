// Component for a map that find the taxing entities for a given legislative district
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature, Polygon, MultiPolygon } from "geojson";
import type { Layer, LeafletMouseEvent } from "leaflet";
import Sales2025 from "../../../data/Geospacial/Sales2025.json";
import Property2025 from "../../../data/Geospacial/Property2025.json";
import HouseDistricts from "../../../data/Geospacial/HouseDistricts.json";
import SeanteDistricts from "../../../data/Geospacial/SenateDistricts.json";
import { useState } from "react";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import Select from "react-select";
import { senateDistrictOptions, houseDistrictOptions } from "../types";

function Legstyle() {
  return {
    fillColor: false,
    weight: 1,
    color: "#555",
    fillOpacity: 0,
  };
}

function Propstyle() {
  return {
    fillColor: "#5576e0",
    weight: 0.2,
    color: "#5576e0",
    dashArray: "8 4",
    fillOpacity: 0.05,
  };
}

function Salestyle() {
  return {
    fillColor: "#642451",
    weight: 0.2,
    color: "#642451",
    dashArray: "2 2",

    fillOpacity: 0.05,
  };
}

function featureCentroid(feature: any): [number, number] {
  const coords =
    feature.geometry.type === "MultiPolygon"
      ? feature.geometry.coordinates[0][0]
      : feature.geometry.coordinates[0];
  const lons = coords.map((c: number[]) => c[0]);
  const lats = coords.map((c: number[]) => c[1]);
  return [
    lons.reduce((a: number, b: number) => a + b, 0) / lons.length,
    lats.reduce((a: number, b: number) => a + b, 0) / lats.length,
  ];
}

export function LegMap() {
  const [legType, setlegtype] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const handleLegType = () => {
    setlegtype(!legType);
    setSelectedDistrict(null);
  };

  const onEachDistrict = (
    feature: Feature<Polygon | MultiPolygon>,
    layer: Layer,
  ) => {
    layer.on("click", (e: LeafletMouseEvent) => {
      const clickedPoint = point([e.latlng.lng, e.latlng.lat]);

      const propEntities = (Property2025 as any).features
        .filter((f: any) => booleanPointInPolygon(clickedPoint, f))
        .map(
          (f: any) =>
            `${f.properties.ENT_DESC} (${(f.properties.ENT_RATE * 100).toFixed(4)}%)`,
        );

      const salesFeatures = (Sales2025 as any).features.filter((f: any) =>
        booleanPointInPolygon(clickedPoint, f),
      );

      const dist = feature.properties?.DIST;
      const distLabel = legType
        ? `House District ${dist}`
        : `Senate District ${dist}`;
      const salesList = salesFeatures.length
        ? salesFeatures
            .map(
              (f: any) =>
                `<li>${f.properties.SHORTDESC_x} — ${(f.properties.CURRRATE * 100).toFixed(2)}%</li>`,
            )
            .join("")
        : "<li>None found</li>";
      const propList = propEntities.length
        ? propEntities.map((e: string) => `<li>${e}</li>`).join("")
        : "<li>None found</li>";

      const popupHtml = `
        <div style="max-height:200px;overflow-y:auto;min-width:200px">
          <strong>${distLabel}</strong>
          <hr style="margin:4px 0"/>
          <div><strong>Sales Tax Areas:</strong></div>
          <ul style="margin:0 0 6px;padding-left:16px">${salesList}</ul>
          <div><strong>Property Tax Entities:</strong></div>
          <ul style="margin:0;padding-left:16px">${propList}</ul>
        </div>
      `;

      (layer as any).bindPopup(popupHtml).openPopup(e.latlng);
    });
  };

  const districtFeatures = legType
    ? (HouseDistricts as any).features
    : (SeanteDistricts as any).features;
  const selectedDistrictFeature =
    selectedDistrict !== null
      ? (districtFeatures.find(
          (f: any) => f.properties.DIST === selectedDistrict,
        ) ?? null)
      : null;

  const filterByDistrict = (features: any[]) => {
    if (!selectedDistrictFeature) return features;
    return features.filter((f: any) => {
      const [lon, lat] = featureCentroid(f);
      return booleanPointInPolygon(point([lon, lat]), selectedDistrictFeature);
    });
  };

  const filteredProperty = {
    type: "FeatureCollection" as const,
    features: filterByDistrict((Property2025 as any).features),
  };
  const filteredSales = {
    type: "FeatureCollection" as const,
    features: filterByDistrict((Sales2025 as any).features),
  };
  const filteredDistricts = {
    type: "FeatureCollection" as const,
    features: selectedDistrictFeature
      ? [selectedDistrictFeature]
      : districtFeatures,
  };

  return (
    <div className="flex h-full w-full text-black text-center p-2 gap-2">
      <div className="flex flex-col h-full bg-[#17301b]/90 w-1/5 rounded-xl p-2 text-white">
        <div className="text-2xl font-bold my-2 p-2"> Map Controls </div>
        <div>Senate or House District</div>
        <button onClick={handleLegType}>{legType ? "House" : "Senate"}</button>
        <div>District Select</div>
        {legType ? (
          <Select
            options={houseDistrictOptions}
            className="text-black w-1/2 place-self-center"
            value={
              houseDistrictOptions.find((o) => o.value === selectedDistrict) ??
              null
            }
            onChange={(opt) => setSelectedDistrict(opt ? opt.value : null)}
            isClearable
          />
        ) : (
          <Select
            options={senateDistrictOptions}
            className="text-black w-1/2 place-self-center"
            value={
              senateDistrictOptions.find((o) => o.value === selectedDistrict) ??
              null
            }
            onChange={(opt) => setSelectedDistrict(opt ? opt.value : null)}
            isClearable
          />
        )}
      </div>
      <div className="flex flex-col h-full w-3/5">
        <MapContainer
          center={[39.5, -111.5]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <GeoJSON
            key={`property-${selectedDistrict}`}
            data={filteredProperty}
            style={Propstyle}
          />
          <GeoJSON
            key={`sales-${selectedDistrict}`}
            data={filteredSales}
            style={Salestyle}
          />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {legType ? (
            <GeoJSON
              key={`house-${selectedDistrict}`}
              data={filteredDistricts}
              style={Legstyle}
              onEachFeature={onEachDistrict}
            />
          ) : (
            <GeoJSON
              key={`senate-${selectedDistrict}`}
              data={filteredDistricts}
              style={Legstyle}
              onEachFeature={onEachDistrict}
            />
          )}
        </MapContainer>
      </div>
      <div className="flex flex-col bg-[#e0e0e0] h-full w-1/5 rounded-xl p-2">
        <div className="text-2xl font-bold my-2 p-2">Taxing Juristictions</div>
        <div>Property Taxing Entities</div>
        <div> Sales Tax Areas</div>
      </div>
    </div>
  );
}
