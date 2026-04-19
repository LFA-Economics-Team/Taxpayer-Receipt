import Select from "react-select";
import { filingOptions } from "../MetaMisc/types";

const rentOrOwn = [
  { value: "Rent", label: "Rent" },
  { value: "Own", label: "Own" },
];

export function ControlBlock() {
  return (
    <div className="flex flex-col h-90-vh w-1/5 justify-between bg-[#17301b]/90 rounded-xl shadow-xl/20 text-white text-center m-2 p-2 gap-2">
      <div className="flex h-1/10 w-9/10 place-self-center font-bold italic text-[20px]">
        Answer the following questions to see what your tax dollars buy*
      </div>
      <div className="flex flex-col h-8/10 items-center gap-4">
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl pt-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">General</div>
          <div>
            What address are your taxes attributed to? This impacts which
            entities tax you.
          </div>
          <form>
            <input className="border-1 px-2 m-2 rounded-xl" />
          </form>
        </div>
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60 divide-y divide-gray-400">
          <div className="font-bold text-[14px]">Income</div>
          <div className=" flex flex-row justify-between">
            <div>What is your household pre-tax income?</div>
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
          <div className=" flex flex-row justify-between">
            <div>What is your filing status?</div>
            <Select defaultValue={[filingOptions[0]]} options={filingOptions} />
          </div>
        </div>
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60 divide-y divide-gray-400">
          <div className="font-bold text-[14px]">Property</div>
          <div className=" flex flex-row justify-between">
            <div>Do you rent or own your primary residence?</div>
            <Select defaultValue={[rentOrOwn[0]]} options={rentOrOwn} />
          </div>
          <div className=" flex flex-row justify-between">
            <div>What is your home's value, or your monthly rent?</div>{" "}
            {/* Set this question up to be conditional on whether the user rents or owns*/}
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
        </div>{" "}
        <div className="flex flex-col w-9/10 bg-white text-[12px] text-[#17301b] rounded-xl p-2 inset-shadow-sm/60">
          <div className="font-bold text-[14px]">Fuel & Fees</div>
          <div className=" flex flex-row justify-between">
            <div>What is the Make of your vehicle?</div>
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
          <div className=" flex flex-row justify-between">
            <div>What is the Model of your vehilce?</div>
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
          <div className=" flex flex-row justify-between">
            <div>What is the model year of your vehicle?</div>
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
          <div className=" flex flex-row justify-between">
            <div>How many miles do you drive annually?</div>
            <form>
              <input className="border-1 px-2 m-2 rounded-xl" />
            </form>
          </div>
        </div>{" "}
        <div className="flex flex-col w-5/10 self-center bg-white rounded-xl text-[#17301b] hover:bg-gray-200">
          Clear Reciept
        </div>
      </div>

      <div className="flex flex-col h-1/10 p-2 text-[14px]">
        *Your data are not stored or sent to any government entity. Results are
        illustrative of a typical full-year Utah resident with similar
        circumstances.
      </div>
    </div>
  );
}
