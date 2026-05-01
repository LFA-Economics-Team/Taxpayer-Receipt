import type React from "react";
import { ReceiptSankey } from "./ReceiptSankey";
import {
  useAppContext,
  TAX_KEYS,
  type TaxKey,
  INCOME_TAX_ENTITY_SHARES,
  FUEL_TAX_ENTITY_SHARES,
} from "../../AppContext";

const NODE_NAME: Record<string, string> = {
  incomeTax: "Income Tax",
  salesTax: "Sales Tax",
  propertyTax: "Property Tax",
  fuelTax: "Fuels",
  fees: "Fees",
  state: "State",
  county: "County",
  schoolDistrict: "School District",
  municipality: "Municipality",
  specialDistricts: "Special Districts",
  criminalJustice: "Criminal Justice",
  higherEd: "Colleges and Universities",
  econDev: "Economic Development",
  generalGov: "General Government",
  infrastructure: "Infrastructure",
  muniServices: "Municipal Services",
  naturalRes: "Natural Resources",
  publicEd: "Public Education",
  socialServices: "Social Services",
};

// Canonical order determines Sankey column layout
const ALL_NODE_NAMES = Object.values(NODE_NAME);

export function SankeyBlock({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const {
    incomeTax,
    propertyTax,
    salesTax,
    fuelTax,
    fees,
    entityAmounts,
    entityPurposeMap,
    propertyTaxEntityShares,
    feesEntityShares,
    salesEntityShares,
  } = useAppContext();

  const taxAmounts: Record<TaxKey, number> = {
    incomeTax,
    salesTax,
    propertyTax,
    fuelTax,
    fees,
  };
  const sharesByTax: Record<TaxKey, Record<string, number>> = {
    incomeTax: INCOME_TAX_ENTITY_SHARES,
    fuelTax: FUEL_TAX_ENTITY_SHARES,
    propertyTax: propertyTaxEntityShares,
    salesTax: salesEntityShares,
    fees: feesEntityShares,
  };

  const namedLinks = [
    ...TAX_KEYS.flatMap((tax) =>
      Object.entries(sharesByTax[tax]).map(([entity, share]) => ({
        source: NODE_NAME[tax],
        target: NODE_NAME[entity],
        value: taxAmounts[tax] * share,
      })),
    ),
    ...Object.entries(entityPurposeMap).flatMap(([entity, shares]) =>
      Object.entries(shares).map(([purpose, share]) => ({
        source: NODE_NAME[entity],
        target: NODE_NAME[purpose],
        value: entityAmounts[entity] * share,
      })),
    ),
  ].filter((l) => l.value > 0);

  const inner = (() => {
    if (namedLinks.length === 0) {
      return (
        <div className="text-gray-400 text-sm m-auto">
          Answer the questions to the left to see how your tax dollars flow.
        </div>
      );
    }

    const activeNameSet = new Set(
      namedLinks.flatMap((l) => [l.source, l.target]),
    );
    const activeNodes = ALL_NODE_NAMES.filter((name) =>
      activeNameSet.has(name),
    );
    const nameToIndex = Object.fromEntries(
      activeNodes.map((name, i) => [name, i]),
    );

    const data = {
      nodes: activeNodes.map((name) => ({ name })),
      links: namedLinks.map((l) => ({
        source: nameToIndex[l.source],
        target: nameToIndex[l.target],
        value: l.value,
      })),
    };

    return <ReceiptSankey data={data} containerRef={containerRef} />;
  })();

  return (
    <div className="flex flex-col w-3/5 place-content-center text-center my-2 rounded-xl shadow-xl/20 bg-[#e0e0e0]">
      {inner}
    </div>
  );
}
