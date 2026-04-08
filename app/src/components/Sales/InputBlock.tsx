type properties = {
  lat: number;
  lon: number;
  value: number;
};

type entities = {
  name: string;
  type: string;
  rate: number;
  liability: number;
};

export function InputBlock() {
  return (
    <div className="flex flex-col h-90-vh w-1/5 justify-between bg-[#17301b]/90 rounded-xl shadow-xl/20 text-white text-center m-2 p-2 gap-2">
      Input Block
    </div>
  );
}
