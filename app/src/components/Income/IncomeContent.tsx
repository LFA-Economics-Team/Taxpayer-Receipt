import { useState } from "react";
import { ControlBlock } from "./ControlBlock";
import { GraphBlock } from "./GraphBlock";
import { ResultsBlock } from "./ResultsBlock";

export function IncomeContent() {
  const [incomeInfo, setIncomeInfo] = useState({
    annualIncome: 0,
    filingStatus: "",
    dependents: 0,
  });

  return (
    <div className="flex flex-row h-full w-full justify-between text-center gap-2">
      <ControlBlock />
      <GraphBlock />
      <ResultsBlock />
    </div>
  );
}
