// Income Tax

export type IncomeInfo = {
  annualIncome: number;
  filingStatus: string;
  incomeTile: number;
};

export const filingOptions = [
  { value: "Single", label: "Single" },
  { value: "Married Filing Single", label: "Married Filing Single" },
  { value: "Married Filing Jointly", label: "Married Filing Jointly" },
  { value: "Head of Household", label: "Head of Household" },
  {
    value: " Qualifying surviving spouse",
    label: " Qualifying surviving spouse",
  },
];

export const dependentOptions = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: "10 or more" },
];

// Sales Tax

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

// Property Tax

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

// Fuel & Fees

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

// Misc

export const senateDistrictOptions = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: 11, label: 11 },
  { value: 12, label: 12 },
  { value: 13, label: 13 },
  { value: 14, label: 14 },
  { value: 15, label: 15 },
  { value: 16, label: 16 },
  { value: 17, label: 17 },
  { value: 18, label: 18 },
  { value: 19, label: 19 },
  { value: 20, label: 20 },
  { value: 21, label: 21 },
  { value: 22, label: 22 },
  { value: 23, label: 23 },
  { value: 24, label: 24 },
  { value: 25, label: 25 },
  { value: 26, label: 26 },
  { value: 27, label: 27 },
  { value: 28, label: 28 },
  { value: 29, label: 29 },
];

export const houseDistrictOptions = [
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
  { value: 6, label: 6 },
  { value: 7, label: 7 },
  { value: 8, label: 8 },
  { value: 9, label: 9 },
  { value: 10, label: 10 },
  { value: 11, label: 11 },
  { value: 12, label: 12 },
  { value: 13, label: 13 },
  { value: 14, label: 14 },
  { value: 15, label: 15 },
  { value: 16, label: 16 },
  { value: 17, label: 17 },
  { value: 18, label: 18 },
  { value: 19, label: 19 },
  { value: 20, label: 20 },
  { value: 21, label: 21 },
  { value: 22, label: 22 },
  { value: 23, label: 23 },
  { value: 24, label: 24 },
  { value: 25, label: 25 },
  { value: 26, label: 26 },
  { value: 27, label: 27 },
  { value: 28, label: 28 },
  { value: 29, label: 29 },
  { value: 30, label: 30 },
  { value: 31, label: 31 },
  { value: 32, label: 32 },
  { value: 33, label: 33 },
  { value: 34, label: 34 },
  { value: 35, label: 35 },
  { value: 36, label: 36 },
  { value: 37, label: 37 },
  { value: 38, label: 38 },
  { value: 39, label: 39 },
  { value: 40, label: 40 },
  { value: 41, label: 41 },
  { value: 42, label: 42 },
  { value: 43, label: 43 },
  { value: 44, label: 44 },
  { value: 45, label: 45 },
  { value: 46, label: 46 },
  { value: 47, label: 47 },
  { value: 48, label: 48 },
  { value: 49, label: 49 },
  { value: 50, label: 50 },
  { value: 51, label: 51 },
  { value: 52, label: 52 },
  { value: 53, label: 53 },
  { value: 54, label: 54 },
  { value: 55, label: 55 },
  { value: 56, label: 56 },
  { value: 57, label: 57 },
  { value: 58, label: 58 },
  { value: 59, label: 59 },
  { value: 60, label: 60 },
  { value: 61, label: 61 },
  { value: 62, label: 62 },
  { value: 63, label: 63 },
  { value: 64, label: 64 },
  { value: 65, label: 65 },
  { value: 66, label: 66 },
  { value: 67, label: 67 },
  { value: 68, label: 68 },
  { value: 69, label: 69 },
  { value: 70, label: 70 },
  { value: 71, label: 71 },
  { value: 72, label: 72 },
  { value: 73, label: 73 },
  { value: 74, label: 74 },
  { value: 75, label: 75 },
];

//Helper Functions

export const formatRateLabel = (key: string) =>
  key.charAt(0) + key.slice(1).toLowerCase();

export function formatDollars(amount: number) {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}
