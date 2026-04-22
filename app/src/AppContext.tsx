import { createContext, useContext, useState, useMemo, useEffect } from "react";
import type {
  IncomeInfo,
  Property,
  Entity,
  SalesLocation,
  SalesLocationWithFeature,
  Car,
} from "./components/MetaMisc/types";
import { FEES_FUEL_CONSTANTS, RATE_COMPONENTS } from "./components/MetaMisc/types";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import Property2025 from "./data/Geospacial/Property2025.json";
import Sales2025 from "./data/Geospacial/Sales2025.json";
import FuelData from "./data/Misc/FuelData.json";

const FOOD_STATE_RATE = 0.0175;
const STATE_COMPONENT = "STATE SALES AND USE TAX";
const LOCAL_COMPONENT = "LOCAL SALES AND USE TAX";
const COUNTY_COMPONENT = "COUNTY OPTION SALES TAX";

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
  upsertPrimaryProperty: (patch: Partial<Omit<Property, "id" | "prime">>) => void;
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
};

const AppContext = createContext<AppState | null>(null);

function applyFuelLookup(car: Car): Car {
  if (car.make && car.model && car.year !== 0) {
    const match = (FuelData as any[]).find(
      (e) => e.make === car.make && e.model === car.model && e.year === car.year,
    );
    const fueltype = match?.fuelType?.includes("Electricity") ? "electric" : "gas";
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

    const data = Property2025 as GeoJSON.FeatureCollection;
    const results: Entity[] = [];

    for (const feature of data.features) {
      const props = feature.properties;
      if (!props) continue;

      const rate: number = props.ENT_RATE ?? 0;
      let totalValue = 0;

      for (const prop of geocoded) {
        const pt = point([prop.lon!, prop.lat!]);
        if (booleanPointInPolygon(pt, feature as any)) {
          totalValue += prop.prime ? prop.value * 0.55 : prop.value;
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
    const data = Sales2025 as GeoJSON.FeatureCollection;
    return locations
      .filter((l) => l.lat !== undefined && l.lon !== undefined)
      .map((l) => ({
        location: l,
        feature:
          data.features.find((f) =>
            booleanPointInPolygon(point([l.lon!, l.lat!]), f as any),
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
        nonFoodSpending: Math.round(income * 0.32),
        foodSpending: Math.round(income * 0.12),
      };
      if (prev.some((l) => l.id === 0)) {
        return prev.map((l) => (l.id === 0 ? { ...l, ...update } : l));
      }
      if (income <= 0 && !primaryPropAddress) return prev;
      return [{ id: 0, ...update }, ...prev];
    });
  }, [incomeInfo.annualIncome, primaryPropAddress, primaryPropLat, primaryPropLon]);

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

  const propertyTax = useMemo(
    () => entities.reduce((sum, e) => sum + e.liability, 0),
    [entities],
  );

  const salesTax = useMemo(
    () =>
      locationsWithFeatures.reduce((total, { location, feature }) => {
        const p = feature?.properties ?? {};
        const { nonFoodSpending, foodSpending } = location;
        const activeComponents = RATE_COMPONENTS.filter((key) => p[key] != null);
        return (
          total +
          activeComponents.reduce(
            (sum, key) =>
              sum + calcSalesLiability(key, p[key], nonFoodSpending, foodSpending),
            0,
          )
        );
      }, 0),
    [locationsWithFeatures],
  );

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

  const fees = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return cars.reduce((sum, car) => {
      if (car.year === 0) return sum;
      let carFees =
        FEES_FUEL_CONSTANTS.registrationFee +
        FEES_FUEL_CONSTANTS.driverEducationFee +
        FEES_FUEL_CONSTANTS.uninsuredMotoristFee;

      const age = currentYear - car.year;
      const ab = FEES_FUEL_CONSTANTS.ageBased;
      if (age <= 2) carFees += ab.age0to2;
      else if (age <= 5) carFees += ab.age3to5;
      else if (age <= 8) carFees += ab.age6to8;
      else if (age <= 11) carFees += ab.age9to11;
      else carFees += ab.age12plus;

      carFees += FEES_FUEL_CONSTANTS.corridorFeeByCounty[car.county] ?? 0;

      if (car.fueltype === "electric") {
        carFees += FEES_FUEL_CONSTANTS.alternativeFuelFee;
      } else {
        carFees +=
          FEES_FUEL_CONSTANTS.pollutionControlFeeByCounty[car.county] ?? 0;
      }

      return sum + carFees;
    }, 0);
  }, [cars]);

  const totalTax = incomeTax + propertyTax + salesTax + fuelTax + fees;

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
