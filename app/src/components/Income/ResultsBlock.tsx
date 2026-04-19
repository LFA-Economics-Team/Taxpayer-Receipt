import {
  formatDollars,
  ResultsDisclaimer,
  type IncomeInfo,
} from "../MetaMisc/types";

export function ResultsBlock({ incomeInfo }: { incomeInfo: IncomeInfo }) {
  return (
    <div className="flex flex-col overflow-hidden w-1/5 m-2 p-2 text-[#17301b] bg-[#e0e0e0] rounded-xl text-center shadow-xl/20 outline-1 gap-2">
      <div className="text-2xl font-bold my-2 p-2">Estimated Income Taxes</div>
      {incomeInfo.annualIncome === 0 ? (
        <div className="text-sm text-gray-500 mt-4">
          Enter income to the left to see your taxing area(s).
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl p-2">
            <div>
              Based on the information provided, taxpayers like you typically...
            </div>
            <div className="grid grid-cols[55%_20%_5%_20%_] text-left gap-y-2">
              <div className="grid row-start-1 ">Earn between</div>
              <div className="grid col-start-3 text-center">
                {formatDollars(incomeInfo.annualIncome)}
              </div>
              <div className="grid col-start-5 text-center">
                {formatDollars(incomeInfo.annualIncome)}
              </div>

              <div className="grid row-start-2">Pay an Effective Rate of</div>
              <div className="grid row-start-2 col-start-3 col-span-3 text-center">
                Effective Rate
              </div>

              <div className="grid row-start-3">With household size</div>
              <div className="grid row-start-3 col-start-3 col-span-3 text-center">
                about {incomeInfo.householdSize}
              </div>

              <div className="grid row-start-4 col-span-5 border-t border-gray-300"></div>

              <div className="grid row-start-5 font-bold">
                Estimated Tax Liability
              </div>

              <div className="grid row-start-5 col-start-3 col-span-3 text-center">
                about{" "}
                {formatDollars(
                  incomeInfo.annualIncome * incomeInfo.effectiveRate,
                )}
              </div>
            </div>
          </div>
          <ResultsDisclaimer />
        </>
      )}
    </div>
  );
}
