import { NavLink } from "react-router-dom";
import { useAppContext } from "../../AppContext";
import { useState, useEffect } from "react";
import Select from "react-select";
import {
  geocodeAddress,
  formatDollars,
  filingOptions,
  lookupIncomeData,
} from "./types";
import type { FuelEntry } from "./types";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";
import FuelData from "../../data/Misc/FuelData.json";

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
  const {
    setTutorialOpen,
    properties,
    upsertPrimaryProperty,
    cars,
    upsertFirstCar,
    incomeInfo,
    setIncomeInfo,
  } = useAppContext();
  const primaryProperty = properties.find((p) => p.prime) ?? properties[0];
  const firstCar = cars[0];

  const modelOptions = (() => {
    if (!firstCar?.make) return [];
    const makeModels =
      (ModelOptions as Record<string, { value: string; label: string }[]>)[
        firstCar.make
      ] ?? [];
    if (firstCar.year) {
      const validModels = new Set(
        (FuelData as FuelEntry[])
          .filter((e) => e.make === firstCar.make && e.year === firstCar.year)
          .map((e) => e.model),
      );
      return makeModels.filter((o) => validModels.has(o.value));
    }
    return makeModels;
  })();

  const [TutPage, setTutPage] = useState(0);
  const [valueEditing, setValueEditing] = useState(false);
  const [incomeDisplay, setIncomeDisplay] = useState(
    incomeInfo.annualIncome ? formatDollars(incomeInfo.annualIncome) : "",
  );

  useEffect(() => {
    if (incomeInfo.annualIncome === 0) setIncomeDisplay("");
  }, [incomeInfo.annualIncome]);

  return (
    <TutorialTemplate>
      {TutPage === 0 && (
        <div className="flex flex-col h-full gap-y-8 justify-around text-center">
          <div className=" text-4xl font-bold">
            Welcome to the Utah State Taxpayer Receipt!
          </div>

          <div className="flex w-2/3 text-xl place-self-center justify-center">
            The purpose of this tool is to estimate how an individual's taxes
            flow into public purchases. Each of the four tax types below
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
                The first step in getting an estimate of your overall tax
                liablity is to know which local taxes apply to you. The taxpayer
                reciept achieves this by using geocoding (latitude/ longitude)
                to filter the list of all political subdivisions in the state
                down to only those which tax you. As a result, the reciept needs
                a location to put your taxes. This can be as specific as a
                street address or as general as a city or county. For maximum
                accuracy, please enter a location physically proximate to your
                primary residence.
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">
                  Please enter the primary location in the state where you
                  reside/ are taxed:
                </div>
                <input
                  className="w-1/4 border-1 px-2 m-2 rounded-xl place-self-center"
                  placeholder="City or County"
                  value={primaryProperty?.address ?? ""}
                  onChange={(e) =>
                    upsertPrimaryProperty({ address: e.target.value })
                  }
                  onBlur={async (e) => {
                    const coords = await geocodeAddress(e.target.value);
                    if (coords) {
                      const { city, county, ...latLon } = coords;
                      const normalizedCounty =
                        county?.replace(/ County$/i, "") ?? "";
                      upsertPrimaryProperty({
                        address: city ?? county ?? e.target.value,
                        county: normalizedCounty,
                        ...latLon,
                      });
                      if (cars.length > 0) {
                        upsertFirstCar({ county: normalizedCounty });
                      }
                    }
                  }}
                />
              </div>
              <div>
                This location determines which property tax entities and sales
                tax rates apply during the final calculations.
              </div>
            </>
          )}
          {TutPage === 2 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Instead of having you fill out an entire tax return to calculate
                your income tax, the Receipt uses a shortcut: effective tax
                rates. By calculating the effective tax rates conditioned on
                gross income and filing status for all taxpayers, the Receipt
                can approximate your income tax from a much smaller set of
                information than a full return.
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">
                  Please enter your total pre-tax houshold income:
                </div>
                <input
                  className="w-1/4 border-1 px-2 m-2 rounded-xl place-self-center"
                  placeholder="Income"
                  value={incomeDisplay}
                  onChange={(e) => setIncomeDisplay(e.target.value)}
                  onFocus={() => {
                    if (incomeInfo.annualIncome)
                      setIncomeDisplay(String(incomeInfo.annualIncome));
                  }}
                  onBlur={() => {
                    const raw = Number(incomeDisplay.replace(/[^0-9]/g, ""));
                    const lookup = raw
                      ? lookupIncomeData(raw, incomeInfo.filingStatus)
                      : {};
                    setIncomeInfo({
                      ...incomeInfo,
                      annualIncome: raw,
                      ...lookup,
                    });
                    setIncomeDisplay(raw ? formatDollars(raw) : "");
                  }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">What is your filing status?</div>
                <Select
                  className="w-1/4 place-self-center text-black text-left"
                  options={filingOptions}
                  isClearable={true}
                  placeholder="Filing Status"
                  value={
                    filingOptions.find(
                      (o) => o.value === incomeInfo.filingStatus,
                    ) ?? null
                  }
                  onChange={(selected) => {
                    const status = selected?.value ?? "";
                    const lookup = incomeInfo.annualIncome
                      ? lookupIncomeData(incomeInfo.annualIncome, status)
                      : {};
                    setIncomeInfo({
                      ...incomeInfo,
                      filingStatus: status,
                      ...lookup,
                    });
                  }}
                />
              </div>
              <div className=" flex w-1/2 place-self-center">
                Your income also allows the receipt to estimate your sales tax.
                On average, people tend to spend a relatively consistent share
                of income on taxable sales. Applying that share to the income
                you entered yields a approximation of annualized sales tax.
              </div>
            </>
          )}
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
                <input
                  className="w-1/4 border-1 px-2 m-2 rounded-xl place-self-center"
                  type={valueEditing ? "number" : "text"}
                  placeholder="Value"
                  value={
                    valueEditing
                      ? primaryProperty?.value || ""
                      : primaryProperty?.value
                        ? formatDollars(primaryProperty.value)
                        : ""
                  }
                  onFocus={() => setValueEditing(true)}
                  onChange={(e) =>
                    upsertPrimaryProperty({
                      value: Number(e.target.value) || 0,
                    })
                  }
                  onBlur={() => setValueEditing(false)}
                />
              </div>
              <div className=" flex w-1/2 place-self-center">
                Primary residences recieve a tax exemption of 45% of their fair
                market value. By contrast, other classes of property are taxed
                on the full value. The receipt automatically accounts for this
                in its calcualtions of property tax.
              </div>
            </>
          )}
          {TutPage === 4 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Last but not least, fuel taxes and fees can be calculated from
                the car your drive and your annual mileage. Typical drivers
                range around ten to fifteen thousand miles annually. The receipt
                looks up the fuel efficency of the car you enter and computes
                the tax by estimating the fuel your car consumes in a year. Fees
                by contrast, are flat charges based on factors which can be
                infered from your car's make, model, and age.
              </div>
              <div className="flex flex-col gap-2 items-center">
                <div className="font-bold">
                  Please enter your vehicle's characteristics:
                </div>
                <div className="flex flex-row gap-8">
                  <input
                    className="w-1/4 border-1 px-2 m-2 rounded-xl"
                    type="number"
                    placeholder="Year"
                    value={firstCar?.year || ""}
                    onChange={(e) =>
                      upsertFirstCar({
                        year: Number(e.target.value) || 0,
                        model: "",
                        county: primaryProperty?.county ?? "",
                      })
                    }
                  />
                  <Select
                    className="w-1/4 text-black text-left"
                    options={MakeOptions}
                    isClearable={true}
                    placeholder="Make"
                    value={
                      MakeOptions.find((o) => o.value === firstCar?.make) ??
                      null
                    }
                    onChange={(opt) =>
                      upsertFirstCar({
                        make: opt?.value ?? "",
                        model: "",
                        county: primaryProperty?.county ?? "",
                      })
                    }
                  />
                  <Select
                    className="w-1/4 text-black text-left"
                    options={modelOptions}
                    isClearable={true}
                    placeholder="Model"
                    value={
                      firstCar?.make
                        ? ((
                            (
                              ModelOptions as Record<
                                string,
                                { value: string; label: string }[]
                              >
                            )[firstCar.make] ?? []
                          ).find((o) => o.value === firstCar.model) ?? null)
                        : null
                    }
                    onChange={(opt) =>
                      upsertFirstCar({
                        model: opt?.value ?? "",
                        county: primaryProperty?.county ?? "",
                      })
                    }
                  />
                  <input
                    className="w-1/4 border-1 px-2 m-2 rounded-xl"
                    type="number"
                    placeholder="Annual Miles"
                    value={firstCar?.miles || ""}
                    onChange={(e) =>
                      upsertFirstCar({
                        miles: Number(e.target.value) || 0,
                        county: primaryProperty?.county ?? "",
                      })
                    }
                  />
                </div>
              </div>
              <div className=" flex w-1/2 place-self-center">
                Vehicle information rounds out the set of data the Receipt needs
                to approximate your taxes across the major types and how those
                are estimated to translate into public purchases. Click 'Show my
                results' to see a flow diagram which maps out these
                relationships. Additionally, individual tax types can be
                explored in more depth in thier indivudals pages.
              </div>
            </>
          )}

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
      <div className="flex flex-col h-full gap-y-8 justify-between text-center">
        <div className=" text-4xl font-bold"> Sales Tax </div>
        <div className="flex flex-row h-full justify-around">
          <div className="w-1/2 border-1">
            General descrption of sales tax, rate components, and sales tax
            areas.
          </div>
          <div className="w-1/2 border-1">
            Map visual to explain sales tax areas
          </div>
        </div>
        <div> Notes</div>
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
