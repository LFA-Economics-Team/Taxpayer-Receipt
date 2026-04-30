import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { formatDollars } from "../MetaMisc/types";

export const TAX_ROW_CONFIG = [
  { label: "Income", key: "incomeTax" },
  { label: "Sales", key: "salesTax" },
  { label: "Property", key: "propertyTax" },
  { label: "Fuel", key: "fuelTax" },
  { label: "Fees", key: "fees" },
] as const;

export const PURPOSE_ROW_CONFIG = [
  {
    label: "Criminal Justice",
    key: "criminalJustice",
    link: "https://cobi.utah.gov/2026/4527/overview",
  },
  {
    label: "Economic Development",
    key: "econDev",
    link: "https://cobi.utah.gov/2026/4528/overview",
  },
  {
    label: "Education, Higher",
    key: "higherEd",
    link: "https://cobi.utah.gov/2026/6/overview",
  },
  {
    label: "Education, Public",
    key: "publicEd",
    link: "https://cobi.utah.gov/2026/8/overview",
  },
  {
    label: "General Government",
    key: "generalGov",
    link: "https://cobi.utah.gov/2026/4526/overview",
  },
  {
    label: "Infrastructure",
    key: "infrastructure",
    link: "https://cobi.utah.gov/2026/4529/overview",
  },
  {
    label: "Natural Resources",
    key: "naturalRes",
    link: "https://cobi.utah.gov/2026/7/overview",
  },
  {
    label: "Social Services",
    key: "socialServices",
    link: "https://cobi.utah.gov/2026/5/overview",
  },
] as const;

export function ResultsBlock({
  onDownloadPdf,
  isGeneratingPdf,
}: {
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}) {
  const ctx = useAppContext();
  const { incomeInfo, totalTax, purposeAmounts } = ctx;
  const totalPurpose = PURPOSE_ROW_CONFIG.reduce(
    (s, { key }) => s + (purposeAmounts[key] ?? 0),
    0,
  );

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
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%] divide-y divide-gray-400">
          {TAX_ROW_CONFIG.map(({ label, key }, i) => {
            const shade = i % 2 === 1 ? "bg-emerald-950/15" : "";
            return (
              <Fragment key={key}>
                <div className={shade}>{label}</div>
                <div className={shade}></div>
                <div className={`text-center ${shade}`}>
                  {formatDollars(ctx[key])}
                </div>
              </Fragment>
            );
          })}
          <div className="font-bold bg-emerald-950/15">Total</div>
          <div className="bg-emerald-950/15"></div>
          <div className="font-bold text-center bg-emerald-950/15">
            {formatDollars(totalTax)}
          </div>
          <div className="font-bold">Effective Tax Rate</div>
          <div></div>
          <div className="font-bold text-center">
            {incomeInfo.annualIncome === 0
              ? 0
              : ((100 * totalTax) / incomeInfo.annualIncome).toFixed(2)}
            %
          </div>
          <div className="col-span-3"></div>
        </div>
      </div>

      <div className="flex flex-col grow max-h-1/2 bg-white rounded-xl">
        <div className="italic font-bold text-center text-[18px]">
          Your Estimated Public Purchases
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%] divide-y divide-gray-400 text-right">
          {PURPOSE_ROW_CONFIG.map(({ label, key, link }, i) => {
            const shade = i % 2 === 1 ? "bg-emerald-950/15" : "";
            return (
              <Fragment key={key}>
                <NavLink className={shade} to={link}>
                  {label}
                </NavLink>
                <div className={shade}></div>
                <div className={`text-center ${shade}`}>
                  {formatDollars(purposeAmounts[key] ?? 0)}
                </div>
              </Fragment>
            );
          })}
          <div className="font-bold">Total</div>
          <div></div>
          <div className="font-bold text-center">
            {formatDollars(totalPurpose)}
          </div>
          <div className="col-span-3"></div>
        </div>
      </div>

      <div className="flex flex-row gap-4 justify-around">
        <div
          onClick={isGeneratingPdf ? undefined : onDownloadPdf}
          className={`p-2 rounded-xl border-1 ${isGeneratingPdf ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-200 cursor-pointer"}`}
        >
          {isGeneratingPdf ? "Generating..." : "Download PDF"}
        </div>
      </div>
    </div>
  );
}
