import {
  type Entity,
  type Property,
  ResultsDisclaimer,
  formatDollars,
} from "../MetaMisc/types";

function ResultCard({ entity }: { entity: Entity }) {
  return (
    <div className="bg-white rounded-xl text-base p-2">
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
          {formatDollars(entity.liability, 0, 0)}
        </span>
      </div>
    </div>
  );
}

export function PropertyResultsBlock({
  properties,
  entitiesByProperty,
}: {
  properties: Property[];
  entitiesByProperty: Record<number, Entity[]>;
}) {
  const total = Object.values(entitiesByProperty)
    .flat()
    .reduce((sum, e) => sum + e.liability, 0);

  const hasEntities = Object.values(entitiesByProperty).some(
    (es) => es.length > 0,
  );

  return (
    <div className="flex flex-col overflow-hidden w-1/5 m-2 p-2 text-[#17301b] bg-[#e0e0e0] rounded-xl text-center shadow-xl/20 outline-1 gap-2">
      <div className="text-2xl font-bold my-2 p-2">
        Estimated Property Taxes
      </div>
      {!hasEntities ? (
        <div className="text-sm text-gray-500 mt-4">
          Add a property to the left to see your taxing entities.
        </div>
      ) : (
        <>
          <div
            className="flex flex-col gap-4 overflow-y-hidden hover:overflow-y-auto
  focus-within:overflow-y-auto min-h-0 flex-1"
          >
            {properties
              .filter((p) => (entitiesByProperty[p.id]?.length ?? 0) > 0)
              .map((p) => {
                const propEntities = entitiesByProperty[p.id];
                const subtotal = propEntities.reduce(
                  (sum, e) => sum + e.liability,
                  0,
                );
                return (
                  <div key={p.id} className="flex flex-col gap-2">
                    <div className="font-bold text-sm bg-gray-300 rounded-lg px-2 py-1">
                      {p.address || `Property ${p.id}`}
                    </div>
                    {propEntities.map((e) => (
                      <ResultCard key={e.id} entity={e} />
                    ))}
                    <div className="text-sm font-semibold text-right pr-2 pb-1 border-b border-gray-400">
                      Subtotal: {formatDollars(subtotal, 0, 0)}
                    </div>
                  </div>
                );
              })}
          </div>
          <div className="py-1 border-t bg-white rounded-xl border-gray-400 font-bold text-base shrink-0">
            Total: {formatDollars(total, 0, 0)}
          </div>
          <ResultsDisclaimer />
        </>
      )}
    </div>
  );
}