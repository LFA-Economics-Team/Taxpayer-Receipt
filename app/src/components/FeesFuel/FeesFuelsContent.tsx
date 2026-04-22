import { useState, useEffect } from "react";
import React from "react";
import Select from "react-select";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";
import FuelData from "../../data/Misc/FuelData.json";
import countyOptions from "../../data/Geospacial/countyOptions.json";
import { FEES_FUEL_CONSTANTS } from "../MetaMisc/types";
import type { Car } from "../MetaMisc/types";
import { useAppContext } from "../../AppContext";

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
      <input
        type="number"
        className="w-1/5 text-white text-sm rounded px-2 py-1 border border-gray-300"
        placeholder="Year"
        value={car.year === 0 ? "" : car.year}
        onChange={(e) =>
          onUpdate({
            year: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
            model: "",
          })
        }
      />
      <Select
        className="text-black text-sm w-1/5"
        options={MakeOptions}
        placeholder="Make"
        isClearable={true}
        value={MakeOptions.find((o) => o.value === car.make) ?? null}
        onChange={(opt) => onUpdate({ make: opt?.value ?? "", model: "" })}
      />
      <Select
        className="text-black text-sm w-1/5"
        options={(() => {
          const makeModels = car.make
            ? ((
                ModelOptions as Record<
                  string,
                  { value: string; label: string }[]
                >
              )[car.make] ?? [])
            : [];
          if (car.make && car.year !== 0) {
            const validModels = new Set(
              (FuelData as any[])
                .filter((e) => e.make === car.make && e.year === car.year)
                .map((e) => e.model),
            );
            return makeModels.filter((o) => validModels.has(o.value));
          }
          return makeModels;
        })()}
        placeholder="Model"
        isClearable={true}
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
        placeholder="Annual Miles"
        value={car.miles === 0 ? "" : car.miles}
        onChange={(e) =>
          onUpdate({
            miles: e.target.value === "" ? 0 : parseInt(e.target.value, 10),
          })
        }
      />
      <Select
        className="text-black text-sm w-1/5"
        options={countyOptions}
        placeholder="County"
        isClearable={true}
        value={countyOptions.find((o) => o.value === car.county) ?? null}
        onChange={(opt) => onUpdate({ county: opt?.value ?? "" })}
      />
      <button onClick={onRemove} className="font-bold px-2 ">
        -
      </button>
    </div>
  );
}

const feeInfo: Record<string, { description: string; statute: string }> = {
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
    statute: "41-1a-12",
  },
  Total: {
    description:
      "Total registration fees are the sum of each fee applicable to the vehicle. Fees calculated here are for passenger cars; other vehicle classes may be subject to different or additional fees at registration.",
    statute: "",
  },
};

export function FeesFuelsContent() {
  const { cars, addCar, updateCar, removeCar } = useAppContext();
  const [openFee, setOpenFee] = useState<string | null>(null);

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
    { id: 1, name: "Registration Fee", value: 0 },
    { id: 2, name: "Age-Based Fee", value: 0 },
    { id: 3, name: "Corridor Fee", value: 0 },
    { id: 4, name: "Driver Education Fee", value: 0 },
    { id: 5, name: "Uninsured Motorist Fee", value: 0 },
    { id: 6, name: "Alternative Fuel Fee", value: 0 },
    { id: 7, name: "Pollution Control Fee", value: 0 },
    { id: 8, name: "Total", value: 0 },
  ]);

  const fuelTaxes = cars.map((car) =>
    car.mpg === 0
      ? null
      : car.fueltype === "gas"
        ? Math.round(
            (car.miles / car.mpg) * FEES_FUEL_CONSTANTS.fuelTaxRatePerGallon,
          ) || 0
        : 0,
  );

  const fuelTaxTotal = fuelTaxes.reduce<number>((sum, t) => sum + (t ?? 0), 0);

  useEffect(() => {
    setFeeResults((prevItems) => {
      const updated = prevItems.map((item) => {
        switch (item.name) {
          case "Registration Fee":
            return {
              ...item,
              value: cars.length * FEES_FUEL_CONSTANTS.registrationFee,
            };
          case "Age-Based Fee": {
            // Calcuate Age-Based fee by vehicle age
            const currentYear = new Date().getFullYear();
            const total = cars.reduce((sum, car) => {
              const age = currentYear - car.year;
              let fee = 0;
              const ab = FEES_FUEL_CONSTANTS.ageBased;
              switch (true) {
                case age <= 2:
                  fee = ab.age0to2;
                  break;
                case age <= 5:
                  fee = ab.age3to5;
                  break;
                case age <= 8:
                  fee = ab.age6to8;
                  break;
                case age <= 11:
                  fee = ab.age9to11;
                  break;
                default:
                  fee = ab.age12plus;
                  break;
              }
              return sum + fee;
            }, 0);
            return { ...item, value: total };
          }
          case "Corridor Fee": {
            const corridorTotal = cars.reduce((sum, car) => {
              return (
                sum + (FEES_FUEL_CONSTANTS.corridorFeeByCounty[car.county] ?? 0)
              );
            }, 0);
            return { ...item, value: corridorTotal };
          } // $10 per car per year in certain counties
          case "Driver Education Fee":
            return {
              ...item,
              value: cars.length * FEES_FUEL_CONSTANTS.driverEducationFee,
            };
          case "Uninsured Motorist Fee":
            return {
              ...item,
              value: cars.length * FEES_FUEL_CONSTANTS.uninsuredMotoristFee,
            };
          case "Alternative Fuel Fee": {
            // Calcuates the maximum additional fee for evs. True amount will be lower for Hybrids and if the user is enrolled in the Road Usage Program
            const evCount = cars.filter(
              (car) => car.fueltype === "electric",
            ).length;
            return {
              ...item,
              value: evCount * FEES_FUEL_CONSTANTS.alternativeFuelFee,
            };
          }
          case "Pollution Control Fee": {
            const apcTotal = cars.reduce((sum, car) => {
              if (car.fueltype === "electric") return sum;
              return (
                sum +
                (FEES_FUEL_CONSTANTS.pollutionControlFeeByCounty[car.county] ??
                  0)
              );
            }, 0);
            return { ...item, value: apcTotal };
          }
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

  return (
    <div className="flex flex-row h-full w-full justify-center gap-8">
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
          {cars.length !== 0 ? (
            <div className="flex flex-col text-sm justify-self-end p-2 gap-2">
              <div>
                *Fuel taxes are estimated from miles diven and combined expected
                fuel efficiency. Individual tax liability will vary with driving
                behavior and vehicle maintainance.
              </div>
              <div>
                **Results are illustrative of full-year registration fees.
                Part-year registrations may differ.
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className="flex flex-col h-90vh w-1/3 bg-[#e0e0e0] text-black my-2 mr-2 p-2 rounded-xl gap-y-4">
        <div className="text-center font-bold p-2 text-2xl">
          Estimated fuel tax & registration fees
        </div>
        <div>
          <div className="italic font-bold text-center text-xl mb-2">
            Fuel Tax
          </div>
          <div className="grid w-full place-self-center grid-cols-[15%_55%_20%_5%_5%] bg-white text-black text-base rounded-xl p-2 divide-y divide-gray-400">
            {cars.map((car, i) => (
              <React.Fragment key={car.id}>
                <div className="col-start-1"></div>
                <div className="col-start-2">
                  {car.make} {car.model}
                </div>
                <div className="col-start-3 text-right">$</div>
                <div className="col-start-4 text-right">
                  {fuelTaxes[i] === null ? "N/A" : fuelTaxes[i]}
                </div>
                <div className="col-start-5"></div>
              </React.Fragment>
            ))}
            <div className="col-start-1"></div>
            <div className="col-start-2">Total</div>
            <div className="col-start-3 text-right ">$</div>
            <div className="col-start-4 text-right ">{fuelTaxTotal}</div>
            <div className="col-start-5"></div>
            <div className="row-span-5"></div>
          </div>
        </div>
        <div>
          <div className="italic font-bold text-center text-xl mb-2">
            Registration Fees
          </div>
          {openFee && (
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpenFee(null)}
            />
          )}
          <div className="grid w-full place-self-center grid-cols-[5%_55%_30%_5%_5%] bg-white text-black text-base rounded-xl p-2 divide-y divide-gray-400">
            {feeResults.map((result) => (
              <React.Fragment key={result.id}>
                <div className="col-start-1 relative flex items-center justify-center">
                  {feeInfo[result.name] && (
                    <>
                      <button
                        onClick={() =>
                          setOpenFee(
                            openFee === result.name ? null : result.name,
                          )
                        }
                        className="rounded-full text-black hover:text-gray-600 leading-none"
                        style={{
                          fontSize: "20px",
                          backgroundColor: "transparent",
                        }}
                        aria-label={`More info about ${result.name}`}
                      >
                        🛈
                      </button>
                      {openFee === result.name && (
                        <div
                          className="absolute right-0 top-6 z-20 w-64 bg-white border border-gray-300 rounded-lg shadow-xl p-3 text-left text-base text-gray-700"
                          style={{
                            fontSize: "16px",
                          }}
                        >
                          <p className="mb-2">
                            {feeInfo[result.name].description}
                          </p>
                          {result.name != "Total" && (
                            <p className="text-xs text-gray-400">
                              Utah Code §{feeInfo[result.name].statute}
                            </p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
                <div className="col-start-2 flex items-center">
                  {result.name}
                </div>
                <div className="col-start-3 flex items-center justify-end">
                  $
                </div>
                <div className="col-start-4 flex items-center justify-end">
                  {result.value}
                </div>
                <div className="col-start-5"></div>
              </React.Fragment>
            ))}
            <div className="col-span-3"></div>
          </div>
        </div>
        <div className="flex flex-row bg-white text-black font-bold text-base rounded-xl p-2 gap-8 justify-end">
          <div>Estimated Annual Total: </div>
          <div className="flex mr-8">
            ${" "}
            {fuelTaxTotal +
              (feeResults.find((t) => t.name === "Total")?.value ?? 0)}
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
  Uniform (Age-Based) Fees: https://dmv.utah.gov/register/registration-taxes-fees/uniform-fees/
  - registration fee [41-1a-1206]
  - age-based fee [59-2-405.1]

Fixed Fees:
  Driver Education Fee [$2.50/ car/ year] [41-11-1204]
  Uninsured Motorist Identification Fee [$1.00/ car/ year] [41-1a-1218]
  Alternative Fuel Fees` [$180``/ car/ year] [72-1-213.1]
    `Applies only to EVs
    ``$180 is the maximum per year; drivers enrolled in the Road usage charge program may pay less depending on miles driven [>14,440 miles].

  Corridor Fee [$10/ car/ year] in [Salt Lake, Davis, Utah, Weber, Summit, Wasatch, Iron, Box Elder, Washington, Tooele, Morgan] [41-1a-1222]

Air Pollution Control* (APC) Fee [$/ car/ year] [41-1a-12]
  Salt Lake $3.00
  Davis $3.00
  Cache $3.00
  Utah $2.00
  Weber $2.00

  *Does not apply to EVs


- Fuel Tax [59-12-201]

*/
