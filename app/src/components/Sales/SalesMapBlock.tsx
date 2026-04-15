import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import Sales2025 from "../../data/Geospacial/Sales2025.json";
import {
  RATE_COMPONENTS,
  formatRateLabel,
  type SalesLocationWithFeature,
} from "../MetaMisc/types";

const customIcon = L.divIcon({
  className: "",
  html: `<div style="font-size: 24px; line-height: 1;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function getColor(rate: number) {
  return rate > 0.085
    ? "#642451"
    : rate > 0.08
      ? "#7E2D65"
      : rate > 0.075
        ? "#9B4580"
        : rate > 0.07
          ? "#BA749E"
          : rate > 0.065
            ? "#D8A8C4"
            : "#F5E3EF";
}

function style(feature: Feature | undefined) {
  return {
    fillColor: getColor(feature?.properties?.CURRRATE ?? 0),
    weight: 0.5,
    color: "#555",
    fillOpacity: 0.7,
  };
}

export function SalesMapBlock({
  locationsWithFeatures,
}: {
  locationsWithFeatures: SalesLocationWithFeature[];
}) {
  const matchedFeatureIds = new Set(
    locationsWithFeatures
      .filter((lf) => lf.feature !== null)
      .map((lf) => lf.feature!.properties?.TAXDIST),
  );

  const filteredData: GeoJSON.FeatureCollection =
    locationsWithFeatures.length === 0
      ? (Sales2025 as GeoJSON.FeatureCollection)
      : {
          ...(Sales2025 as GeoJSON.FeatureCollection),
          features: (Sales2025 as GeoJSON.FeatureCollection).features.filter(
            (f) => matchedFeatureIds.has(f.properties?.TAXDIST),
          ),
        };

  return (
    <div className="flex flex-col h-90vh w-3/5 rounded-xl shadow-xl/20 overflow-hidden my-2">
      <MapContainer
        center={[39.5, -111.5]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          key={locationsWithFeatures.map((lf) => lf.location.id).join(",")}
          data={filteredData}
          style={style}
          onEachFeature={(feature, layer) => {
            const p = feature.properties ?? {};
            const componentRows = RATE_COMPONENTS.filter(
              (key) => p[key] != null,
            )
              .map(
                (key) =>
                  `<tr><td style="padding-right:8px">${formatRateLabel(key)}</td><td style="text-align:right">${(p[key] * 100).toFixed(2)}%</td></tr>`,
              )
              .join("");
            layer.bindPopup(
              `<strong>${p.METRONAME}</strong><br/>
               <table style="margin-top:6px;font-size:12px;border-collapse:collapse">
                 ${componentRows}
                 <tr style="border-top:1px solid #ccc;font-weight:bold">
                   <td style="padding-right:8px;padding-top:4px">Total</td>
                   <td style="text-align:right;padding-top:4px">${(p.CURRRATE * 100).toFixed(2)}%</td>
                 </tr>
               </table>`,
            );
          }}
        />
        {locationsWithFeatures.map(({ location }) => (
          <Marker
            key={location.id}
            position={[location.lat!, location.lon!]}
            icon={customIcon}
          >
            <Popup>
              <strong>{location.address}</strong>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
