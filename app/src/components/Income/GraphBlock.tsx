import { useState } from "react";
import { LineChartTemplate } from "./IncomeChartTemplate";
import { STATE_INCOME_RATE } from "../../AppContext";
import type { IncomeInfo } from "../MetaMisc/types";

export function GraphBlock({ incomeInfo }: { incomeInfo: IncomeInfo }) {
  const [expandedId, setExpandedId] = useState(0);

  const gridItems = [
    {
      id: 1,
      title: "Lorenz Curve",
      content: (
        <LineChartTemplate
          title={"Cumulative Income by Income"}
          xDataKey={"status_conditioned_tile"}
          yDataKey={"Cumulative_Income_Share"}
          curveName={"Cumulative Share of Income"}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          equalityReferenceLine={true}
          yAsPercent={true}
          yAxisLabel={"Percent of Income"}
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
          horizonReferenceLineValue={STATE_INCOME_RATE}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          yAsPercent={true}
          yAxisLabel={"Effective Tax Rate"}
          filingStatus={incomeInfo.filingStatus}
        />
      ),
    },
    {
      id: 3,
      title: "Aggregate Liability on Income Percentile",
      content: (
        <LineChartTemplate
          title={"Cumulative Tax by Income"}
          xDataKey={"status_conditioned_tile"}
          yDataKey={"Cumulative_Tax_Share"}
          curveName={"Cumulative Share of Income Tax"}
          verticalReferenceLineValue={incomeInfo.incomeTile}
          equalityReferenceLine={true}
          yAsPercent={true}
          yAxisLabel={"Percent of Tax"}
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
          yDomain={5}
          yAxisLabel={"Household Size"}
        />
      ),
    },
  ];

  const expandedItem = gridItems.find((item) => item.id === expandedId);

  return (
    <div className="flex flex-col w-3/5 border-2 my-2 rounded-xl p-0.5">
      {expandedItem ? (
        <div className="relative flex border-1 items-center h-full w-full rounded-xl p-2 bg-[#e0e0e0] text-black place-content-center hover:border-white">
          <div
            className="h-full w-full bg-white rounded-xl "
            onClick={() => setExpandedId(0)}
          >
            {expandedItem.content}
            <div className="absolute top-5 right-5 border-1 rounded-xl font-bold size-6 hover:hover:bg-emerald-950/30 hover:text-white">
              X
            </div>
          </div>
        </div>
      ) : (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-1 rounded-xl">
          {gridItems.map((item) => (
            <div
              key={item.id}
              className="border-1 rounded-xl p-2 bg-[#e0e0e0] text-black place-content-center hover:border-white transition-[filter]"
              onClick={() => setExpandedId(item.id)}
            >
              <div className="h-full bg-white rounded-xl">{item.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
