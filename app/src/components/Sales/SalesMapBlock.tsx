import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import type { Feature } from "geojson";
import Sales2025 from "../../data/Geospacial/Sales2025.json";

function getColor(rate: number) {
  return rate > 0.085
    ? "#800026"
    : rate > 0.08
      ? "#BD0026"
      : rate > 0.075
        ? "#E31A1C"
        : rate > 0.07
          ? "#FC4E2A"
          : rate > 0.065
            ? "#FD8D3C"
            : "#FFEDA0";
}

function style(feature: Feature | undefined) {
  return {
    fillColor: getColor(feature?.properties?.CURRRATE ?? 0),
    weight: 1,
    color: "#555",
    fillOpacity: 0.7,
  };
}

export function SalesMapBlock() {
  return (
    <div className="flex flex-col h-90vh w-3/5 rounded-xl shadow-xl/20 overflow-hidden my-2">
      <MapContainer
        center={[39.5, -111.5]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={Sales2025 as GeoJSON.FeatureCollection}
          style={style}
          onEachFeature={(feature, layer) => {
            layer.bindPopup(
              `${feature.properties?.METRONAME}<br/>Rate: ${(feature.properties?.CURRRATE * 100).toFixed(2)}%`,
            );
          }}
        />
      </MapContainer>
    </div>
  );
}
