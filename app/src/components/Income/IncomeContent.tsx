import { ControlBlock } from "./ControlBlock";
import { GraphBlock } from "./GraphBlock";
import { ResultsBlock } from "./ResultsBlock";
import { useAppContext } from "../../AppContext";
import { IncomeTutorial } from "../MetaMisc/Tutorials";

export function IncomeContent() {
  const { incomeInfo, setIncomeInfo, tutorialOpen } = useAppContext();

  return (
    <div className="flex flex-row h-full w-full justify-between text-center gap-2">
      <ControlBlock incomeInfo={incomeInfo} setIncomeInfo={setIncomeInfo} />
      <GraphBlock incomeInfo={incomeInfo} />
      <ResultsBlock incomeInfo={incomeInfo} />
      {tutorialOpen && <IncomeTutorial />}
    </div>
  );
}
