import { useState, useEffect } from "react";
import Select from "react-select";
import { useAppContext } from "../../AppContext";
import {
  filingOptions,
  formatDollars,
  lookupIncomeData,
  geocodeAddress,
} from "../MetaMisc/types";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";
import FuelData from "../../data/Misc/FuelData.json";

export function ControlBlock() {
  const {
    incomeInfo,
    setIncomeInfo,
    properties,
    upsertPrimaryProperty,
    cars,
    upsertFirstCar,
    clearAll,
  } = useAppContext();

  const primaryProperty = properties.find((p) => p.prime) ?? properties[0];
  const firstCar = cars[0];

  const [incomeDisplay, setIncomeDisplay] = useState(
    incomeInfo.annualIncome ? formatDollars(incomeInfo.annualIncome) : "",
  );
  const [valueEditing, setValueEditing] = useState(false);

  useEffect(() => {
    if (incomeInfo.annualIncome === 0) setIncomeDisplay("");
  }, [incomeInfo.annualIncome]);

  const modelOptions = (() => {
    if (!firstCar?.make) return [];
    const makeModels =
      (ModelOptions as Record<string, { value: string; label: string }[]>)[
        firstCar.make
      ] ?? [];
    if (firstCar.year) {
      const validModels = new Set(
        (FuelData as any[])
          .filter((e) => e.make === firstCar.make && e.year === firstCar.year)
          .map((e) => e.model),
      );
      return makeModels.filter((o) => validModels.has(o.value));
    }
    return makeModels;
  })();

  return (
    <div className="flex flex-col h-90-vh w-1/5 justify-between bg-[#17301b]/90 rounded-xl shadow-xl/20 text-white text-center m-2 p-2 gap-2">
      <div className="flex h-1/10 w-9/10 place-self-center font-bold italic text-[20px]">
        Answer the following questions to see what your tax dollars buy*
      </div>

      <div className="flex flex-col h-8/10 items-center gap-4">
        {/* General */}
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl pt-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">General</div>
          <div>
            What address are your taxes attributed to? This impacts which
            entities tax you.
          </div>
          <input
            className="border-1 px-2 m-2 rounded-xl"
            placeholder="Address"
            value={primaryProperty?.address ?? ""}
            onChange={(e) => upsertPrimaryProperty({ address: e.target.value })}
            onBlur={async (e) => {
              const coords = await geocodeAddress(e.target.value);
              if (coords)
                upsertPrimaryProperty({ address: e.target.value, ...coords });
            }}
          />
        </div>

        {/* Income */}
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">Income</div>
          <div className="flex flex-row justify-between items-center">
            <div>What is your household pre-tax income?</div>
            <input
              className="border-1 px-2 m-2 rounded-xl w-1/3"
              placeholder="Income"
              value={incomeDisplay}
              onChange={(e) => setIncomeDisplay(e.target.value)}
              onFocus={() => {
                if (incomeInfo.annualIncome)
                  setIncomeDisplay(String(incomeInfo.annualIncome));
              }}
              onBlur={() => {
                const raw = Number(incomeDisplay.replace(/[^0-9]/g, ""));
                const lookup = raw
                  ? lookupIncomeData(raw, incomeInfo.filingStatus)
                  : {};
                setIncomeInfo({ ...incomeInfo, annualIncome: raw, ...lookup });
                setIncomeDisplay(raw ? formatDollars(raw) : "");
              }}
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>What is your filing status?</div>
            <Select
              className="text-black w-1/2"
              options={filingOptions}
              isClearable={true}
              value={
                filingOptions.find(
                  (o) => o.value === incomeInfo.filingStatus,
                ) ?? null
              }
              onChange={(selected) => {
                const status = selected?.value ?? "";
                const lookup = incomeInfo.annualIncome
                  ? lookupIncomeData(incomeInfo.annualIncome, status)
                  : {};
                setIncomeInfo({
                  ...incomeInfo,
                  filingStatus: status,
                  ...lookup,
                });
              }}
            />
          </div>
        </div>

        {/* Property */}
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">Property</div>
          <div className="flex flex-row justify-between items-center">
            <div>What is your home's value?</div>
            <input
              className="border-1 px-2 m-2 rounded-xl w-1/3"
              type={valueEditing ? "number" : "text"}
              placeholder="Value"
              value={
                valueEditing
                  ? primaryProperty?.value || ""
                  : primaryProperty?.value
                    ? formatDollars(primaryProperty.value)
                    : ""
              }
              onFocus={() => setValueEditing(true)}
              onChange={(e) =>
                upsertPrimaryProperty({ value: Number(e.target.value) || 0 })
              }
              onBlur={() => setValueEditing(false)}
            />
          </div>
        </div>

        {/* Fuel & Fees */}
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">Fuel & Fees</div>
          <div className="flex flex-row justify-between items-center">
            <div>What is the model year of your vehicle?</div>
            <input
              className="border-1 px-2 m-2 rounded-xl w-1/3"
              type="number"
              placeholder="Year"
              value={firstCar?.year || ""}
              onChange={(e) =>
                upsertFirstCar({
                  year: Number(e.target.value) || 0,
                  model: "",
                })
              }
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>What is the Make of your vehicle?</div>
            <Select
              className="text-black w-1/2"
              options={MakeOptions}
              isClearable={true}
              placeholder="Make"
              value={
                MakeOptions.find((o) => o.value === firstCar?.make) ?? null
              }
              onChange={(opt) =>
                upsertFirstCar({ make: opt?.value ?? "", model: "" })
              }
            />
          </div>
          <div className="flex flex-row justify-between items-center">
            <div>What is the Model of your vehicle?</div>
            <Select
              className="text-black w-1/2"
              options={modelOptions}
              isClearable={true}
              placeholder="Model"
              value={
                firstCar?.make
                  ? ((
                      (
                        ModelOptions as Record<
                          string,
                          { value: string; label: string }[]
                        >
                      )[firstCar.make] ?? []
                    ).find((o) => o.value === firstCar.model) ?? null)
                  : null
              }
              onChange={(opt) => upsertFirstCar({ model: opt?.value ?? "" })}
            />
          </div>

          <div className="flex flex-row justify-between items-center">
            <div>How many miles do you drive annually?</div>
            <input
              className="border-1 px-2 m-2 rounded-xl w-1/3"
              type="number"
              placeholder="Miles"
              value={firstCar?.miles || ""}
              onChange={(e) =>
                upsertFirstCar({ miles: Number(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <button
          onClick={clearAll}
          className="flex flex-col w-5/10 self-center rounded-xl text-white hover:bg-gray-200 px-4 py-1 cursor-pointer"
        >
          Clear Receipt
        </button>
      </div>

      <div className="flex flex-col h-1/10 p-2 text-[14px]">
        *Your data are not stored or sent to any government entity. Results are
        illustrative of a typical full-year Utah resident with similar
        circumstances.
      </div>
    </div>
  );
}
