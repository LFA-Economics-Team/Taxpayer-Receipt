import { NavLink } from "react-router-dom";
import { useAppContext } from "../../AppContext";

export function TutorialTemplate({ children }: { children?: React.ReactNode }) {
  const { tutorialOpen, setTutorialOpen } = useAppContext();

  return (
    <div className="fixed inset-0 place-self-center content-center h-full w-full z-20 w-64 bg-gray-100/70 rounded-lg shadow-xl">
      <div className="flex flex-col p-4 bg-white h-7/10 w-7/10 rounded-xl place-self-center">
        <button
          onClick={() => setTutorialOpen(!tutorialOpen)}
          className="flex border-1 rounded-xl size-6 place-self-end "
        >
          <p className="flex w-full place-self-center justify-center text-white">
            X
          </p>
        </button>
        {children}
      </div>
    </div>
  );
}

export function HomeTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        <div className=" text-[#17301b] text-4xl font-bold">
          Welcome to the Utah State Taxpayer Receipt!
        </div>

        <div className="flex w-2/3 text-xl place-self-center justify-center">
          The purpose of this tool is to estimate how an individual's taxes flow
          into public puchases. Each of the four tax types below represent one
          of the major sources of revenue within the state.
        </div>

        <div className="flex flex-row w-full h-1/2 font-bold text-2xl place-self-center justify-between px-2">
          <div className="flex flex-col w-1/4 justify-around">
            <div>💸 Income Tax 💸</div>
            <div className="text-base font-normal ">
              One of the largest revenue sources for the state, income tax is
              assessed as a percentage on most types of individual income. These
              fund are constitutionally earmarked for public education and
              social services.
            </div>
            <NavLink
              to="/income"
              className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              Explore More
            </NavLink>
          </div>
          <div className="flex flex-col w-1/4 justify-around">
            <div>🛒 Sales Tax 🛒</div>
            <div className="text-base font-normal ">
              The total rate levied on a given taxable transation is the sum of
              the individual components charged by each level of government.
              While the state's sales tax revenue in unrestricted, most rate
              components are dedicated to specific purposes.
            </div>
            <NavLink
              to="/sales"
              className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              Explore More
            </NavLink>
          </div>
          <div className="flex flex-col w-1/4 justify-around">
            <div>🏠 Property Tax 🏠</div>
            <div className="text-base font-normal ">
              While the state itself does not charge property taxes, political
              subdivisions like counties and cities rely on them to fund many
              essential functions including public education, munuipal services,
              and other basic government admistration.
            </div>
            <NavLink
              to="/property"
              className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              Explore More
            </NavLink>
          </div>
          <div className="flex flex-col w-1/4 justify-around">
            <div>🚗 Fuel Tax and Fees 🚗</div>
            <div className="text-base font-normal ">
              Fuel tax entails a fixed levy on each gallon of gas sold in the
              state. The fees here are the collection of charged due when
              registring a vehicle. Both generally go to infrastructure related
              projects.
            </div>
            <NavLink
              to="/fees"
              className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              Explore More
            </NavLink>
          </div>
        </div>

        <div className="flex w-2/3 text-xl place-self-center justify-center">
          Answer the questions on the next few pages to see what your taxes buy,
          or select one of the tax types to explore it in more detail.
        </div>
        <div className="text-xl font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15">
          {" "}
          Estimate my Taxes
        </div>
      </div>
    </TutorialTemplate>
  );
}

export function IncomeTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        Income
      </div>
    </TutorialTemplate>
  );
}

export function SalesTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        Sales
      </div>
    </TutorialTemplate>
  );
}

export function PropertyTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        Property
      </div>
    </TutorialTemplate>
  );
}

export function FuelsTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        Fuels & Fees
      </div>
    </TutorialTemplate>
  );
}

export function LegTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-around text-center">
        Legislative Map
      </div>
    </TutorialTemplate>
  );
}
