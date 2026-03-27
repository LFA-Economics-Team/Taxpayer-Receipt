"use client";

export function HomeContent() {
  return (
    <div className="flex flex-row h-full w-full bg-blue-200">
      <div className="flex flex-col h-full w-1/5 text-black p-4 ">
        {" "}
        Control Block
      </div>
      <div className="flex flex-col h-full w-3/5 bg-green-200">
        Sankey Block
      </div>
      <div className="flex flex-col h-full w-1/5 bg-purple-200">
        Results Block
      </div>
    </div>
  );
}
