import { useState } from "react";
import type { SalesLocation } from "../MetaMisc/types";
import { geocodeAddress, formatDollars } from "../MetaMisc/types";

function SalesCard({
  location,
  onChange,
  onRemove,
}: {
  location: SalesLocation;
  onChange: (updated: SalesLocation) => void;
  onRemove: () => void;
}) {
  const [nonFoodEditing, setNonFoodEditing] = useState(false);
  const [foodEditing, setFoodEditing] = useState(false);

  const handleAddressBlur = async () => {
    if (!location.address) return;
    const coords = await geocodeAddress(location.address);
    if (coords) onChange({ ...location, ...coords });
  };

  return (
    <div className=" flex flex-row justify-around bg-gray-100/25 rounded-xl p-1 items-center">
      <div className="flex flex-col w-7/10 items-center gap-1 p-1">
        <input
          type="text"
          placeholder="Address"
          value={location.address}
          onChange={(e) => onChange({ ...location, address: e.target.value })}
          onBlur={handleAddressBlur}
          className=" w-9/10 text-white text-sm rounded px-2 py-1 border border-gray-300"
        />
        <input
          type={nonFoodEditing ? "number" : "text"}
          placeholder="Annual Non-Food Spending"
          value={
            nonFoodEditing
              ? location.nonFoodSpending || ""
              : location.nonFoodSpending
                ? formatDollars(location.nonFoodSpending)
                : ""
          }
          onFocus={() => setNonFoodEditing(true)}
          onBlur={() => setNonFoodEditing(false)}
          onChange={(e) =>
            onChange({ ...location, nonFoodSpending: Number(e.target.value) })
          }
          className=" w-9/10 text-white text-sm rounded px-2 py-1 border border-gray-300"
        />
        <input
          type={foodEditing ? "number" : "text"}
          placeholder="Annual Food Spending*"
          value={
            foodEditing
              ? location.foodSpending || ""
              : location.foodSpending
                ? formatDollars(location.foodSpending)
                : ""
          }
          onFocus={() => setFoodEditing(true)}
          onBlur={() => setFoodEditing(false)}
          onChange={(e) =>
            onChange({ ...location, foodSpending: Number(e.target.value) })
          }
          className=" w-9/10 text-white text-sm rounded px-2 py-1 border border-gray-300"
        />
      </div>
      <button onClick={onRemove} className="h-1/3 font-bold px-2">
        -
      </button>
    </div>
  );
}

export function SalesInputBlock({
  locations,
  onAdd,
  onUpdate,
  onRemove,
}: {
  locations: SalesLocation[];
  onAdd: () => void;
  onUpdate: (updated: SalesLocation) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex flex-col h-90-vh w-1/5 bg-[#17301b]/90 rounded-xl shadow-xl/20 text-white text-center m-2 p-2 gap-2">
      <div className="text-xl font-bold my-2">
        Calculate your sales taxes below:
      </div>
      <div className="text-base font-bold bg-gray-100/25 rounded-xl p-2">
        Where do you typically make purchases?
      </div>
      <div className="flex flex-col gap-2 overflow-y-hidden hover:overflow-y-auto focus-within:overflow-y-auto min-h-0">
        {locations.map((l) => (
          <SalesCard
            key={l.id}
            location={l}
            onChange={onUpdate}
            onRemove={() => onRemove(l.id)}
          />
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-2 w-full py-2 rounded-xl bg-green-700 text-white hover:bg-green-600 transition-colors"
      >
        + Add Location
      </button>
      {locations.length !== 0 ? (
        <div className="flex flex-col text-sm justify-self-end p-2 gap-2 text-gray-200 text-left">
          <div>
            *For food items, the state assess a lower rate of 1.75% while all
            other taxable transactions are assessed at 4.85%. Additionally, only
            the state, county, and local options apply to food purchases.
          </div>
          <div>
            **Consumers typically spend 30-35% of their income on non-food
            spending and 10-15% on food spending.
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
