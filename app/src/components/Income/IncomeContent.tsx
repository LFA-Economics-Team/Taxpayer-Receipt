import { useState } from "react";
import { ControlBlock } from "./ControlBlock";
import { GraphBlock } from "./GraphBlock";
import { ResultsBlock } from "./ResultsBlock";

export function IncomeContent() {
  const [incomeInfo, setIncomeInfo] = useState({
    annualIncome: 0,
    filingStatus: "",
    incomeTile: 0,
  });

  console.log(incomeInfo);

  return (
    <div className="flex flex-row h-full w-full justify-between text-center gap-2">
      <ControlBlock incomeInfo={incomeInfo} setIncomeInfo={setIncomeInfo} />
      <GraphBlock incomeInfo={incomeInfo} />
      <ResultsBlock />
    </div>
  );
}
