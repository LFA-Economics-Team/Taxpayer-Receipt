export type SalesLocation = {
  id: number;
  address: string;
  nonFoodSpending: number;
  foodSpending: number;
  lat?: number;
  lon?: number;
};

export type SalesLocationWithFeature = {
  location: SalesLocation;
  feature: GeoJSON.Feature | null;
};

export const RATE_COMPONENTS = [
  "STATE SALES AND USE TAX",
  "LOCAL SALES AND USE TAX",
  "COUNTY OPTION SALES TAX",
  "MASS TRANSIT TAX",
  "ADDITIONAL MASS TRANSIT TAX",
  "MASS TRANSIT FIXED GUIDEWAY TAX",
  "COUNTY OPTION TRANSPORTATION TAX",
  "HIGHWAYS TAX",
  "COUNTY AIRPORT, HIGHWAY, PUBLIC TRANSIT TAX",
  "TRANSPORTATION INFRUSTRUCTURE TAX",
  "COUNTY PUBLIC TRANSIT",
  "SUPPLEMENTAL STATE SALES AND USE TAX",
  "RURAL HOSPITAL TAX",
  "BOTANICAL, CULTURAL, ZOO TAX",
  "TOWN OPTION TAX",
  "CITY OR TOWN OPTION TAX",
  "RESORT COMMUNITY TAX",
  "CORRECTIONAL FACILITY TAX",
  "CAPITAL CITY REVITALIZATION TAX",
  "EMERGENCY SERVICES TAX",
];

export const formatRateLabel = (key: string) =>
  key.charAt(0) + key.slice(1).toLowerCase();

export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  miles: number;
  mpg: number;
  fueltype: string;
  county: string;
};

export type Property = {
  id: number;
  address: string;
  value: number;
  prime: boolean;
  rent: boolean;
  liability?: number;
  lat?: number;
  lon?: number;
};

export type Entity = {
  id: number;
  name: string;
  type: string;
  county: string;
  rate: number;
  value: number;
  liability: number;
};

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}
