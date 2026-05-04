import { Fragment } from "react";
import {
  useAppContext,
  INCOME_TAX_ENTITY_SHARES,
  FUEL_TAX_ENTITY_SHARES,
} from "../../AppContext";
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
  },
  {
    label: "Colleges & Universities",
    key: "higherEd",
  },
  {
    label: "Economic Development",
    key: "econDev",
  },
  {
    label: "General Government",
    key: "generalGov",
  },
  {
    label: "Infrastructure",
    key: "infrastructure",
  },
  {
    label: "Municipal Services",
    key: "muniServices",
  },
  {
    label: "Natural Resources",
    key: "naturalRes",
  },
  {
    label: "Public Education",
    key: "publicEd",
  },
  {
    label: "Social Services",
    key: "socialServices",
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
  const {
    incomeInfo,
    totalTax,
    purposeAmounts,
    entityAmounts,
    entityPurposeMap,
    propertyTaxEntityShares,
    salesEntityShares,
    feesEntityShares,
    stateOnly,
  } = ctx;

  const stateShares: Record<string, number> = {
    incomeTax: INCOME_TAX_ENTITY_SHARES.state,
    salesTax: salesEntityShares.state,
    propertyTax: propertyTaxEntityShares.state,
    fuelTax: FUEL_TAX_ENTITY_SHARES.state,
    fees: feesEntityShares.state,
  };

  const statePurposes = entityPurposeMap["state"] ?? {};
  const stateTotal = entityAmounts["state"] ?? 0;

  const displayTax = (key: string) =>
    stateOnly
      ? (ctx[key as keyof typeof ctx] as number) * stateShares[key]
      : (ctx[key as keyof typeof ctx] as number);

  const displayPurpose = (key: string) =>
    stateOnly
      ? stateTotal * (statePurposes[key] ?? 0)
      : (purposeAmounts[key] ?? 0);

  const displayTaxTotal = stateOnly ? stateTotal : totalTax;

  const totalPurpose = stateOnly
    ? stateTotal
    : PURPOSE_ROW_CONFIG.reduce(
        (s, { key }) => s + (purposeAmounts[key] ?? 0),
        0,
      );

  return (
    <div
      className="relative flex flex-col w-1/5 justify-between m-2 p-2 pt-4 pb-4 gap-8 text-[#17301b] font-mono"
      style={{ backgroundColor: "#022c2210" }}
    >
      {/* Top scalloped edge */}
      <div
        className="absolute top-0 left-0 right-0 pointer-events-none"
        style={{
          height: "12px",
          background:
            "radial-gradient(circle at 10px 0, white 9px, transparent 10px) -10px 0 / 20px 12px repeat-x",
        }}
      />
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
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%]">
          {TAX_ROW_CONFIG.map(({ label, key }, i) => {
            const shade = i % 2 === 1 ? "bg-emerald-950/15" : "";
            return (
              <Fragment key={key}>
                <div className={shade}>{label}</div>
                <div className={shade}></div>
                <div className={`text-center ${shade}`}>
                  {formatDollars(displayTax(key))}
                </div>
              </Fragment>
            );
          })}
          <div className="font-bold bg-emerald-950/15">Total</div>
          <div className="bg-emerald-950/15"></div>
          <div className="font-bold text-center bg-emerald-950/15">
            {formatDollars(displayTaxTotal)}
          </div>
          <div className="font-bold">Effective Tax Rate</div>
          <div></div>
          <div className="font-bold text-center">
            {incomeInfo.annualIncome === 0
              ? 0
              : ((100 * displayTaxTotal) / incomeInfo.annualIncome).toFixed(2)}
            %
          </div>
        </div>
      </div>

      <div className="flex flex-col grow max-h-1/2 bg-white rounded-xl">
        <div className="italic font-bold text-center text-[18px]">
          Infered Public Purchases
        </div>
        <div className="grid h-full w-full place-self-center grid-cols-[60%_10%_30%] text-right">
          {PURPOSE_ROW_CONFIG.map(({ label, key }, i) => {
            const shade = i % 2 === 1 ? "bg-emerald-950/15" : "";
            return (
              <Fragment key={key}>
                <div className={shade}>{label}</div>
                <div className={shade}></div>
                <div className={`text-center ${shade}`}>
                  {formatDollars(displayPurpose(key))}
                </div>
              </Fragment>
            );
          })}
          <div className="font-bold bg-emerald-950/15">Total</div>
          <div className="bg-emerald-950/15"></div>
          <div className="font-bold text-center bg-emerald-950/15">
            {formatDollars(totalPurpose)}
          </div>
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

      {/* Bottom scalloped edge */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "12px",
          background:
            "radial-gradient(circle at 10px 12px, white 9px, transparent 10px) -10px 0 / 20px 12px repeat-x",
        }}
      />
    </div>
  );
}
