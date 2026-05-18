import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  useMapEvents,
  Pane,
} from "react-leaflet";
import type { Feature } from "geojson";
import L from "leaflet";
import { useState, useMemo } from "react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import Property2025 from "../../data/Geospacial/Property2025.json";
import {
  formatRateLabel,
  type Property,
  type PropertyFeatureProps,
} from "../MetaMisc/types";
import {
  UTAH_MAP_CENTER,
  UTAH_MAP_DEFAULT_ZOOM,
  getPropOpacity,
} from "../../AppContext";

type PropertyFC = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon,
  PropertyFeatureProps
>;

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

function fmtRate(rate: number, decimals = 3) {
  return (rate * 100).toFixed(decimals) + "%";
}

function fmtLiability(rate: number) {
  return "$" + (rate * 100000).toFixed(0);
}

function HighlightStyle() {
  return {
    color: "#ff6b00",
    weight: 3,
    fillColor: "#ff6b00",
    fillOpacity: 0.35,
  };
}

function style(feature: Feature | undefined) {
  return {
    fillColor: "#5576e0",
    weight: 1,
    color: "#555",
    dashArray: ENTITY_DASH[feature?.properties?.entity_type ?? ""] ?? "",
    fillOpacity: getPropOpacity(feature?.properties?.ENT_RATE ?? 0),
  };
}

function MapClickHandler({
  data,
  onFeaturesFound,
}: {
  data: PropertyFC;
  onFeaturesFound: (features: PropertyFC["features"], latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      const clicked = point([e.latlng.lng, e.latlng.lat]);
      const matches = data.features.filter((f) =>
        booleanPointInPolygon(clicked, f),
      );
      onFeaturesFound(matches, e.latlng);
    },
  });
  return null;
}

export function PropertyMapBlock({
  properties,
  hoveredEntityId,
}: {
  properties: Property[];
  hoveredEntityId: number | null;
}) {
  const [clickPopup, setClickPopup] = useState<{
    latlng: L.LatLng;
    features: PropertyFC["features"];
  } | null>(null);

  const geocodedProperties = properties.filter(
    (p) => p.lat !== undefined && p.lon !== undefined,
  );

  const typedData = Property2025 as PropertyFC;
  const filteredData: PropertyFC =
    geocodedProperties.length === 0
      ? typedData
      : {
          ...typedData,
          features: typedData.features.filter((feature) =>
            geocodedProperties.some((p) =>
              booleanPointInPolygon(point([p.lon!, p.lat!]), feature),
            ),
          ),
        };

  const hoveredFeature = useMemo(
    () =>
      hoveredEntityId !== null
        ? (filteredData.features.find(
            (f) => f.properties?.ENT_NBR === hoveredEntityId,
          ) ?? null)
        : null,
    [hoveredEntityId, filteredData],
  );

  return (
    <div className="flex flex-col h-90vh w-3/5 rounded-xl shadow-xl/20 overflow-hidden my-2">
      <MapContainer
        center={UTAH_MAP_CENTER}
        zoom={UTAH_MAP_DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://discover.agrc.utah.gov/login/path/gondola-toga-message-henry/tiles/lite_basemap/{z}/{x}/{y}.png" />
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
            maxWidth={450}
            minWidth={400}
          >
            <div className="text-sm">
              <div className="font-bold text-base mb-2 border-b pb-1">
                {clickPopup.features.length} Property Tax{" "}
                {clickPopup.features.length === 1 ? "Entity" : "Entities"}
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-1">Entity</th>
                    <th className="text-left p-1">Type</th>
                    <th className="text-right p-1">Rate</th>
                    <th className="text-right p-1">Tax Per $100K </th>
                  </tr>
                </thead>
                <tbody>
                  {clickPopup.features
                    .slice()
                    .sort((a, b) => (b.properties?.ENT_RATE ?? 0) - (a.properties?.ENT_RATE ?? 0))
                    .map((f, i) => (
                    <tr key={i} className="border-t border-gray-200">
                      <td className="p-1">
                        {formatRateLabel(f.properties?.ENT_DESC)}
                      </td>
                      <td className="p-1">{f.properties?.entity_type}</td>
                      <td className="p-1 text-right">
                        {fmtRate(f.properties?.ENT_RATE)}
                      </td>
                      <td className="p-1 text-right">
                        {fmtLiability(f.properties?.ENT_RATE)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              {p.prime ? "Primary Residence" : ""}
            </Popup>
          </Marker>
        ))}
        {hoveredFeature && (
          <Pane name="highlight-pane" style={{ zIndex: 451 }}>
            <GeoJSON key={hoveredEntityId!} data={hoveredFeature} style={HighlightStyle} />
          </Pane>
        )}
      </MapContainer>
    </div>
  );
}
