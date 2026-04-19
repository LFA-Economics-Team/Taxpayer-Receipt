import { LineChartTemplate } from "./IncomeChartTemplate";
import type { IncomeInfo } from "../MetaMisc/types";

export function GraphBlock({ incomeInfo }: { incomeInfo: IncomeInfo }) {
  const gridItems = [
    {
      id: 1,
      title: "Lorenz Curve",
      content: (
        <LineChartTemplate
          title={"Utah's Lorenz Curve"}
          xDataKey={""}
          yDataKey={""}
          curveName={"Cumulative Share of Income"}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          filingStatus={incomeInfo.filingStatus}
        />
      ),
    },
    {
      id: 2,
      title: "Effective Rate on Income Percentile",
      content: (
        <LineChartTemplate
          title={"Effective Tax Rate by Income"}
          xDataKey={"status_conditioned_tile"}
          yDataKey={"EFFECTIVE_ON_FAGI"}
          curveName={"Effective Tax Rate"}
          showReferenceLine={true}
          horizonReferenceLineValue={0.0455}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          yAsPercent={true}
          filingStatus={incomeInfo.filingStatus}
        />
      ),
    },
    {
      id: 3,
      title: "Aggregate Liability on Income Perecntile",
      content: (
        <LineChartTemplate
          title={"Aggregate Tax by Income"}
          xDataKey={"status_conditioned_tile"}
          yDataKey={"Cumulative_Tax"}
          curveName={"Cumulative Share of Income Tax"}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          filingStatus={incomeInfo.filingStatus}
          yDomain={1}
        />
      ),
    },
    {
      id: 4,
      title: "Household Size on Income Percentile",
      content: (
        <LineChartTemplate
          title={"Household Size by Income"}
          xDataKey={"status_conditioned_tile"}
          yDataKey={"HH_SIZE"}
          curveName={"Household Size"}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          filingStatus={incomeInfo.filingStatus}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col w-3/5 border-2 my-2 rounded-xl p-0.5">
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 rounded-xl">
        {gridItems.map((item) => (
          <div className="border-1 rounded-xl p-2 bg-[#e0e0e0] text-black place-content-center">
            <div className=" h-full bg-white rounded-xl">{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
