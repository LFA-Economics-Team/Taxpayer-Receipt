const gridItems = [
  { id: 1, title: "Effective Tax Rate by Income", content: "Test" },
  { id: 2, title: "Block 2", content: "Test" },
  { id: 3, title: "Aggregate Liability by Income", content: "Test" },
  { id: 4, title: "Block 4", content: "Test" },
];

export function GraphBlock() {
  return (
    <div className="flex flex-col h-90vh w-3/5 border-2 bg-[#e0e0e0] my-2 rounded-xl p-0.5">
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-0.5 rounded-xl">
        {gridItems.map((item) => (
          <div className="border-1 rounded-xl p-2">
            <div>{item.title}</div>
            <div>{item.content}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/*
Statistical breakdowns:
  - Effective Rate graph: income percentile vs effective tax rate
    - primary curve shows how effective tax rate changes with income
    - add a vertical line to show the user where in the income spectrum they fall based on the user-input gross income
    - add a horizontal line at the statuory income tax rate; the area between this line and the effective rate curve is the impact of deductions/ credits

  - Collections graph: income percentile vs nominal liability 
    - primary curce shows how nominal liability changes with income [likely an exponential relationship; consider logging this curve]
    - add breakpoints to show how much different shares of the income spectrum contribute to total collections
  
  - Make graphs responsive to number of dependents and filing status?
  - allow graphs to fill the graphblock when selected?

*/
