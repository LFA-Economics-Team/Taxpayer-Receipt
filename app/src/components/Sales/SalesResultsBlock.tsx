import {
  RATE_COMPONENTS,
  formatRateLabel,
  formatDollars,
  type SalesLocationWithFeature,
} from "../MetaMisc/types";

const FOOD_STATE_RATE = 0.0175;
const STATE_COMPONENT = "STATE SALES AND USE TAX";

function calcLiability(
  key: string,
  rate: number,
  nonFood: number,
  food: number,
) {
  const foodRate = key === STATE_COMPONENT ? FOOD_STATE_RATE : rate;
  return nonFood * rate + food * foodRate;
}

function ResultCard({ location, feature }: SalesLocationWithFeature) {
  const p = feature?.properties ?? {};
  const { nonFoodSpending, foodSpending } = location;

  const activeComponents = RATE_COMPONENTS.filter((key) => p[key] != null);
  const totalLiability = activeComponents.reduce(
    (sum, key) =>
      sum + calcLiability(key, p[key], nonFoodSpending, foodSpending),
    0,
  );

  return (
    <div className="bg-white rounded-xl p-3 text-center text-sm">
      <div className="font-bold text-base mb-1">{p.METRONAME}</div>
      <div className="mb-2 text-black border-b border-gray-300">
        {location.address}
      </div>
      <div className="grid grid-cols-[60%_15%_20%]">
        {activeComponents.map((key) => {
          const liability = calcLiability(
            key,
            p[key],
            nonFoodSpending,
            foodSpending,
          );
          return (
            <>
              <div
                key={key}
                className="col-start-1 text-left text-xs border-r border-gray-300"
              >
                {formatRateLabel(key)}
              </div>
              <div key={key} className="col-start-2 text-right">
                {(p[key] * 100).toFixed(2)}%
              </div>
              <div key={key} className="col-start-3 text-right">
                {formatDollars(liability)}
              </div>
            </>
          );
        })}
        <div className="grid col-start-1 border-t border-gray-300 font-bold pt-1 text-left">
          Total
        </div>
        <div className="grid col-start-2 border-t border-gray-300 font-bold pt-1 text-right">
          {(p.CURRRATE * 100).toFixed(2)}%
        </div>
        <div className="grid col-start-3 border-t border-gray-300 font-bold pt-1 text-right">
          {formatDollars(totalLiability)}
        </div>
      </div>
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
