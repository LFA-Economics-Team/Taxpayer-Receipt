import { Fragment } from "react";
import {
  useAppContext,
  TAX_TO_ENTITY,
  ENTITY_TO_PURPOSE,
} from "../../AppContext";
import { formatDollars } from "../MetaMisc/types";

const TAX_ROW_CONFIG = [
  { label: "Income", key: "incomeTax" },
  { label: "Sales", key: "salesTax" },
  { label: "Property", key: "propertyTax" },
  { label: "Fuel", key: "fuelTax" },
  { label: "Fees", key: "fees" },
] as const;

const PURPOSE_ROW_CONFIG = [
  { label: "Criminal Justice", key: "criminalJustice" },
  { label: "Economic Development", key: "econDev" },
  { label: "Education, Higher", key: "higherEd" },
  { label: "Education, Public", key: "publicEd" },
  { label: "General Government", key: "generalGov" },
  { label: "Infrastructure", key: "infrastructure" },
  { label: "Natural Resources", key: "naturalRes" },
  { label: "Social Services", key: "socialServices" },
] as const;

export function ResultsBlock() {
  const { incomeInfo, incomeTax, propertyTax, salesTax, fuelTax, fees } =
    useAppContext();

  const taxAmounts: Record<string, number> = {
    incomeTax,
    salesTax,
    propertyTax,
    fuelTax,
    fees,
  };

  const entityAmounts = Object.fromEntries(
    Object.keys(ENTITY_TO_PURPOSE).map((entity) => [
      entity,
      Object.entries(TAX_TO_ENTITY).reduce(
        (sum, [tax, shares]) => sum + taxAmounts[tax] * (shares[entity] ?? 0),
        0,
      ),
    ]),
  );

  const purposeAmount = (purpose: string) =>
    Object.entries(ENTITY_TO_PURPOSE).reduce(
      (sum, [entity, shares]) =>
        sum + entityAmounts[entity] * (shares[purpose] ?? 0),
      0,
    );

  const totalTax = incomeTax + salesTax + propertyTax + fuelTax + fees;
  const totalPurpose = PURPOSE_ROW_CONFIG.reduce(
    (s, { key }) => s + purposeAmount(key),
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
                  {formatDollars(taxAmounts[key])}
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
          {PURPOSE_ROW_CONFIG.map(({ label, key }, i) => {
            const shade = i % 2 === 1 ? "bg-emerald-950/15" : "";
            return (
              <Fragment key={key}>
                <div className={shade}>{label}</div>
                <div className={shade}></div>
                <div className={`text-center ${shade}`}>
                  {formatDollars(purposeAmount(key))}
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
