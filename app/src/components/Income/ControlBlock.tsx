import {
  filingOptions,
  formatDollars,
  lookupIncomeData,
} from "../MetaMisc/types";
import type { IncomeInfo } from "../MetaMisc/types";
import Select from "react-select";
import { useState } from "react";

export function ControlBlock({
  incomeInfo,
  setIncomeInfo,
}: {
  incomeInfo: IncomeInfo;
  setIncomeInfo: (info: IncomeInfo) => void;
}) {
  const [incomeDisplay, setIncomeDisplay] = useState(
    incomeInfo.annualIncome ? formatDollars(incomeInfo.annualIncome) : "",
  );

  return (
    <div className="flex flex-col h-90vh w-1/5 bg-[#17301b]/90 my-2 ml-2 rounded-xl p-2 gap-4">
      <div className=" text-white font-bold p-2 text-xl">
        Calculate your Income Taxes below:
      </div>
      <div className="text-base font-bold bg-gray-100/25 rounded-xl p-2">
        What are your income characteristics?
      </div>

      <div className="flex flex-col gap-2 p-2 text-sm">
        <div className="flex flex-row justify-around">
          <div>Gross Annual Income </div>
          <input
            type="text"
            className="w-1/4 text-white text-sm rounded px-2 py-1 border border-gray-300"
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

        <div className="flex flex-row justify-around">
          <div>Filing Status </div>
          <Select
            options={filingOptions}
            className="text-black"
            value={
              filingOptions.find((o) => o.value === incomeInfo.filingStatus) ??
              null
            }
            onChange={(selected) => {
              const status = selected?.value ?? "";
              const lookup = incomeInfo.annualIncome
                ? lookupIncomeData(incomeInfo.annualIncome, status)
                : {};
              setIncomeInfo({ ...incomeInfo, filingStatus: status, ...lookup });
            }}
          />
        </div>
      </div>

      <div className="text-base font-bold bg-gray-100/25 rounded-xl p-2">
        Graph Controls
      </div>
    </div>
  );
}
