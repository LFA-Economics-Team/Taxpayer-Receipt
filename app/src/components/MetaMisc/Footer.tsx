export function Footer() {
  return (
    <div className="flex justify-center bg-[#47443e] h-1/10 max-h-16 object-bottom  rounded-t-xl">
      <div className="p-2 text-l place-self-center">
        <div>A project in progress from the Legislative Fiscal Analyst </div>
        <div>
          Questions? Contact us! (
          <a
            className="no-underline text-white hover:text-blue-500"
            href="mailto:propapp@le.utah.gov"
          >
            PropApp@le.utah.gov
          </a>
          )
        </div>
      </div>
    </div>
  );
}
