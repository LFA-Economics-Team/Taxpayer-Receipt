export type Car = {
  id: number;
  make: string;
  model: string;
  year: number;
  miles: number;
  mpg: number;
  fueltype: string;
  county: string;
};

export type Property = {
  id: number;
  address: string;
  value: number;
  prime: boolean;
  rent: boolean;
  liability?: number;
  lat?: number;
  lon?: number;
};

export type Entity = {
  id: number;
  name: string;
  type: string;
  county: string;
  rate: number;
  value: number;
  liability: number;
};

export async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lon: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "en" } });
  const data = await res.json();
  if (!data.length) return null;
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}
