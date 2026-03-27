export function NavBar() {
  return (
    <div className="flex ml-8 text-xl flex-row justify-start gap-8 w-2/4 min-w-120 ">
      <div className="flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52]">
        Home
      </div>

      <div className="flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52]">
        Income
      </div>
      <div className="flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52]">
        Sales
      </div>
      <div className="flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52]">
        Property
      </div>
      <div className="flex p-2 place-self-center text-white no-underline rounded-xl hover:bg-[#5e5a52]">
        Fuel & Fees
      </div>
    </div>
  );
}

/*
      <div
        href="/pages/map"
        className="place-self-center text-white no-underline"
      >
        Map
      </div>


*/
