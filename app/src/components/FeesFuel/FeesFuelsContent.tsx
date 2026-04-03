import { useState } from "react";
import Select from "react-select";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";

type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  miles: number;
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
    { id: 1, make: "", model: "", year: 0, miles: 0 },
  ]);

  function updateCar(id: number, updated: Partial<Car>) {
    setCars((prev) =>
      prev.map((car) => (car.id === id ? { ...car, ...updated } : car)),
    );
  }

  function removeCar(id: number) {
    setCars((prev) => prev.filter((car) => car.id !== id));
  }

  function addCar() {
    setCars((prev) => [
      ...prev,
      { id: prev.length + 1, make: "", model: "", year: 0, miles: 0 },
    ]);
  }

  return (
    <div className="flex flex-row h-full w-full justify-between gap-2">
      <div className="flex flex-col h-90vh w-1/3 bg-[#17301b]/90 my-2 ml-2 rounded-xl p-2">
        <div className="text-center text-white font-bold p-2 text-2xl">
          Calculate your fuel tax & registration fees below:
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col bg-gray-100/25 text-center w-full p-4 rounded-xl">
            <div className="font-bold text-xl">
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
      <div className="flex flex-col h-90vh w-1/3 bg-gray-900/50 text-white my-2 mr-2 p-2 rounded-xl">
        <div className="text-center font-bold p-2 text-2xl">
          Estimated fuel tax & registration fees
        </div>
        <div className="italic font-bold text-center text-[18px]">Fuel Tax</div>
        <div>
          <div className="italic font-bold text-center text-[18px]">
            Registration Fees
          </div>
          <div className="grid w-full place-self-center grid-cols-[60%_30%_10%] bg-white text-black rounded-xl p-2 divide-y divide-gray-400">
            <div className="row-start-1">Uniform Fee</div>
            <div className="row-start-1 col-start-2"></div>

            <div className="row-start-2 bg-gray-100">Corridor Fee</div>
            <div className="row-start-2 col-start-2 bg-gray-100"></div>

            <div className="row-start-3">Driver's Education Fee</div>
            <div className="row-start-3 col-start-2"></div>

            <div className="row-start-4 bg-gray-100">
              Uninsured Motorist Fee
            </div>
            <div className="row-start-4 col-start-2 bg-gray-100"></div>

            <div className="row-start-5">Alternative Fuel Fee</div>
            <div className="row-start-5 col-start-2"></div>

            <div className="row-start-6 bg-gray-100">
              Air Pollution Control Fee
            </div>
            <div className="row-start-6 col-start-2 bg-gray-100"></div>

            <div className="row-start-7 font-bold">Total</div>
            <div className="row-start-7 col-start-2"></div>

            <div className="row-start-8 col-span-3"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*
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
