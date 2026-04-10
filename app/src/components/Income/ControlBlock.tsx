import { filingOptions } from "../MetaMisc/filingOptions";
import Select from "react-select";

export function ControlBlock() {
  return (
    <div className="flex flex-col h-90vh w-1/5 bg-[#17301b]/90 my-2 ml-2 rounded-xl p-2 gap-4">
      <div className=" text-white font-bold p-2 text-3xl">
        Calculate your Income Taxes below:
      </div>
      <div className="text-xl font-bold bg-gray-100/25 rounded-xl p-2">
        What are your income characteristics?
      </div>

      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-row justify-around">
          <div>Gross Annual Income </div>
          <input
            type="number"
            className="w-1/4 text-white text-sm rounded px-2 py-1 border border-gray-300"
            placeholder="Income"
          />
        </div>

        <div className="flex flex-row justify-around">
          <div>Filing Status </div>
          <Select
            defaultValue={[filingOptions[0]]}
            options={filingOptions}
            className="text-black"
          />
        </div>
        <div className="flex flex-row justify-around">
          <div>Number of Dependents</div>
          <input
            type="number"
            className="w-1/4 text-white text-sm rounded px-2 py-1 border border-gray-300"
            placeholder="Dependents"
          />
        </div>
      </div>

      <div className="text-xl font-bold bg-gray-100/25 rounded-xl p-2">
        Graph Controls
      </div>
    </div>
  );
}
