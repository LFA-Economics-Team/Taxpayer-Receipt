import { RecieptSankey } from "./RecieptSankey";
import {
  useAppContext,
  TAX_TO_ENTITY,
  ENTITY_TO_PURPOSE,
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
  econDev: "Economic Development",
  higherEd: "Education, Higher",
  publicEd: "Education, Public",
  generalGov: "General Government",
  infrastructure: "Infrastructure",
  naturalRes: "Natural Resources",
  socialServices: "Social Services",
};

// Canonical order determines Sankey column layout
const ALL_NODE_NAMES = Object.values(NODE_NAME);

export function SankeyBlock() {
  const { incomeTax, propertyTax, salesTax, fuelTax, fees } = useAppContext();

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

  const namedLinks = [
    ...Object.entries(TAX_TO_ENTITY).flatMap(([tax, shares]) =>
      Object.entries(shares).map(([entity, share]) => ({
        source: NODE_NAME[tax],
        target: NODE_NAME[entity],
        value: taxAmounts[tax] * share,
      })),
    ),
    ...Object.entries(ENTITY_TO_PURPOSE).flatMap(([entity, shares]) =>
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

    return <RecieptSankey data={data} />;
  })();

  return (
    <div className="flex flex-col w-3/5 place-content-center text-center my-2 rounded-xl shadow-xl/20 bg-[#e0e0e0]">
      {inner}
    </div>
  );
}
