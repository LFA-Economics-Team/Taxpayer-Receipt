import { useAppContext } from "../../AppContext";
import { formatDollars } from "../MetaMisc/types";

export function ResultsBlock() {
  const { incomeInfo, incomeTax, propertyTax, salesTax, fuelTax, fees } =
    useAppContext();

  return (
    <div className="flex flex-col w-1/5 justify-between m-2 p-2 gap-8 text-[#17301b] rounded-xl shadow-xl/20 outline-1">
      <div className="flex flex-row justify-center gap-8 items-center text-[12px] text-center">
        <div>
          <div>Utah State Capitol</div>
          <div>350 State Street</div>
          <div>Salt Lake City, UT 84103</div>
        </div>
        <img
          className="h-20 w-20"
          src="/assets/Utah Seal.png"
          alt="State Seal"
        ></img>
      </div>
      <div className="flex flex-col grow max-h-1/3 bg-white rounded-xl text-right">
        <div className="italic font-bold text-center text-[18px]">
          Your Estimated Taxes Paid
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%] grid-rows-[0fr_1fr_1fr_1fr_1fr_1fr_1fr_0fr] divide-y divide-gray-400">
          <div className="row-start-1 col-span-3"></div>

          <div className="row-start-2">Income</div>
          <div className="row-start-2 col-start-2"></div>
          <div className="row-start-2 col-start-3 text-center">
            {formatDollars(incomeTax)}
          </div>

          <div className="row-start-3 bg-emerald-950/15">Sales</div>
          <div className="row-start-3 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-3 col-start-3 text-center bg-emerald-950/15">
            {formatDollars(salesTax)}
          </div>

          <div className="row-start-4">Property</div>
          <div className="row-start-4 col-start-2"></div>
          <div className="row-start-4 col-start-3 text-center">
            {" "}
            {formatDollars(propertyTax)}
          </div>

          <div className="row-start-5 bg-emerald-950/15">Fuel</div>
          <div className="row-start-5 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-5 col-start-3 text-center bg-emerald-950/15">
            {formatDollars(fuelTax)}
          </div>

          <div className="row-start-6">Fees</div>
          <div className="row-start-6 col-start-2"></div>
          <div className="row-start-6 col-start-3 text-center">
            {" "}
            {formatDollars(fees)}
          </div>

          <div className="row-start-7 font-bold bg-emerald-950/15">Total</div>
          <div className="row-start-7 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-7 col-start-3 font-bold text-center bg-emerald-950/15">
            {formatDollars(incomeTax + salesTax + propertyTax + fuelTax + fees)}
          </div>

          <div className="row-start-8 font-bold ">Effective Tax Rate</div>
          <div className="row-start-8 col-start-2 "></div>
          <div className="row-start-8 col-start-3 font-bold text-center">
            {incomeInfo.annualIncome === 0
              ? 0
              : (
                  (100 *
                    (incomeTax + salesTax + propertyTax + fuelTax + fees)) /
                  incomeInfo.annualIncome
                ).toFixed(2)}
            %
          </div>

          <div className="row-start-9 col-span-3"></div>
        </div>
      </div>
      <div className="flex flex-col grow max-h-1/2 bg-white rounded-xl">
        <div className="italic font-bold text-center text-[18px]">
          {" "}
          Your Estimated Public Purchases
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%] divide-y divide-gray-400 text-right">
          <div className="row-start-1 col-span-3"></div>

          <div className="row-start-2">Criminal Justice</div>
          <div className="row-start-2 col-start-2"></div>
          <div className="row-start-2 col-start-3 text-center">$0</div>

          <div className="row-start-3 bg-emerald-950/15">
            Economic Development
          </div>
          <div className="row-start-3 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-3 col-start-3 text-center bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-4">Education, Higher</div>
          <div className="row-start-4 col-start-2"></div>
          <div className="row-start-4 col-start-3 text-center">$0</div>

          <div className="row-start-5 bg-emerald-950/15">Education, Public</div>
          <div className="row-start-5 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-5 col-start-3 text-center bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-6">General Government</div>
          <div className="row-start-6 col-start-2"></div>
          <div className="row-start-6 col-start-3 text-center">$0</div>

          <div className="row-start-7 bg-emerald-950/15">Infrastructure</div>
          <div className="row-start-7 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-7 col-start-3 text-center bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-8 ">Natural Resources</div>
          <div className="row-start-8 col-start-2"></div>
          <div className="row-start-8 col-start-3 text-center">$0</div>

          <div className="row-start-9 bg-emerald-950/15">Social Services</div>
          <div className="row-start-9 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-9 col-start-3 text-center bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-10 font-bold">Total</div>
          <div className="row-start-10 col-start-2"></div>
          <div className="row-start-10 col-start-3 text-center font-bold">
            $0
          </div>

          <div className="row-start-11 col-span-3"></div>
        </div>
      </div>
      <div className="flex flex-row gap-4 justify-around">
        <div className="bg-white p-2 rounded-xl border-1 hover:bg-gray-200">
          Download PDF
        </div>
        <div className="bg-white p-2 rounded-xl border-1 hover:bg-gray-200">
          Email Receipt
        </div>
      </div>
    </div>
  );
}
