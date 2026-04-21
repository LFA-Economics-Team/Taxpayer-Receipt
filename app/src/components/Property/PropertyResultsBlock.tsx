import { type Entity, ResultsDisclaimer } from "../MetaMisc/types";

function ResultCard({ entity }: { entity: Entity }) {
  return (
    <div className="bg-white rounded-xl p-2">
      <div className="font-bold text-center">{entity.name}</div>
      <div className="text-center">{entity.county} County</div>
      <div className="text-center">{entity.type}</div>
      <div className=" flex flex-row justify-around xt-sm text-gray-600">
        <div>Tax Rate: </div>
        <div> {(entity.rate * 100).toFixed(4)}%</div>
      </div>
      <div className=" flex flex-row justify-around xt-sm text-gray-600">
        <div>Estimated Liability: </div>
        <span className="font-semibold text-black">
          $
          {entity.liability.toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </span>
      </div>
    </div>
  );
}

export function PropertyResultsBlock({ entities }: { entities: Entity[] }) {
  const total = entities.reduce((sum, e) => sum + e.liability, 0);

  return (
    <div className="flex flex-col overflow-hidden w-1/5 m-2 p-2 text-[#17301b] bg-[#e0e0e0] rounded-xl text-center shadow-xl/20 outline-1 gap-2">
      <div className="text-2xl font-bold my-2 p-2">
        Estimated Property Taxes
      </div>
      {entities.length === 0 ? (
        <div className="text-sm text-gray-500 mt-4">
          Add a property to the left to see your taxing entities.
        </div>
      ) : (
        <>
          <div
            className="flex flex-col gap-2 overflow-y-hidden hover:overflow-y-auto 
  focus-within:overflow-y-auto min-h-0 flex-1"
          >
            {entities.map((e) => (
              <ResultCard key={e.id} entity={e} />
            ))}
          </div>
          <div className="py-1 border-t bg-white rounded-xl border-gray-400 font-bold text-lg shrink-0">
            Total: $
            {total.toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </div>
          <ResultsDisclaimer />
        </>
      )}
    </div>
  );
}
