import {
  RATE_COMPONENTS,
  formatRateLabel,
  type SalesLocationWithFeature,
} from "../MetaMisc/types";

function ResultCard({ location, feature }: SalesLocationWithFeature) {
  const p = feature?.properties ?? {};

  return (
    <div className="bg-white rounded-xl p-3 text-left text-sm">
      <div className="font-bold text-base mb-1">{location.address}</div>
      <div className="text-gray-500 mb-2">{p.METRONAME}</div>
      <table className="w-full border-collapse">
        <tbody>
          {RATE_COMPONENTS.filter((key) => p[key] != null).map((key) => (
            <tr key={key}>
              <td className="pr-2 py-0.5 text-gray-700">
                {formatRateLabel(key)}
              </td>
              <td className="text-right py-0.5">
                {(p[key] * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
          <tr className="border-t border-gray-300 font-bold">
            <td className="pr-2 pt-1">Total</td>
            <td className="text-right pt-1">
              {(p.CURRRATE * 100).toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function SalesResultsBlock({
  locationsWithFeatures,
}: {
  locationsWithFeatures: SalesLocationWithFeature[];
}) {
  return (
    <div className="flex flex-col overflow-hidden w-1/5 m-2 p-2 text-[#17301b] bg-[#e0e0e0] rounded-xl text-center shadow-xl/20 outline-1 gap-2">
      <div className="text-2xl font-bold my-2 p-2">Estimated Sales Taxes</div>
      {locationsWithFeatures.length === 0 ? (
        <div className="text-sm text-gray-500 mt-4">
          Add a location to the left to see your taxing area(s).
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-hidden hover:overflow-y-auto focus-within:overflow-y-auto min-h-0">
          {locationsWithFeatures.map((lf) => (
            <ResultCard key={lf.location.id} {...lf} />
          ))}
        </div>
      )}
    </div>
  );
}
