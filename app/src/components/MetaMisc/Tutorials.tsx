import { NavLink } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { useState } from "react";

export function TutorialTemplate({ children }: { children?: React.ReactNode }) {
  const { tutorialOpen, setTutorialOpen } = useAppContext();

  return (
    <div className="fixed text-[#17301b] inset-0 place-self-center content-center h-full w-full z-[1001] w-64 bg-gray-100/70 rounded-lg shadow-xl">
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
  const [TutPage, setTutPage] = useState(0);
  const { setTutorialOpen } = useAppContext();

  return (
    <TutorialTemplate>
      {TutPage === 0 && (
        <div className="flex flex-col h-full gap-y-8 justify-around text-center">
          <div className=" text-4xl font-bold">
            Welcome to the Utah State Taxpayer Receipt!
          </div>

          <div className="flex w-2/3 text-xl place-self-center justify-center">
            The purpose of this tool is to estimate how an individual's taxes
            flow into public puchases. Each of the four tax types below
            represent one of the major sources of revenue within the state.
          </div>

          <div className="flex flex-row w-full h-1/2 font-bold text-2xl place-self-center justify-between px-2">
            <div className="flex flex-col w-1/4 justify-around">
              <div>💸 Income Tax 💸</div>
              <div className="text-base font-normal ">
                One of the largest revenue sources for the state, income tax is
                assessed as a percentage on most types of individual income.
                These fund are constitutionally earmarked for public education
                and social services.
              </div>
              <NavLink
                to="/income"
                className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/30"
              >
                Explore More
              </NavLink>
            </div>
            <div className="flex flex-col w-1/4 justify-around">
              <div>🛒 Sales Tax 🛒</div>
              <div className="text-base font-normal ">
                The total rate levied on a given taxable transation is the sum
                of the individual components charged by each level of
                government. While the state's sales tax revenue in unrestricted,
                most rate components are dedicated to specific purposes.
              </div>
              <NavLink
                to="/sales"
                className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/30"
              >
                Explore More
              </NavLink>
            </div>
            <div className="flex flex-col w-1/4 justify-around">
              <div>🏠 Property Tax 🏠</div>
              <div className="text-base font-normal ">
                While the state itself does not charge property taxes, political
                subdivisions like counties and cities rely on them to fund many
                essential functions including public education, munuipal
                services, and other basic government admistration.
              </div>
              <NavLink
                to="/property"
                className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/30"
              >
                Explore More
              </NavLink>
            </div>
            <div className="flex flex-col w-1/4 justify-around">
              <div>🚗 Fuel Tax and Fees 🚗</div>
              <div className="text-base font-normal ">
                Fuel tax entails a fixed levy on each gallon of gas sold in the
                state. The fees here are the collection of charged due when
                registring a vehicle. Both generally go to infrastructure
                related projects.
              </div>
              <NavLink
                to="/fees"
                className="text-xl w-1/2 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/30"
              >
                Explore More
              </NavLink>
            </div>
          </div>

          <div className="flex w-2/3 text-xl place-self-center justify-center">
            Answer the questions on the next few pages to see what your taxes
            buy, or select one of the tax types to explore it in more detail.
          </div>
          <button
            onClick={() => setTutPage(TutPage + 1)}
            className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
          >
            {" "}
            Estimate my Taxes →
          </button>
        </div>
      )}
      {TutPage >= 1 && TutPage <= 4 && (
        <div className="flex flex-col h-full gap-y-8 justify-between text-center">
          <div className="flex flex-row h-1/20 w-8/10 rounded-xl overflow-hidden justify-evenly border-1 place-self-center divide-x ">
            <div
              className={`flex w-1/4 justify-center ${TutPage >= 1 ? "bg-emerald-950/15" : ""}`}
            >
              General
            </div>
            <div
              className={`flex w-1/4 justify-center ${TutPage >= 2 ? "bg-emerald-950/15" : ""}`}
            >
              Income
            </div>
            <div
              className={`flex w-1/4 justify-center ${TutPage >= 3 ? "bg-emerald-950/15" : ""}`}
            >
              Property
            </div>
            <div
              className={`flex w-1/4 justify-center ${TutPage >= 4 ? "bg-emerald-950/15" : ""}`}
            >
              Fuel & Fees
            </div>
          </div>

          {TutPage === 1 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                The first step in getting an estimate of your tax liablity is to
                know which local taxes apply to you. The taxpayer reciept
                achieves this by using geocoding (latitude/ longitude) to filter
                the list of all political subdivisions in the state down to only
                those which tax you. As a result, the reciept needs a location
                to put your taxes. This can be as specific as a street address
                or as general as a city or county. For maximum accuracy, please
                enter a location physically proximate to your primary residence.
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">
                  Please enter the primary location in the state where you
                  reside/ are taxed:
                </div>
                <div> User location input</div>
              </div>
              <div>
                This location determines which property tax entities and sales
                tax rates apply during the final calculations.
              </div>
            </>
          )}
          {TutPage === 2 && <div>Income content goes here.</div>}
          {TutPage === 3 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Using the location you entered in the 'General' tab, the reciept
                can identify the set of property tax entities that apply to you.
                That, combined with the value of your property, computes an
                estimate of your property taxes by applying each entity's tax
                rate to your property's value.
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">
                  Please enter the fair market value of your primary residence:
                </div>
                <div> User property value input</div>
              </div>
              <div className=" flex w-1/2 place-self-center">
                Primary residences recive a tax exemption of 45% of their fair
                market value, resulting in the property being taxed on 55% of
                it's value while other classes of property are taxed on the full
                value. The receipt automatically accounts for this in its
                calcualtions.
              </div>
            </>
          )}
          {TutPage === 4 && <div>Fuel & Fees content goes here.</div>}

          <div className="flex flex-row w-full gap-8 justify-center">
            <button
              onClick={() => setTutPage(TutPage - 1)}
              className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              ← Back
            </button>
            <button
              onClick={() =>
                TutPage === 4 ? setTutorialOpen(false) : setTutPage(TutPage + 1)
              }
              className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              {TutPage === 4 ? "Show my Results" : "Next →"}
            </button>
          </div>
        </div>
      )}
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
