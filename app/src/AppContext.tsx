import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type {
  IncomeInfo,
  Property,
  Entity,
  PropertyFeatureProps,
  SalesFeatureProps,
  SalesLocation,
  SalesLocationWithFeature,
  Car,
  FuelEntry,
} from "./components/MetaMisc/types";
import {
  FEES_FUEL_CONSTANTS,
  RATE_COMPONENTS,
  FEE_ENTITY_ASSIGNMENT,
  SALES_COMPONENT_ENTITY_ASSIGNMENT,
  PROPERTY_ENTITY_TYPE_MAP,
} from "./components/MetaMisc/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import Property2025 from "./data/Geospacial/Property2025.json";
import Sales2025 from "./data/Geospacial/Sales2025.json";
import FuelData from "./data/Misc/FuelData.json";

export const STATE_INCOME_RATE = 0.0455;

export const PRIME_RESIDE_EXEMPT = 0.55;

export const FOOD_STATE_RATE = 0.0175;
export const STATE_SALES_RATE = 0.0485;
const STATE_COMPONENT = "STATE SALES AND USE TAX";
const LOCAL_COMPONENT = "LOCAL SALES AND USE TAX";
const COUNTY_COMPONENT = "COUNTY OPTION SALES TAX";

export const NONFOOD_SPEND_SHARE = 0.32;
export const FOOD_SPEND_SHARE = 0.12;

export const UTAH_MAP_CENTER: [number, number] = [39.5, -111.5];
export const UTAH_MAP_DEFAULT_ZOOM = 7;

export function getPropOpacity(rate: number) {
  return rate > 0.003
    ? 0.4
    : rate > 0.002
      ? 0.1
      : rate > 0.001
        ? 0.03
        : rate > 0.0005
          ? 0.01
          : 0.005;
}

export function getSalesColor(rate: number) {
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

function calcSalesLiability(
  key: string,
  rate: number,
  nonFood: number,
  food: number,
) {
  const foodRate =
    key === STATE_COMPONENT
      ? FOOD_STATE_RATE
      : key === LOCAL_COMPONENT || key === COUNTY_COMPONENT
        ? rate
        : 0;
  return nonFood * rate + food * foodRate;
}

type AppState = {
  incomeInfo: IncomeInfo;
  setIncomeInfo: React.Dispatch<React.SetStateAction<IncomeInfo>>;

  properties: Property[];
  addProperty: () => void;
  updateProperty: (updated: Property) => void;
  removeProperty: (id: number) => void;
  upsertPrimaryProperty: (
    patch: Partial<Omit<Property, "id" | "prime">>,
  ) => void;
  entities: Entity[];

  locations: SalesLocation[];
  addLocation: () => void;
  updateLocation: (updated: SalesLocation) => void;
  removeLocation: (id: number) => void;
  locationsWithFeatures: SalesLocationWithFeature[];

  cars: Car[];
  addCar: () => void;
  updateCar: (id: number, updated: Partial<Car>) => void;
  removeCar: (id: number) => void;
  upsertFirstCar: (patch: Partial<Omit<Car, "id">>) => void;

  clearAll: () => void;

  incomeTax: number;
  propertyTax: number;
  salesTax: number;
  fuelTax: number;
  fees: number;
  totalTax: number;
  entityAmounts: Record<string, number>;
  entityPurposeMap: Record<string, Record<string, number>>;
  purposeAmounts: Record<string, number>;
  propertyTaxEntityShares: Record<string, number>;
  feesEntityShares: Record<string, number>;
  salesEntityShares: Record<string, number>;
};

export const FUEL_TAX_ENTITY_SHARES: Record<string, number> = {
  state: 1,
  county: 0,
  schoolDistrict: 0,
  municipality: 0,
  specialDistricts: 0,
};

export const INCOME_TAX_ENTITY_SHARES: Record<string, number> = {
  state: 1,
  county: 0,
  schoolDistrict: 0,
  municipality: 0,
  specialDistricts: 0,
};

export const TAX_KEYS = [
  "incomeTax",
  "salesTax",
  "propertyTax",
  "fuelTax",
  "fees",
] as const;
export type TaxKey = (typeof TAX_KEYS)[number];

export const WEIGHTED_STATE_PURPOSES: Record<string, Record<string, number>> = {
  incomeTax: {
    criminalJustice: 0.00003,
    econDev: 0.00696,
    higherEd: 0.16139,
    publicEd: 0.70822,
    generalGov: 0.00337,
    infrastructure: 0.04442,
    naturalRes: 0.00006,
    socialServices: 0.07555,
  },

  salesTax: {
    criminalJustice: 0.21839,
    econDev: 0.07538,
    higherEd: 0.09131,
    publicEd: 0.00204,
    generalGov: 0.04186,
    infrastructure: 0.32848,
    naturalRes: 0.04706,
    socialServices: 0.19549,
  },

  fuelTax: {
    criminalJustice: 0,
    econDev: 0,
    higherEd: 0,
    publicEd: 0,
    generalGov: 0,
    infrastructure: 1,
    naturalRes: 0,
    socialServices: 0,
  },

  fees: {
    criminalJustice: 0,
    econDev: 0,
    higherEd: 0,
    publicEd: 0,
    generalGov: 0,
    infrastructure: 1,
    naturalRes: 0,
    socialServices: 0,
  },
};

export const ENTITY_TO_PURPOSE: Record<string, Record<string, number>> = {
  state: {},
  county: {
    criminalJustice: 0.2,
    econDev: 0.05,
    higherEd: 0.0,
    publicEd: 0.0,
    generalGov: 0.25,
    infrastructure: 0.3,
    naturalRes: 0.05,
    socialServices: 0.15,
  },
  schoolDistrict: {
    criminalJustice: 0.0,
    econDev: 0.0,
    higherEd: 0.0,
    publicEd: 1.0,
    generalGov: 0.0,
    infrastructure: 0.0,
    naturalRes: 0.0,
    socialServices: 0.0,
  },
  municipality: {
    criminalJustice: 0.15,
    econDev: 0.1,
    higherEd: 0.0,
    publicEd: 0.0,
    generalGov: 0.25,
    infrastructure: 0.45,
    naturalRes: 0.0,
    socialServices: 0.05,
  },
  specialDistricts: {
    criminalJustice: 0.0,
    econDev: 0.0,
    higherEd: 0.0,
    publicEd: 0.0,
    generalGov: 0.1,
    infrastructure: 0.7,
    naturalRes: 0.2,
    socialServices: 0.0,
  },
};

const AppContext = createContext<AppState | null>(null);

function applyFuelLookup(car: Car): Car {
  if (car.make && car.model && car.year !== 0) {
    const match = (FuelData as FuelEntry[]).find(
      (e) =>
        e.make === car.make && e.model === car.model && e.year === car.year,
    );
    const fueltype = match?.fuelType?.includes("Electricity")
      ? "electric"
      : "gas";
    return { ...car, mpg: match?.comb08 ?? 0, fueltype };
  }
  return car;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [incomeInfo, setIncomeInfo] = useState<IncomeInfo>({
    annualIncome: 0,
    filingStatus: "",
    incomeTile: 0,
    householdSize: 1,
    effectiveRate: 0,
    averageIncome: 0,
  });

  const [properties, setProperties] = useState<Property[]>([]);

  const addProperty = () => {
    setProperties((prev) => [
      ...prev,
      { id: prev.length + 1, address: "", value: 0, prime: false },
    ]);
  };

  const updateProperty = (updated: Property) => {
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === updated.id) return updated;
        return updated.prime ? { ...p, prime: false } : p;
      }),
    );
  };

  const removeProperty = (id: number) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const entities = useMemo<Entity[]>(() => {
    const geocoded = properties.filter(
      (p) => p.lat !== undefined && p.lon !== undefined && p.value > 0,
    );
    if (geocoded.length === 0) return [];

    const data = Property2025 as GeoJSON.FeatureCollection<
      GeoJSON.MultiPolygon,
      PropertyFeatureProps
    >;
    const results: Entity[] = [];

    for (const feature of data.features) {
      const props = feature.properties;
      if (!props) continue;

      const rate = props.ENT_RATE;
      let totalValue = 0;

      for (const prop of geocoded) {
        const pt = point([prop.lon!, prop.lat!]);
        if (booleanPointInPolygon(pt, feature)) {
          totalValue += prop.prime
            ? prop.value * PRIME_RESIDE_EXEMPT
            : prop.value;
        }
      }

      if (totalValue > 0) {
        results.push({
          id: props.ENT_NBR,
          name: props.ENT_DESC,
          type: props.entity_type,
          county: props.county,
          rate,
          value: totalValue,
          liability: rate * totalValue,
        });
      }
    }

    return results.sort((a, b) => b.liability - a.liability);
  }, [properties]);

  const [locations, setLocations] = useState<SalesLocation[]>([]);

  const addLocation = () => {
    setLocations((prev) => [
      ...prev,
      {
        id: prev.length > 0 ? Math.max(...prev.map((l) => l.id)) + 1 : 1,
        address: "",
        nonFoodSpending: 0,
        foodSpending: 0,
      },
    ]);
  };

  const updateLocation = (updated: SalesLocation) => {
    setLocations((prev) =>
      prev.map((l) => (l.id === updated.id ? updated : l)),
    );
  };

  const removeLocation = (id: number) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const locationsWithFeatures = useMemo<SalesLocationWithFeature[]>(() => {
    const data = Sales2025 as GeoJSON.FeatureCollection<
      GeoJSON.MultiPolygon,
      SalesFeatureProps
    >;
    return locations
      .filter((l) => l.lat !== undefined && l.lon !== undefined)
      .map((l) => ({
        location: l,
        feature:
          data.features.find((f) =>
            booleanPointInPolygon(point([l.lon!, l.lat!]), f),
          ) ?? null,
      }));
  }, [locations]);

  const [cars, setCars] = useState<Car[]>([]);

  const addCar = () => {
    setCars((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        make: "",
        model: "",
        year: 0,
        miles: 0,
        mpg: 0,
        fueltype: "",
        county: "",
      },
    ]);
  };

  const updateCar = (id: number, updated: Partial<Car>) => {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id !== id) return car;
        return applyFuelLookup({ ...car, ...updated });
      }),
    );
  };

  const removeCar = (id: number) => {
    setCars((prev) => prev.filter((car) => car.id !== id));
  };

  const upsertPrimaryProperty = (
    patch: Partial<Omit<Property, "id" | "prime">>,
  ) => {
    setProperties((prev) => {
      if (prev.length === 0) {
        return [{ id: 1, address: "", value: 0, prime: true, ...patch }];
      }
      const targetId = (prev.find((p) => p.prime) ?? prev[0]).id;
      return prev.map((p) =>
        p.id === targetId
          ? { ...p, ...patch, prime: true }
          : { ...p, prime: false },
      );
    });
  };

  const upsertFirstCar = (patch: Partial<Omit<Car, "id">>) => {
    setCars((prev) => {
      if (prev.length === 0) {
        const base: Car = {
          id: 1,
          make: "",
          model: "",
          year: 0,
          miles: 0,
          mpg: 0,
          fueltype: "",
          county: "",
          ...patch,
        };
        return [applyFuelLookup(base)];
      }
      return [applyFuelLookup({ ...prev[0], ...patch }), ...prev.slice(1)];
    });
  };

  // Derive primary property primitives for stable effect dependencies.
  const primaryProp = properties.find((p) => p.prime) ?? properties[0];
  const primaryPropAddress = primaryProp?.address;
  const primaryPropLat = primaryProp?.lat;
  const primaryPropLon = primaryProp?.lon;

  // Keep location id=0 in sync with income (32 % non-food, 12 % food) and the
  // primary property address. Creates the location when income is first entered;
  // updates it whenever income or address changes; sets spending to zero if
  // income is cleared. clearAll resets the whole list so no special case needed.
  useEffect(() => {
    setLocations((prev) => {
      const income = incomeInfo.annualIncome;
      const update = {
        address: primaryPropAddress ?? "",
        lat: primaryPropLat,
        lon: primaryPropLon,
        nonFoodSpending: Math.round(income * NONFOOD_SPEND_SHARE),
        foodSpending: Math.round(income * FOOD_SPEND_SHARE),
      };
      if (prev.some((l) => l.id === 0)) {
        return prev.map((l) => (l.id === 0 ? { ...l, ...update } : l));
      }
      if (income <= 0 && !primaryPropAddress) return prev;
      return [{ id: 0, ...update }, ...prev];
    });
  }, [
    incomeInfo.annualIncome,
    primaryPropAddress,
    primaryPropLat,
    primaryPropLon,
  ]);

  const clearAll = () => {
    setIncomeInfo({
      annualIncome: 0,
      filingStatus: "",
      incomeTile: 0,
      householdSize: 1,
      effectiveRate: 0,
      averageIncome: 0,
    });
    setProperties([]);
    setLocations([]);
    setCars([]);
  };

  const incomeTax = useMemo(
    () => incomeInfo.annualIncome * incomeInfo.effectiveRate,
    [incomeInfo],
  );

  const { propertyTax, propertyTaxEntityShares } = useMemo(() => {
    const byEntity = {
      state: 0,
      county: 0,
      schoolDistrict: 0,
      municipality: 0,
      specialDistricts: 0,
    };

    for (const entity of entities) {
      const key = PROPERTY_ENTITY_TYPE_MAP[entity.type] ?? "specialDistricts";
      byEntity[key] += entity.liability;
    }

    const total = Object.values(byEntity).reduce((s, v) => s + v, 0);
    const propertyTaxEntityShares =
      total === 0
        ? {
            state: 0,
            county: 0,
            schoolDistrict: 0,
            municipality: 0,
            specialDistricts: 0,
          }
        : Object.fromEntries(
            Object.entries(byEntity).map(([e, v]) => [e, v / total]),
          );

    return { propertyTax: total, propertyTaxEntityShares };
  }, [entities]);

  const { salesTax, salesEntityShares } = useMemo(() => {
    const byEntity = {
      state: 0,
      county: 0,
      schoolDistrict: 0,
      municipality: 0,
      specialDistricts: 0,
    };

    for (const { location, feature } of locationsWithFeatures) {
      const p = feature?.properties ?? ({} as SalesFeatureProps);
      const { nonFoodSpending, foodSpending } = location;

      for (const key of RATE_COMPONENTS) {
        if (p[key] == null) continue;
        const liability = calcSalesLiability(
          key,
          p[key] as number,
          nonFoodSpending,
          foodSpending,
        );
        const entity = SALES_COMPONENT_ENTITY_ASSIGNMENT[key] ?? "state";
        byEntity[entity] += liability;
      }
    }

    const total = Object.values(byEntity).reduce((s, v) => s + v, 0);
    const salesEntityShares =
      total === 0
        ? {
            state: 1,
            county: 0,
            schoolDistrict: 0,
            municipality: 0,
            specialDistricts: 0,
          }
        : Object.fromEntries(
            Object.entries(byEntity).map(([e, v]) => [e, v / total]),
          );

    return { salesTax: total, salesEntityShares };
  }, [locationsWithFeatures]);

  const fuelTax = useMemo(
    () =>
      cars.reduce((sum, car) => {
        if (car.mpg === 0 || car.fueltype !== "gas") return sum;
        return (
          sum +
          Math.round(
            (car.miles / car.mpg) * FEES_FUEL_CONSTANTS.fuelTaxRatePerGallon,
          )
        );
      }, 0),
    [cars],
  );

  const { fees, feesEntityShares } = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const byEntity = {
      state: 0,
      county: 0,
      schoolDistrict: 0,
      municipality: 0,
      specialDistricts: 0,
    };

    for (const car of cars) {
      if (car.year === 0) continue;

      const age = currentYear - car.year;
      const ab = FEES_FUEL_CONSTANTS.ageBased;
      const ageFee =
        age <= 2
          ? ab.age0to2
          : age <= 5
            ? ab.age3to5
            : age <= 8
              ? ab.age6to8
              : age <= 11
                ? ab.age9to11
                : ab.age12plus;

      byEntity[FEE_ENTITY_ASSIGNMENT.registrationFee] +=
        FEES_FUEL_CONSTANTS.registrationFee;
      byEntity[FEE_ENTITY_ASSIGNMENT.ageBased] += ageFee;
      byEntity[FEE_ENTITY_ASSIGNMENT.driverEducationFee] +=
        FEES_FUEL_CONSTANTS.driverEducationFee;
      byEntity[FEE_ENTITY_ASSIGNMENT.uninsuredMotoristFee] +=
        FEES_FUEL_CONSTANTS.uninsuredMotoristFee;
      byEntity[FEE_ENTITY_ASSIGNMENT.corridorFee] +=
        FEES_FUEL_CONSTANTS.corridorFeeByCounty[car.county] ?? 0;

      if (car.fueltype === "electric") {
        byEntity[FEE_ENTITY_ASSIGNMENT.alternativeFuelFee] +=
          FEES_FUEL_CONSTANTS.alternativeFuelFee;
      } else {
        byEntity[FEE_ENTITY_ASSIGNMENT.pollutionControlFee] +=
          FEES_FUEL_CONSTANTS.pollutionControlFeeByCounty[car.county] ?? 0;
      }
    }

    const total = Object.values(byEntity).reduce((s, v) => s + v, 0);
    const feesEntityShares =
      total === 0
        ? {
            state: 1,
            county: 0,
            schoolDistrict: 0,
            municipality: 0,
            specialDistricts: 0,
          }
        : Object.fromEntries(
            Object.entries(byEntity).map(([e, v]) => [e, v / total]),
          );

    return { fees: total, feesEntityShares };
  }, [cars]);

  const totalTax = incomeTax + propertyTax + salesTax + fuelTax + fees;

  const entityAmounts = useMemo(() => {
    const taxAmounts: Record<TaxKey, number> = {
      incomeTax,
      salesTax,
      propertyTax,
      fuelTax,
      fees,
    };
    const sharesByTax: Record<TaxKey, Record<string, number>> = {
      incomeTax: INCOME_TAX_ENTITY_SHARES,
      fuelTax: FUEL_TAX_ENTITY_SHARES,
      propertyTax: propertyTaxEntityShares,
      salesTax: salesEntityShares,
      fees: feesEntityShares,
    };

    return Object.fromEntries(
      Object.keys(ENTITY_TO_PURPOSE).map((entity) => [
        entity,
        TAX_KEYS.reduce(
          (sum, tax) => sum + taxAmounts[tax] * (sharesByTax[tax][entity] ?? 0),
          0,
        ),
      ]),
    );
  }, [
    incomeTax,
    salesTax,
    propertyTax,
    fuelTax,
    fees,
    propertyTaxEntityShares,
    salesEntityShares,
    feesEntityShares,
  ]);

  const entityPurposeMap = useMemo(() => {
    const stateAmounts: Record<string, number> = {
      incomeTax: incomeTax * INCOME_TAX_ENTITY_SHARES.state,
      salesTax: salesTax * salesEntityShares.state,
      fuelTax: fuelTax * FUEL_TAX_ENTITY_SHARES.state,
      fees: fees * feesEntityShares.state,
    };

    const totalStateRevenue = Object.values(stateAmounts).reduce(
      (s, v) => s + v,
      0,
    );

    const statePurposes =
      totalStateRevenue === 0
        ? WEIGHTED_STATE_PURPOSES.incomeTax
        : Object.fromEntries(
            Object.keys(WEIGHTED_STATE_PURPOSES.incomeTax).map((purpose) => [
              purpose,
              Object.entries(WEIGHTED_STATE_PURPOSES).reduce(
                (sum, [source, shares]) =>
                  sum +
                  (stateAmounts[source] / totalStateRevenue) *
                    (shares[purpose] ?? 0),
                0,
              ),
            ]),
          );

    return { ...ENTITY_TO_PURPOSE, state: statePurposes };
  }, [incomeTax, salesTax, fuelTax, fees, salesEntityShares, feesEntityShares]);

  const purposeAmounts = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(Object.values(entityPurposeMap)[0]).map((purpose) => [
          purpose,
          Object.entries(entityPurposeMap).reduce(
            (sum, [entity, shares]) =>
              sum + entityAmounts[entity] * (shares[purpose] ?? 0),
            0,
          ),
        ]),
      ),
    [entityAmounts, entityPurposeMap],
  );

  return (
    <AppContext.Provider
      value={{
        incomeInfo,
        setIncomeInfo,
        properties,
        addProperty,
        updateProperty,
        removeProperty,
        upsertPrimaryProperty,
        entities,
        locations,
        addLocation,
        updateLocation,
        removeLocation,
        locationsWithFeatures,
        cars,
        addCar,
        updateCar,
        removeCar,
        upsertFirstCar,
        clearAll,
        incomeTax,
        propertyTax,
        salesTax,
        fuelTax,
        fees,
        totalTax,
        entityAmounts,
        entityPurposeMap,
        purposeAmounts,
        propertyTaxEntityShares,
        feesEntityShares,
        salesEntityShares,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
