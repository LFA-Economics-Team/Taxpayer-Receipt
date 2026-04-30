"use client";

import { useRef, useState } from "react";
import { useAppContext } from "../../AppContext";
import { rasterizeSvg } from "../../utils/rasterizeSvg";
import { ControlBlock } from "./ControlBlock";
import { SankeyBlock } from "./SankeyBlock";
import { ResultsBlock } from "./ResultsBlock";

export function HomeContent() {
  const sankeyContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const {
    incomeInfo,
    incomeTax,
    salesTax,
    propertyTax,
    fuelTax,
    fees,
    totalTax,
    purposeAmounts,
    properties,
    cars,
  } = useAppContext();

  async function handleDownloadPdf() {
    setIsGeneratingPdf(true);
    try {
      const svgEl = sankeyContainerRef.current?.querySelector("svg");
      const sankeyImageUrl = svgEl
        ? await rasterizeSvg(svgEl as SVGSVGElement)
        : "";
      const utahSealUrl = `${window.location.origin}/assets/Utah%20Seal.png`;

      const [{ pdf }, { ReceiptPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./ReceiptPDF"),
      ]);

      const primaryProperty =
        properties.find((p) => p.prime) ?? properties[0];
      const firstCar = cars[0];

      const blob = await pdf(
        <ReceiptPDF
          userInputs={{
            address: primaryProperty?.address ?? "",
            annualIncome: incomeInfo.annualIncome,
            filingStatus: incomeInfo.filingStatus,
            homeValue: primaryProperty?.value ?? 0,
            carYear: firstCar?.year ?? 0,
            carMake: firstCar?.make ?? "",
            carModel: firstCar?.model ?? "",
            carMiles: firstCar?.miles ?? 0,
          }}
          taxAmounts={{ incomeTax, salesTax, propertyTax, fuelTax, fees }}
          totalTax={totalTax}
          purposeAmounts={purposeAmounts}
          sankeyImageUrl={sankeyImageUrl}
          utahSealUrl={utahSealUrl}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "taxpayer-receipt.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="flex flex-row h-full w-full text-black">
      <ControlBlock />
      <SankeyBlock containerRef={sankeyContainerRef} />
      <ResultsBlock
        onDownloadPdf={handleDownloadPdf}
        isGeneratingPdf={isGeneratingPdf}
      />
    </div>
  );
}
