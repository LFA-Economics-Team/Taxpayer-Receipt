import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Popup,
  useMapEvents,
} from "react-leaflet";
import Sales2025 from "../../../data/Geospacial/Sales2025.json";
import Property2025 from "../../../data/Geospacial/Property2025.json";
import HouseDistricts from "../../../data/Geospacial/HouseDistricts.json";
import SenateDistricts from "../../../data/Geospacial/SenateDistricts.json";
import { useState, useMemo } from "react";
import { point } from "@turf/helpers";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import DistrictIntersections from "../../../data/Geospacial/DistrictIntersections.json";
import type { Feature } from "geojson";
import Select from "react-select";
import {
  senateDistrictOptions,
  houseDistrictOptions,
  RATE_COMPONENTS,
  formatRateLabel,
  type PropertyFeatureProps,
  type SalesFeatureProps,
  type DistrictFeatureProps,
  type DistrictIntersectionsData,
} from "../types";
import {
  UTAH_MAP_CENTER,
  UTAH_MAP_DEFAULT_ZOOM,
  getPropOpacity,
  getSalesColor,
} from "../../../AppContext";

type PropertyFC = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon,
  PropertyFeatureProps
>;
type SalesFC = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon,
  SalesFeatureProps
>;
type DistrictFC = GeoJSON.FeatureCollection<
  GeoJSON.MultiPolygon,
  DistrictFeatureProps
>;

function Legstyle() {
  return {
    weight: 2,
    color: "#000000",
    fillOpacity: 0,
  };
}

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

function Propstyle(feature: Feature | undefined) {
  return {
    fillColor: "#5576e0",
    weight: 1,
    color: "#555",
    dashArray: ENTITY_DASH[feature?.properties?.entity_type ?? ""] ?? "",
    fillOpacity: getPropOpacity(feature?.properties?.ENT_RATE ?? 0),
  };
}

function Salestyle(feature: Feature | undefined) {
  return {
    fillColor: getSalesColor(feature?.properties?.CURRRATE ?? 0),
    weight: 1,
    color: "#555",
    fillOpacity: 0.7,
  };
}

function MapClickHandler({
  onClick,
}: {
  onClick: (latlng: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

function fmtRate(rate: number, decimals = 3) {
  return (rate * 100).toFixed(decimals) + "%";
}

export function LegMap() {
  const [legOn, setlegOn] = useState(true);
  const [legType, setlegtype] = useState(true);
  const [propOn, setPropOn] = useState(false);
  const [SalesOn, setSalesOn] = useState(false);
  const [selectedDistricts, setSelectedDistricts] = useState<number[]>([]);
  const [clickPoint, setClickPoint] = useState<[number, number] | null>(null);
  const [expandedSalesCards, setExpandedSalesCards] = useState<Set<number>>(
    new Set(),
  );
  const [propCardExpanded, setPropCardExpanded] = useState(false);

  const toggleSalesCard = (i: number) =>
    setExpandedSalesCards((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const allDistrictFeatures = (
    legType ? (HouseDistricts as DistrictFC) : (SenateDistricts as DistrictFC)
  ).features;

  const entitiesAtPoint = useMemo(() => {
    if (!clickPoint) return null;
    const pt = point([clickPoint[1], clickPoint[0]]);
    const propertyEntities = (Property2025 as PropertyFC).features
      .filter((f) => booleanPointInPolygon(pt, f))
      .sort((a, b) =>
        a.properties!.entity_type.localeCompare(b.properties!.entity_type),
      );
    const salesArea =
      (Sales2025 as SalesFC).features.find((f) =>
        booleanPointInPolygon(pt, f),
      ) ?? null;
    const districtFeature =
      allDistrictFeatures.find((f) => booleanPointInPolygon(pt, f)) ?? null;
    return { propertyEntities, salesArea, districtFeature };
  }, [clickPoint, legType]);

  const handleLegToggle = () => {
    setlegOn(!legOn);
  };

  const handleLegType = () => {
    setlegtype(!legType);
    setSelectedDistricts([]);
  };

  const handlePropToggle = () => {
    setPropOn(!propOn);
  };

  const handleSalesToggle = () => {
    setSalesOn(!SalesOn);
  };

  const filteredProperty = useMemo(() => {
    if (selectedDistricts.length === 0) return Property2025 as PropertyFC;
    const key = legType ? "house" : "senate";
    const indices = new Set(
      selectedDistricts.flatMap(
        (d) =>
          (DistrictIntersections as DistrictIntersectionsData)[key].property[
            String(d)
          ] ?? [],
      ),
    );
    return {
      type: "FeatureCollection" as const,
      features: (Property2025 as PropertyFC).features
        .filter((_, i) => indices.has(i))
        .sort((a, b) =>
          a.properties!.entity_type.localeCompare(b.properties!.entity_type),
        ),
    };
  }, [selectedDistricts, legType]);

  const filteredSales = useMemo(() => {
    if (selectedDistricts.length === 0) return Sales2025 as SalesFC;
    const key = legType ? "house" : "senate";
    const indices = new Set(
      selectedDistricts.flatMap(
        (d) =>
          (DistrictIntersections as DistrictIntersectionsData)[key].sales[
            String(d)
          ] ?? [],
      ),
    );
    return {
      type: "FeatureCollection" as const,
      features: (Sales2025 as SalesFC).features.filter((_, i) =>
        indices.has(i),
      ),
    };
  }, [selectedDistricts, legType]);

  const filteredDistricts = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features:
        selectedDistricts.length > 0
          ? allDistrictFeatures.filter((f: any) =>
              selectedDistricts.includes(f.properties.DIST),
            )
          : allDistrictFeatures,
    }),
    [selectedDistricts, legType],
  );

  return (
    <div className="flex h-full w-full text-black text-center p-2 gap-2 overflow-hidden">
      <div className="flex flex-col h-full bg-[#17301b]/90 w-1/5 rounded-xl p-2 text-white gap-2">
        <div className="text-xl font-bold p-2"> Map Controls </div>

        <div className="flex flex-col text-sm bg-gray-100/25 p-2 gap-2 rounded-xl">
          <div className="text-base font-bold underline">
            {" "}
            Legislative Boundaries
          </div>

          <div className="flex flex-row justify-around">
            <button onClick={handleLegType}>
              {legType ? "House" : "Senate"}
            </button>{" "}
            {legType ? (
              <Select
                isMulti
                options={houseDistrictOptions}
                className="text-black place-self-center"
                placeholder={"District"}
                value={houseDistrictOptions.filter((o) =>
                  selectedDistricts.includes(o.value),
                )}
                onChange={(opts) =>
                  setSelectedDistricts(opts ? opts.map((o) => o.value) : [])
                }
                isClearable
              />
            ) : (
              <Select
                isMulti
                options={senateDistrictOptions}
                className="text-black place-self-center"
                placeholder={"District"}
                value={senateDistrictOptions.filter((o) =>
                  selectedDistricts.includes(o.value),
                )}
                onChange={(opts) =>
                  setSelectedDistricts(opts ? opts.map((o) => o.value) : [])
                }
                isClearable
              />
            )}
          </div>
        </div>

        <div className="flex flex-col bg-gray-100/25 rounded-xl p-2 gap-2 text-sm">
          <div className="text-base font-bold underline">Map Layers</div>
          <div className=" flex flex-row gap-2 justify-around">
            <button onClick={handleLegToggle}>
              {" "}
              Legislative District: {legOn ? "On" : "Off"}
            </button>
            <button onClick={handlePropToggle}>
              {" "}
              Property Entities: {propOn ? "On" : "Off"}
            </button>
            <button onClick={handleSalesToggle}>
              {" "}
              Sales Areas: {SalesOn ? "On" : "Off"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col h-full w-3/5">
        <MapContainer
          center={UTAH_MAP_CENTER}
          zoom={UTAH_MAP_DEFAULT_ZOOM}
          style={{ height: "100%", width: "100%" }}
        >
          {propOn ? (
            <GeoJSON
              key={`property-${selectedDistricts.join(",")}`}
              data={filteredProperty}
              style={Propstyle}
            />
          ) : (
            <></>
          )}
          {SalesOn ? (
            <GeoJSON
              key={`sales-${selectedDistricts.join(",")}`}
              data={filteredSales}
              style={Salestyle}
            />
          ) : (
            <></>
          )}
          <TileLayer url="https://discover.agrc.utah.gov/login/path/gondola-toga-message-henry/tiles/lite_basemap/{z}/{x}/{y}.png" />
          <MapClickHandler onClick={setClickPoint} />
          {clickPoint && entitiesAtPoint && (
            <Popup
              position={clickPoint}
              eventHandlers={{ remove: () => setClickPoint(null) }}
              maxWidth={300}
            >
              <div className="text-sm" style={{ minWidth: 220 }}>
                <div className="font-bold text-base mb-2 border-b pb-1">
                  {legType ? "House" : "Senate"} District{" "}
                  {entitiesAtPoint.districtFeature?.properties?.DIST ?? "—"}
                </div>
                {SalesOn && (
                  <div className="font-bold text-base mb-1">Sales Tax Area</div>
                )}
                {SalesOn && entitiesAtPoint.salesArea ? (
                  <div className="mb-2">
                    <div className="font-medium mb-1">
                      {entitiesAtPoint.salesArea.properties.SHORTDESC_x}
                    </div>
                    <table className="w-full text-xs border-collapse">
                      <tbody>
                        {RATE_COMPONENTS.filter(
                          (k) =>
                            entitiesAtPoint.salesArea.properties[k] != null &&
                            entitiesAtPoint.salesArea.properties[k] !== 0,
                        ).map((k) => (
                          <tr key={k} className="border-t border-gray-200">
                            <td className="p-1">{formatRateLabel(k)}</td>
                            <td className="p-1 text-right">
                              {fmtRate(
                                entitiesAtPoint.salesArea.properties[k],
                                2,
                              )}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t-2 border-gray-400 font-semibold">
                          <td className="p-1">Total</td>
                          <td className="p-1 text-right">
                            {fmtRate(
                              entitiesAtPoint.salesArea.properties.CURRRATE,
                              2,
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  SalesOn && (
                    <div className="text-gray-500 italic mb-2">None found</div>
                  )
                )}
                {propOn && (
                  <div className="font-bold text-base mb-1">
                    Property Tax Entities
                  </div>
                )}
                {propOn &&
                  (entitiesAtPoint.propertyEntities.length === 0 ? (
                    <div className="text-gray-500 italic">None found</div>
                  ) : (
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left p-1">Entity</th>
                          <th className="text-left p-1">Type</th>
                          <th className="text-right p-1">Rate</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entitiesAtPoint.propertyEntities.map(
                          (f: any, i: number) => (
                            <tr key={i} className="border-t border-gray-200">
                              <td className="p-1">
                                {formatRateLabel(f.properties.ENT_DESC)}
                              </td>
                              <td className="p-1">
                                {f.properties.entity_type}
                              </td>
                              <td className="p-1 text-right">
                                {fmtRate(f.properties.ENT_RATE)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  ))}
              </div>
            </Popup>
          )}
          {legOn ? (
            legType ? (
              <GeoJSON
                key={`house-${selectedDistricts.join(",")}`}
                data={filteredDistricts}
                style={Legstyle}
              />
            ) : (
              <GeoJSON
                key={`senate-${selectedDistricts.join(",")}`}
                data={filteredDistricts}
                style={Legstyle}
              />
            )
          ) : (
            <></>
          )}
        </MapContainer>
      </div>

      <div className="flex flex-col bg-[#e0e0e0] h-full min-h-0 w-1/5 rounded-xl p-2 overflow-y-auto">
        <div className="text-xl font-bold my-2 p-2">Taxing Jurisdictions</div>
        {selectedDistricts.length === 0 ? (
          <div className="text-sm text-gray-500 italic px-2">
            Select one or more districts to the left to see your taxing
            jurisdictions.
          </div>
        ) : (
          <>
            {SalesOn && (
              <>
                <div className="font-bold text-base px-2 mb-1">
                  Sales Tax Areas
                </div>
                <div className="flex flex-row justify-center text-xs font-bold">
                  {filteredSales.features.length} Sales Tax Areas
                </div>

                {filteredSales.features.length === 0 ? (
                  <div className="text-sm text-gray-500 italic px-2 mb-2">
                    None found
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mb-3">
                    {filteredSales.features.map((f: any, i: number) => {
                      const isExpanded = expandedSalesCards.has(i);
                      const activeComponents = RATE_COMPONENTS.filter(
                        (key) => f.properties[key] != null,
                      );
                      return (
                        <div
                          key={i}
                          className="bg-white rounded-xl p-2 cursor-pointer select-none"
                          onClick={() => toggleSalesCard(i)}
                        >
                          <div className="flex flex-row justify-between text-xs font-bold">
                            <div>{f.properties.SHORTDESC_x}</div>
                            <div>{fmtRate(f.properties.CURRRATE, 2)}</div>
                          </div>
                          {isExpanded && (
                            <div className="mt-1">
                              {activeComponents.map((key) => (
                                <div
                                  key={key}
                                  className="flex flex-row justify-between text-xs py-0.5 border-t border-gray-200"
                                >
                                  <div className="text-gray-500">
                                    {formatRateLabel(key)}
                                  </div>
                                  <div>{fmtRate(f.properties[key], 2)}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
            {propOn && (
              <>
                {filteredProperty.features.length === 0 ? (
                  <div className="text-sm text-gray-500 italic px-2">
                    None found
                  </div>
                ) : (
                  <>
                    <div className="font-bold text-base px-2 mb-1">
                      {" "}
                      Property Tax Entities
                    </div>
                    <div
                      className="bg-white rounded-xl p-2 flex flex-col cursor-pointer select-none"
                      onClick={() => setPropCardExpanded((prev) => !prev)}
                    >
                      <div className="flex flex-row justify-center text-xs font-bold">
                        {filteredProperty.features.length} Property Tax entities
                      </div>
                      {propCardExpanded && (
                        <div className="mt-1">
                          {filteredProperty.features.map(
                            (f: any, i: number) => (
                              <div
                                key={i}
                                className="grid grid-cols-[50%_35%_15%] text-xs py-1 border-t border-gray-200"
                              >
                                <div className="font-semibold">
                                  {formatRateLabel(f.properties.ENT_DESC)}
                                </div>
                                <div className="text-gray-500">
                                  {f.properties.entity_type}
                                </div>
                                <div>{fmtRate(f.properties.ENT_RATE)}</div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
