import { useState, useEffect } from "react";
import React from "react";
import Select from "react-select";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";
import FuelData from "../../data/Misc/FuelData.json";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  miles: number;
  mpg: number;
};

function VehicleCard({
  car,
  onUpdate,
  onRemove,
}: {
  car: Car;
  onUpdate: (updated: Partial<Car>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-row bg-gray-100/25 justify-around w-full p-4 rounded-xl items-center gap-2">
      <Select
        className="text-black text-sm w-1/5"
        options={MakeOptions}
        placeholder="Make"
        value={MakeOptions.find((o) => o.value === car.make) ?? null}
        onChange={(opt) => onUpdate({ make: opt?.value ?? "" })}
      />
      <Select
        className="text-black text-sm w-1/5"
        options={
          car.make
            ? ((
                ModelOptions as Record<
                  string,
                  { value: string; label: string }[]
                >
              )[car.make] ?? [])
            : []
        }
        placeholder="Model"
        value={
          car.make
            ? ((
                (
                  ModelOptions as Record<
                    string,
                    { value: string; label: string }[]
                  >
                )[car.make] ?? []
              ).find((o) => o.value === car.model) ?? null)
            : null
        }
        onChange={(opt) => onUpdate({ model: opt?.value ?? "" })}
      />
      <input
        type="number"
        className="w-1/5 text-white text-sm rounded px-2 py-1 border border-gray-300"
        placeholder="Year"
        value={car.year === 0 ? "" : car.year}
        onChange={(e) =>
          onUpdate({
            year: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
          })
        }
      />
      <input
        type="number"
        className="w-1/5 text-white text-sm rounded px-2 py-1 border border-gray-300"
        placeholder="Annual Miles"
        value={car.miles === 0 ? "" : car.miles}
        onChange={(e) =>
          onUpdate({
            miles: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
          })
        }
      />
      <button onClick={onRemove} className="font-bold px-2 ">
        -
      </button>
    </div>
  );
}

export function FeesFuelsContent() {
  const [cars, setCars] = useState<Car[]>([
    { id: 1, make: "", model: "", year: 0, miles: 0, mpg: 0 },
  ]);

  function updateCar(id: number, updated: Partial<Car>) {
    setCars((prev) =>
      prev.map((car) => {
        if (car.id !== id) return car;
        const merged = { ...car, ...updated };
        if (merged.make && merged.model && merged.year !== 0) {
          const match = (FuelData as any[]).find(
            (entry) =>
              entry.make === merged.make &&
              entry.model === merged.model &&
              entry.year === merged.year,
          );
          return { ...merged, mpg: match?.comb08 ?? 0 };
        }
        return merged;
      }),
    );
  }

  function removeCar(id: number) {
    setCars((prev) => prev.filter((car) => car.id !== id));
  }

  function addCar() {
    setCars((prev) => [
      ...prev,
      { id: prev.length + 1, make: "", model: "", year: 0, miles: 0, mpg: 0 },
    ]);
  }

  const filteredFuelData = (FuelData as any[]).filter((entry) =>
    cars.some(
      (car) =>
        car.make &&
        car.model &&
        car.year !== 0 &&
        entry.make === car.make &&
        entry.model === car.model &&
        entry.year === car.year,
    ),
  );

  const [feeResults, setFeeResults] = useState([
    { id: 1, name: "Uniform Fee", value: 0 }, // Make conditional on the age of the car
    { id: 2, name: "Corridor Fee", value: 0 },
    { id: 3, name: "Driver Education Fee", value: 0 },
    { id: 4, name: "Uninsured Motorist Fee", value: 0 },
    { id: 5, name: "Alternative Fuel Fee", value: 0 }, // Make conditional on whether the car is an ev
    { id: 6, name: "Pollution Control Fee", value: 0 }, // make conditional on location and =! ev
    { id: 7, name: "Total", value: 0 },
  ]);

  useEffect(() => {
    setFeeResults((prevItems) => {
      const updated = prevItems.map((item) => {
        switch (item.name) {
          case "Uniform Fee":
            return { ...item, value: cars.length * 10 }; // calcuate based on the age of the car
          case "Corridor Fee":
            return { ...item, value: cars.length * 10 }; // $10 per car per year
          case "Driver Education Fee":
            return { ...item, value: cars.length * 3 }; // $2.50 per car per year
          case "Uninsured Motorist Fee":
            return { ...item, value: cars.length }; // $1 per car per year
          case "Alternative Fuel Fee":
            return { ...item, value: cars.length * 180 }; // Make conditonal on whether the car is an ev or not
          case "Pollution Control Fee":
            return { ...item, value: cars.length * 10 }; // Make conditional on the county in which the car is registed
          default:
            return item;
        }
      });

      const total = updated
        .filter((item) => item.name !== "Total") // exclude the total row itself
        .reduce((sum, item) => sum + item.value, 0);

      return updated.map((item) =>
        item.name === "Total" ? { ...item, value: total } : item,
      );
    });
  }, [cars]);

  console.log(filteredFuelData);
  console.log(cars);
  console.log(feeResults);

  return (
    <div className="flex flex-row h-full w-full justify-between gap-2">
      <div className="flex flex-col h-90vh w-1/3 bg-[#17301b]/90 my-2 ml-2 rounded-xl p-2">
        <div className="text-center text-white font-bold p-2 text-3xl">
          Calculate your fuel tax & registration fees below:
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col bg-gray-100/25 text-center w-full p-4 rounded-xl">
            <div className="font-bold text-2xl">
              What vehicles does your houshold own or drive regularly?
            </div>
          </div>

          {cars.map((car) => (
            <VehicleCard
              key={car.id}
              car={car}
              onUpdate={(updated) => updateCar(car.id, updated)}
              onRemove={() => removeCar(car.id)}
            />
          ))}
          <button
            onClick={addCar}
            className="mt-2 w-full py-2 rounded-xl bg-green-700 text-white hover:bg-green-600 transition-colors"
          >
            + Add Vehicle
          </button>
        </div>
      </div>

      <div className="flex flex-col h-90vh w-1/3 bg-gray-900/50 text-white my-2 mr-2 p-2 rounded-xl gap-y-4">
        <div className="text-center font-bold p-2 text-3xl">
          Estimated fuel tax & registration fees
        </div>
        <div>
          <div className="italic font-bold text-center text-2xl mb-2">
            Fuel Tax
          </div>
          <div className="grid w-full place-self-center grid-cols-[15%_45%_30%_5%_5%] bg-white text-black text-xl rounded-xl p-2 divide-y divide-gray-400">
            {cars.map((car) => (
              <React.Fragment key={car.id}>
                <div className="col-start-1"></div>
                <div className="col-start-2">
                  {car.make} {car.model}
                </div>
                <div className="col-start-3 text-right">$</div>
                <div className="col-start-4 text-right">
                  {Math.round((car.miles / car.mpg) * 0.379) || 0}
                </div>
                <div className="col-start-5"></div>
              </React.Fragment>
            ))}
            <div className="col-span-3"></div>
          </div>
        </div>
        <div>
          <div className="italic font-bold text-center text-2xl mb-2">
            Registration Fees
          </div>
          <div className="grid w-full place-self-center grid-cols-[5%_55%_30%_5%_5%] bg-white text-black text-xl rounded-xl p-2 divide-y divide-gray-400">
            {feeResults.map((result) => (
              <React.Fragment key={result.id}>
                <div className="col-start-1"></div>
                <div className="col-start-2">{result.name}</div>
                <div className="col-start-3 text-right">$</div>
                <div className="col-start-4 text-right">{result.value}</div>
                <div className="col-start-5"></div>
              </React.Fragment>
            ))}
            <div className="col-span-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*

How to address duplicates of [make, model, year]

Fees to calcuate:
Sources:
  Registration Fees: https://dmv.utah.gov/register/registration-taxes-fees/
  Uniform Fees: https://dmv.utah.gov/register/registration-taxes-fees/uniform-fees/

Uniform Fee [age-based fee applied to all car; see source for amounts]

Fixed Fees:
  Corridor Fee [$10/ car/ year]
  Driver Education Fee [$2.50/ car/ year]
  Uninsured Motorist Identification Fee [$1.00/ car/ year]
  Alternative Fuel Fees` [$180``/ car/ year]
    `Applies only to EVs
    ``$180 is the maximum per year; drivers enrolled in the Road usage charge program may pay less depending on miles driven [>14,440 miles].

Air Pollution Control* (APC) Fee [$/ car/ year]
  Salt Lake $3.00
  Davis $3.00
  Cache $3.00
  Utah $2.00
  Weber $2.00

  *Does not apply to EVs

*/
