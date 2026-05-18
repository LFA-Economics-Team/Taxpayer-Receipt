"use client";

import { useRef, useState } from "react";
import {
  useAppContext,
  INCOME_TAX_ENTITY_SHARES,
  FUEL_TAX_ENTITY_SHARES,
} from "../../AppContext";
import { rasterizeSvg } from "../../utils/rasterizeSvg";
import { ControlBlock } from "./ControlBlock";
import { SankeyBlock } from "./SankeyBlock";
import { ResultsBlock } from "./ResultsBlock";
import { HomeTutorial } from "../MetaMisc/Tutorials";

export function HomeContent() {
  const sankeyContainerRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const {
    incomeInfo,
    incomeTax,
    salesTax,
    propertyTax,
    fuelTax,
    fees,
    totalTax,
    purposeAmounts,
    entityAmounts,
    entityPurposeMap,
    propertyTaxEntityShares,
    salesEntityShares,
    feesEntityShares,
    stateOnly,
    properties,
    cars,
    tutorialOpen,
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

      const primaryProperty = properties.find((p) => p.prime) ?? properties[0];
      const firstCar = cars[0];

      const stateTotal = entityAmounts["state"] ?? 0;
      const statePurposes = entityPurposeMap["state"] ?? {};
      const pdfTaxAmounts = stateOnly
        ? {
            incomeTax: incomeTax * INCOME_TAX_ENTITY_SHARES.state,
            salesTax: salesTax * salesEntityShares.state,
            propertyTax: propertyTax * propertyTaxEntityShares.state,
            fuelTax: fuelTax * FUEL_TAX_ENTITY_SHARES.state,
            fees: fees * feesEntityShares.state,
          }
        : { incomeTax, salesTax, propertyTax, fuelTax, fees };
      const pdfTotalTax = stateOnly ? stateTotal : totalTax;
      const pdfPurposeAmounts = stateOnly
        ? Object.fromEntries(
            Object.entries(statePurposes).map(([k, share]) => [
              k,
              stateTotal * share,
            ]),
          )
        : purposeAmounts;

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
          taxAmounts={pdfTaxAmounts}
          totalTax={pdfTotalTax}
          purposeAmounts={pdfPurposeAmounts}
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
    } catch {
      setPdfError(true);
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <>
      {pdfError && (
        <div
          className="fixed inset-0 z-[1002] flex items-center justify-center bg-gray-100/70"
          onClick={() => setPdfError(false)}
        >
          <div
            className="flex flex-col bg-white text-[#17301b] rounded-xl shadow-xl p-6 w-80 gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="font-bold text-base">
              Download failed. Please refresh the page and try again.
            </div>
            <div className="text-sm">
              Refreshing the page will wipe all user-entered information.
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setPdfError(false)}
                className="flex-1 py-1 rounded-xl border border-gray-300 text-[#17301b] hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-1 rounded-xl bg-green-700 text-white hover:bg-green-600 transition-colors"
              >
                Refresh anyway?
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-row h-full w-full text-black">
        <ControlBlock />
        <SankeyBlock containerRef={sankeyContainerRef} />
        <ResultsBlock
          onDownloadPdf={handleDownloadPdf}
          isGeneratingPdf={isGeneratingPdf}
        />
        {tutorialOpen && <HomeTutorial />}
      </div>
    </>
  );
}
