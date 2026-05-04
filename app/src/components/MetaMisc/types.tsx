// Income Tax

import allData from "../../data/Tax&Spend/IncomeData.json";
import sData from "../../data/Tax&Spend/IncomeData_S.json";
import mfsData from "../../data/Tax&Spend/IncomeData_MFS.json";
import mfjData from "../../data/Tax&Spend/IncomeData_MFJ.json";
import hhData from "../../data/Tax&Spend/IncomeData_HH.json";

const statusDataMap: Record<string, typeof allData> = {
  Single: sData,
  "Married Filing Single": mfsData,
  "Married Filing Jointly": mfjData,
  "Head of Household": hhData,
  "Qualifying surviving spouse": mfjData,
};

export function lookupIncomeData(
  annualIncome: number,
  filingStatus: string,
): {
  effectiveRate: number;
  householdSize: number;
  incomeTile: number;
  averageIncome: number;
} {
  if (!annualIncome)
    return {
      effectiveRate: 0,
      householdSize: 0,
      incomeTile: 0,
      averageIncome: 0,
    };

  const data = statusDataMap[filingStatus] ?? allData;
  let closest = data[0];
  let minDiff = Math.abs(data[0].FAGI - annualIncome);

  for (const row of data) {
    const diff = Math.abs(row.FAGI - annualIncome);
    if (diff < minDiff) {
      minDiff = diff;
      closest = row;
    }
  }

  return {
    effectiveRate: closest.EFFECTIVE_ON_FAGI,
    householdSize: closest.HH_SIZE,
    incomeTile: closest.status_conditioned_tile,
    averageIncome: closest.FAGI,
  };
}

export type IncomeInfo = {
  annualIncome: number;
  filingStatus: string;
  incomeTile: number;
  householdSize: number;
  effectiveRate: number;
  averageIncome: number;
};

export const filingOptions = [
  { value: "Single", label: "Single" },
  { value: "Married Filing Single", label: "Married Filing Single" },
  { value: "Married Filing Jointly", label: "Married Filing Jointly" },
  { value: "Head of Household", label: "Head of Household" },
  {
    value: "Qualifying surviving spouse",
    label: "Qualifying surviving spouse",
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
  city?: string | null;
  county?: string | null;
};

export type SalesFeatureProps = {
  TAXDIST: string;
  CURRRATE: number;
  METRONAME: string;
  SHORTDESC_x: string;
  [key: string]: number | string | null | undefined;
};

export type SalesLocationWithFeature = {
  location: SalesLocation;
  feature: GeoJSON.Feature<GeoJSON.MultiPolygon, SalesFeatureProps> | null;
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
  liability?: number;
  lat?: number;
  lon?: number;
  city?: string | null;
  county?: string | null;
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

export type PropertyFeatureProps = {
  ENT_NBR: number;
  ENT_DESC: string;
  ENT_RATE: number;
  entity_type: string;
  county: string;
};

// Fuel & Fees

export type FuelEntry = {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  comb08: number;
};

export const FEES_FUEL_CONSTANTS = {
  registrationFee: 66,
  ageBased: {
    age0to2: 150,
    age3to5: 110,
    age6to8: 80,
    age9to11: 50,
    age12plus: 10,
  },
  driverEducationFee: 3,
  uninsuredMotoristFee: 1,
  alternativeFuelFee: 180,
  fuelTaxRatePerGallon: 0.379,
  corridorFeeByCounty: {
    "Salt Lake": 10,
    Davis: 10,
    Utah: 10,
    Weber: 10,
    Summit: 10,
    Wasatch: 10,
    Iron: 10,
    "Box Elder": 10,
    Washington: 10,
    Tooele: 10,
    Morgan: 10,
  } as Record<string, number>,
  pollutionControlFeeByCounty: {
    "Salt Lake": 3,
    Davis: 3,
    Cache: 3,
    Utah: 2,
    Weber: 2,
  } as Record<string, number>,
};

export type EntityKey =
  | "state"
  | "county"
  | "schoolDistrict"
  | "municipality"
  | "specialDistricts";

export const PROPERTY_ENTITY_TYPE_MAP: Record<string, EntityKey> = {
  County: "county",
  Municipality: "municipality",
  "School District": "schoolDistrict",
  "County Assessing": "specialDistricts",
  "Multicounty Assessing": "specialDistricts",
  "Special District": "specialDistricts",
  PID: "specialDistricts",
  "RDA or CDA": "specialDistricts",
};

export const SALES_COMPONENT_ENTITY_ASSIGNMENT: Record<string, EntityKey> = {
  "STATE SALES AND USE TAX": "state",
  "SUPPLEMENTAL STATE SALES AND USE TAX": "state",
  "COUNTY OPTION SALES TAX": "county",
  "COUNTY OPTION TRANSPORTATION TAX": "county",
  "COUNTY AIRPORT, HIGHWAY, PUBLIC TRANSIT TAX": "county",
  "COUNTY PUBLIC TRANSIT": "county",
  "MASS TRANSIT TAX": "county",
  "ADDITIONAL MASS TRANSIT TAX": "county",
  "MASS TRANSIT FIXED GUIDEWAY TAX": "county",
  "TRANSPORTATION INFRUSTRUCTURE TAX": "county",
  "BOTANICAL, CULTURAL, ZOO TAX": "county",
  "EMERGENCY SERVICES TAX": "county",
  "LOCAL SALES AND USE TAX": "municipality",
  "TOWN OPTION TAX": "municipality",
  "CITY OR TOWN OPTION TAX": "municipality",
  "RESORT COMMUNITY TAX": "municipality",
  "CAPITAL CITY REVITALIZATION TAX": "municipality",
  "CORRECTIONAL FACILITY TAX": "municipality",
  "RURAL HOSPITAL TAX": "municipality",
  "HIGHWAYS TAX": "municipality",
};

export const FEE_ENTITY_ASSIGNMENT: Record<string, EntityKey> = {
  registrationFee: "state",
  ageBased: "state",
  driverEducationFee: "state",
  uninsuredMotoristFee: "state",
  alternativeFuelFee: "state",
  corridorFee: "county",
  pollutionControlFee: "county",
};

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

// Legislative Districts

export type DistrictFeatureProps = {
  DIST: number;
};

export type DistrictIntersectionsData = {
  house: {
    property: Record<string, number[]>;
    sales: Record<string, number[]>;
  };
  senate: {
    property: Record<string, number[]>;
    sales: Record<string, number[]>;
  };
};

// Sankey

export type SankeyData = {
  nodes: { name: string }[];
  links: { source: number; target: number; value: number }[];
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

export function formatDollars(
  amount: number,
  decimals: number = 0,
  roundTo: number = 2,
) {
  const rounded = Math.round(amount / 10 ** roundTo) * 10 ** roundTo;
  return rounded.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export async function geocodeAddress(address: string): Promise<{
  lat: number;
  lon: number;
  city: string | null;
  county: string | null;
} | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  if (!data.length) return null;
  const addr = data[0].address ?? {};
  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    city: addr.city ?? addr.town ?? addr.village ?? null,
    county: addr.county ?? null,
  };
}

// Standard Text

export function ResultsDisclaimer() {
  return (
    <div className="flex flex-col text-sm text-gray-500 justify-self-end p-2 gap-2 text-left">
      The above results are for illustration purposes only. Estimates represent
      the typical circumstances for similarly situated taxpayers. This is not a
      tax notice, bill, or other offical record.
    </div>
  );
}

export const feeInfo: Record<string, { description: string; statute: string }> =
  {
    "Registration Fee": {
      description:
        "A flat $66 fee charged per vehicle per year for to fund transportation services. Fee amount is inflation adjusted annually",
      statute: "41-1a-1206",
    },
    "Age-Based Fee": {
      description:
        "Uniform fee by vehicle age with older vehicles paying less than newer ones.",
      statute: "59-2-405.1",
    },
    "Corridor Fee": {
      description:
        "$10 per year fee imposed by counties for transportation maintainance. Applies to vehicles registered in Salt Lake, Davis, Utah, Weber, Summit, Wasatch, Iron, Box Elder, Washington, Tooele, and Morgan.",
      statute: "41-1a-1222",
    },
    "Driver Education Fee": {
      description:
        "$2.50 per vehicle per year, used to fund driver education and student transportation programs.",
      statute: "41-1a-1204",
    },
    "Uninsured Motorist Fee": {
      description:
        "$1.00 per vehicle per year, used to fund the Uninsured Motorist Identification Restricted Account.",
      statute: "41-1a-1218",
    },
    "Alternative Fuel Fee": {
      description:
        "Up to $180 per year for electric vehicles, offsetting fuel taxes not paid at the pump. Hybrid vehicles or those enrolled in the Road Usage Charge program may pay less depending on miles driven.",
      statute: "72-1-213.1",
    },
    "Pollution Control Fee": {
      description:
        "Up to $3 per year which goes to fund local emissions testing programs. Does not apply to EVs. Fee amount is determined by county.",
      statute: "41-1a-1223",
    },
    Total: {
      description:
        "Total registration fees are the sum of each fee applicable to the vehicle. Fees calculated here are for passenger cars; other vehicle classes may be subject to different or additional fees at registration.",
      statute: "",
    },
  };
