import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import { useState } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import Property2025 from "../../data/Geospacial/Property2025.json";
import type { Property } from "./types";

const DISCOVER_TOKEN = import.meta.env.VITE_DISCOVER_TOKEN;

const customIcon = L.divIcon({
  className: "",
  html: `<div style="font-size: 24px; line-height: 1;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

const ENTITY_DASH: Record<string, string> = {
  County: "",
  "County Assessing": "8 4",
  "Multicounty Assessing": "8 4 2 4",
  Municipality: "6 3",
  "School District": "2 4",
  "Special District": "10 4 2 4",
  PID: "4 2",
  "RDA or CDA": "12 6",
};

function getColor(rate: number) {
  const max = 0.15;
  const t = Math.min(rate / max, 1);
  const r = Math.round(173 + (10 - 173) * t);
  const g = Math.round(214 + (50 - 214) * t);
  const b = Math.round(255 + (150 - 255) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function style(feature: Feature | undefined) {
  return {
    fillColor: getColor(feature?.properties?.ENT_RATE ?? 0),
    weight: 2,
    color: "#555",
    dashArray: ENTITY_DASH[feature?.properties?.entity_type ?? ""] ?? "",
    fillOpacity: 0.4,
  };
}

function MapClickHandler({
  data,
  onFeaturesFound,
}: {
  data: GeoJSON.FeatureCollection;
  onFeaturesFound: (features: GeoJSON.Feature[], latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      const clicked = point([e.latlng.lng, e.latlng.lat]);
      const matches = data.features.filter((f) =>
        booleanPointInPolygon(clicked, f as any),
      );
      onFeaturesFound(matches, e.latlng);
    },
  });
  return null;
}

export function PropertyMapBlockHybrid({
  properties,
}: {
  properties: Property[];
}) {
  const [clickPopup, setClickPopup] = useState<{
    latlng: L.LatLng;
    features: GeoJSON.Feature[];
  } | null>(null);

  const geocodedProperties = properties.filter(
    (p) => p.lat !== undefined && p.lon !== undefined,
  );

  const filteredData: GeoJSON.FeatureCollection =
    geocodedProperties.length === 0
      ? (Property2025 as GeoJSON.FeatureCollection)
      : {
          ...(Property2025 as GeoJSON.FeatureCollection),
          features: (Property2025 as GeoJSON.FeatureCollection).features.filter(
            (feature) =>
              geocodedProperties.some((p) =>
                booleanPointInPolygon(point([p.lon!, p.lat!]), feature as any),
              ),
          ),
        };

  return (
    <div className="flex flex-col h-90vh w-3/5 rounded-xl shadow-xl/20 overflow-hidden my-2">
      <MapContainer
        center={[39.5, -111.5]}
        zoom={7}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url={`https://discover.agrc.utah.gov/login/path/${DISCOVER_TOKEN}/tiles/utah_hybrid/{z}/{x}/{y}`}
          attribution="&copy; <a href='https://gis.utah.gov'>UGRC</a>"
        />
        <GeoJSON
          key={geocodedProperties.map((p) => p.id).join(",")}
          data={filteredData}
          style={style}
        />
        <MapClickHandler
          data={filteredData}
          onFeaturesFound={(features, latlng) =>
            setClickPopup(features.length > 0 ? { latlng, features } : null)
          }
        />
        {clickPopup && (
          <Popup
            position={clickPopup.latlng}
            eventHandlers={{ remove: () => setClickPopup(null) }}
          >
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                minWidth: "200px",
              }}
            >
              <strong>
                {clickPopup.features.length} entities at this location
              </strong>
              {clickPopup.features.map((f, i) => (
                <div
                  key={i}
                  style={{
                    marginTop: "8px",
                    paddingTop: "8px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <div>
                    <strong>{f.properties?.ENT_DESC}</strong>
                  </div>
                  <div>{f.properties?.county} County</div>
                  <div>Type: {f.properties?.entity_type}</div>
                  <div>Rate: {(f.properties?.ENT_RATE * 100).toFixed(3)}%</div>
                </div>
              ))}
            </div>
          </Popup>
        )}
        {geocodedProperties.map((p) => (
          <Marker key={p.id} position={[p.lat!, p.lon!]} icon={customIcon}>
            <Popup>
              <strong>{p.address}</strong>
              <br />
              Value: ${p.value.toLocaleString()}
              <br />
              {p.prime ? "Primary Residence" : p.rent ? "Rental" : ""}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
