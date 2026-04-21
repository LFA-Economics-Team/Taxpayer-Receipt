import { useState } from "react";
import type { Property } from "../MetaMisc/types";
import { geocodeAddress, formatDollars } from "../MetaMisc/types";

function PropertyCard({
  property,
  onChange,
  onRemove,
}: {
  property: Property;
  onChange: (updated: Property) => void;
  onRemove: () => void;
}) {
  const [valueEditing, setValueEditing] = useState(false);

  const handleAddressBlur = async () => {
    if (!property.address) return;
    const coords = await geocodeAddress(property.address);
    if (coords) onChange({ ...property, ...coords });
  };

  return (
    <div className=" flex flex-row justify-around bg-gray-100/25 rounded-xl p-1 items-center">
      <div className="flex flex-col w-7/10 items-center gap-1 p-1">
        <input
          type="text"
          placeholder="Address"
          value={property.address}
          onChange={(e) => onChange({ ...property, address: e.target.value })}
          onBlur={handleAddressBlur}
          className=" w-9/10 text-white text-sm rounded px-2 py-1 border border-gray-300"
        />
        <input
          type={valueEditing ? "number" : "text"}
          placeholder="Value"
          value={
            valueEditing
              ? property.value || ""
              : property.value
                ? formatDollars(property.value)
                : ""
          }
          onFocus={() => setValueEditing(true)}
          onBlur={() => setValueEditing(false)}
          onChange={(e) =>
            onChange({ ...property, value: Number(e.target.value) })
          }
          className="w-9/10 text-white text-sm rounded px-2 py-1 border border-gray-300"
        />
        <div className="flex flex-row gap-4 align-bottom">
          <div> Is this your Primary Residence?* </div>
          <input
            type="checkbox"
            name="Primary Residence"
            checked={property.prime}
            onChange={(e) => onChange({ ...property, prime: e.target.checked })}
            className="scale-175"
          />
        </div>
        <div className="flex flex-row gap-4 align-bottom">
          <div> Do you rent this property? </div>
          <input
            type="checkbox"
            name="Rent"
            checked={property.rent}
            onChange={(e) => onChange({ ...property, rent: e.target.checked })}
            className="scale-175"
          />
        </div>
      </div>
      <button className="h-1/3 font-bold px-2" onClick={onRemove}>
        -
      </button>
    </div>
  );
}

export function PropertyInputBlock({
  properties,
  onAdd,
  onUpdate,
  onRemove,
}: {
  properties: Property[];
  onAdd: () => void;
  onUpdate: (updated: Property) => void;
  onRemove: (id: number) => void;
}) {
  return (
    <div className="flex flex-col w-1/5 bg-[#17301b]/90 rounded-xl shadow-xl/20 text-white text-center m-2 p-2 gap-2">
      <div className="text-2xl font-bold my-2">
        Calculate your property taxes below:
      </div>
      <div className="text-xl font-bold bg-gray-100/25 rounded-xl p-2">
        What real property do you own or rent?
      </div>
      <div
        className="flex flex-col gap-2 overflow-y-hidden hover:overflow-y-auto 
  focus-within:overflow-y-auto min-h-0"
      >
        {properties.map((p) => (
          <PropertyCard
            key={p.id}
            property={p}
            onChange={onUpdate}
            onRemove={() => onRemove(p.id)}
          />
        ))}
      </div>
      <button
        className="mt-2 w-full py-2 rounded-xl bg-green-700 text-white hover:bg-green-600 transition-colors"
        onClick={onAdd}
      >
        + Add Property
      </button>
      {properties.length !== 0 ? (
        <div className="flex flex-col text-sm justify-self-end p-2 gap-2 text-gray-200 text-left">
          <div>
            *Primary residences receive an exemption equal to 45% of taxable
            value. Consequently, such properties are taxed on the remaining 55%.
            All other properties are taxed at full value.
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
