"use client";

export function ResultsBlock() {
  return (
    <div className="flex flex-col h-90-vh w-1/5 justify-between m-2 p-2 text-[#17301b] rounded-xl shadow-xl/20 outline-1">
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
      <div className="flex flex-col h-3/10 bg-white rounded-xl">
        <div className="italic font-bold text-center text-[18px]">
          Your Estimated Taxes Paid
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_30%_10%] grid-rows-[0fr_1fr_1fr_1fr_1fr_1fr_1fr_0fr] divide-y divide-gray-400">
          <div className="row-start-1 col-span-3"></div>

          <div className="row-start-2">Income</div>
          <div className="row-start-2 col-start-2"></div>
          <div className="row-start-2 col-start-3">$0</div>

          <div className="row-start-3 bg-emerald-950/15">Sales</div>
          <div className="row-start-3 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-3 col-start-3 bg-emerald-950/15">$0</div>

          <div className="row-start-4">Property</div>
          <div className="row-start-4 col-start-2"></div>
          <div className="row-start-4 col-start-3">$0</div>

          <div className="row-start-5 bg-emerald-950/15">Fuel</div>
          <div className="row-start-5 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-5 col-start-3 bg-emerald-950/15">$0</div>

          <div className="row-start-6">Fees</div>
          <div className="row-start-6 col-start-2"></div>
          <div className="row-start-6 col-start-3">$0</div>

          <div className="row-start-7 font-bold bg-emerald-950/15">Total</div>
          <div className="row-start-7 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-7 col-start-3 font-bold bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-8 col-span-3"></div>

          <div className="row-start-9 font-bold ">Effective Tax Rate</div>
          <div className="row-start-9 col-start-2 "></div>
          <div className="row-start-9 col-start-3 font-bold">0%</div>

          <div className="row-start-10 col-span-3"></div>
        </div>
      </div>
      <div className="flex flex-col h-4/10 bg-white rounded-xl">
        <div className="italic font-bold text-center text-[18px]">
          {" "}
          Your Estimated Public Purchases
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_30%_10%] divide-y divide-gray-400">
          <div className="row-start-1 col-span-3"></div>

          <div className="row-start-2">Income</div>
          <div className="row-start-2 col-start-2"></div>
          <div className="row-start-2 col-start-3">$0</div>

          <div className="row-start-3 bg-emerald-950/15">Sales</div>
          <div className="row-start-3 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-3 col-start-3 bg-emerald-950/15">$0</div>

          <div className="row-start-4">Property</div>
          <div className="row-start-4 col-start-2"></div>
          <div className="row-start-4 col-start-3">$0</div>

          <div className="row-start-5 bg-emerald-950/15">Fuel</div>
          <div className="row-start-5 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-5 col-start-3 bg-emerald-950/15">$0</div>

          <div className="row-start-6">Fees</div>
          <div className="row-start-6 col-start-2"></div>
          <div className="row-start-6 col-start-3">$0</div>

          <div className="row-start-7 font-bold bg-emerald-950/15">Total</div>
          <div className="row-start-7 col-start-2 bg-emerald-950/15"></div>
          <div className="row-start-7 col-start-3 font-bold bg-emerald-950/15">
            $0
          </div>

          <div className="row-start-8 col-span-3"></div>

          <div className="row-start-9 font-bold ">Effective Tax Rate</div>
          <div className="row-start-9 col-start-2 "></div>
          <div className="row-start-9 col-start-3 font-bold">0%</div>

          <div className="row-start-10 col-span-3"></div>
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
