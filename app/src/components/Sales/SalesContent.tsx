import { SalesInputBlock } from "./SalesInputBlock";
import { SalesMapBlock } from "./SalesMapBlock";
import { SalesResultsBlock } from "./SalesResultsBlock";
import { useAppContext } from "../../AppContext";

export function SalesContent() {
  const {
    locations,
    addLocation,
    updateLocation,
    removeLocation,
    locationsWithFeatures,
  } = useAppContext();

  return (
    <div className="flex flex-row overflow-hidden h-full w-full text-black">
      <SalesInputBlock
        locations={locations}
        onAdd={addLocation}
        onUpdate={updateLocation}
        onRemove={removeLocation}
      />
      <SalesMapBlock locationsWithFeatures={locationsWithFeatures} />
      <SalesResultsBlock locationsWithFeatures={locationsWithFeatures} />
    </div>
  );
}
