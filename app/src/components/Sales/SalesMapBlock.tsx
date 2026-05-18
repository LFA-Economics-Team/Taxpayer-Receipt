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
import Sales2025 from "../../data/Geospacial/Sales2025.json";
import {
  RATE_COMPONENTS,
  formatRateLabel,
  type SalesFeatureProps,
  type SalesLocationWithFeature,
} from "../MetaMisc/types";
import {
  UTAH_MAP_CENTER,
  UTAH_MAP_DEFAULT_ZOOM,
  getSalesColor,
} from "../../AppContext";

type SalesFC = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon,
  SalesFeatureProps
>;

type SalesFeature = SalesFC["features"][number];

function fmtRate(rate: number, decimals = 2) {
  return (rate * 100).toFixed(decimals) + "%";
}

function fmtLiability(rate: number) {
  return "$" + (rate * 1000).toFixed(2);
}

function MapClickHandler({
  data,
  onFeatureFound,
}: {
  data: SalesFC;
  onFeatureFound: (feature: SalesFeature | null, latlng: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      const clicked = point([e.latlng.lng, e.latlng.lat]);
      const match =
        data.features.find((f) => booleanPointInPolygon(clicked, f)) ?? null;
      onFeatureFound(match, e.latlng);
    },
  });
  return null;
}

const customIcon = L.divIcon({
  className: "",
  html: `<div style="font-size: 24px; line-height: 1;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

function style(
  feature: GeoJSON.Feature<GeoJSON.MultiPolygon, SalesFeatureProps> | undefined,
) {
  return {
    fillColor: getSalesColor(feature?.properties?.CURRRATE ?? 0),
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
  const [clickPopup, setClickPopup] = useState<{
    latlng: L.LatLng;
    feature: SalesFeature;
  } | null>(null);

  const matchedFeatureIds = new Set(
    locationsWithFeatures
      .filter((lf) => lf.feature !== null)
      .map((lf) => lf.feature!.properties?.TAXDIST),
  );

  const typedData = Sales2025 as SalesFC;
  const filteredData: SalesFC =
    locationsWithFeatures.length === 0
      ? typedData
      : {
          ...typedData,
          features: typedData.features.filter((f) =>
            matchedFeatureIds.has(f.properties?.TAXDIST),
          ),
        };

  return (
    <div className="flex flex-col h-90vh w-3/5 rounded-xl shadow-xl/20 overflow-hidden my-2">
      <MapContainer
        center={UTAH_MAP_CENTER}
        zoom={UTAH_MAP_DEFAULT_ZOOM}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://discover.agrc.utah.gov/login/path/gondola-toga-message-henry/tiles/lite_basemap/{z}/{x}/{y}.png" />
        <GeoJSON
          key={locationsWithFeatures.map((lf) => lf.location.id).join(",")}
          data={filteredData}
          style={style}
        />
        <MapClickHandler
          data={filteredData}
          onFeatureFound={(feature, latlng) =>
            setClickPopup(feature ? { latlng, feature } : null)
          }
        />
        {clickPopup && (
          <Popup
            position={clickPopup.latlng}
            eventHandlers={{ remove: () => setClickPopup(null) }}
            maxWidth={300}
          >
            <div className="text-sm" style={{ minWidth: 220 }}>
              <div className="font-bold text-base mb-2 border-b pb-1">
                {clickPopup.feature.properties.SHORTDESC_x}
              </div>
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-1">Component</th>
                    <th className="text-right p-1">Rate</th>
                    <th className="text-right p-1">Tax Per $1,000</th>
                  </tr>
                </thead>
                <tbody>
                  {RATE_COMPONENTS.filter(
                    (k) =>
                      clickPopup.feature.properties[k] != null &&
                      clickPopup.feature.properties[k] !== 0,
                  ).map((k) => (
                    <tr key={k} className="border-t border-gray-200">
                      <td className="p-1">{formatRateLabel(k)}</td>
                      <td className="p-1 text-right">
                        {fmtRate(clickPopup.feature.properties[k])}
                      </td>
                      <td className="p-1 text-right">
                        {fmtLiability(clickPopup.feature.properties[k])}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-400 font-semibold">
                    <td className="p-1">Total</td>
                    <td className="p-1 text-right">
                      {fmtRate(clickPopup.feature.properties.CURRRATE)}
                    </td>
                    <td className="p-1 text-right">
                      {fmtLiability(clickPopup.feature.properties.CURRRATE)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Popup>
        )}
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
