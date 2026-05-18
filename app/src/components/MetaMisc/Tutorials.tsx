import { NavLink } from "react-router-dom";
import { useAppContext, STATE_SALES_RATE } from "../../AppContext";
import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  geocodeAddress,
  formatDollars,
  filingOptions,
  lookupIncomeData,
  feeInfo,
  GeocodingErrorModal,
} from "./types";
import type { FuelEntry } from "./types";
import MakeOptions from "../../data/Misc/MakeOptions.json";
import ModelOptions from "../../data/Misc/ModelOptions.json";
import FuelData from "../../data/Misc/FuelData.json";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { round } from "@turf/helpers";

export function TutorialTemplate({ children }: { children?: React.ReactNode }) {
  const { setTutorialOpen } = useAppContext();

  return (
    <div
      className="fixed text-[#17301b] inset-0 place-self-center content-center h-full w-full z-[1001] bg-gray-100/70 rounded-lg shadow-xl"
      onClick={() => setTutorialOpen(false)}
    >
      <div
        className="flex flex-col p-4 bg-white h-7/10 w-7/10 rounded-xl place-self-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setTutorialOpen(false)}
          className="flex border-1 rounded-xl size-6 place-self-end "
        >
          <div className="flex w-full place-self-center justify-center text-white">
            X
          </div>
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

  const [tutPage, setTutPage] = useState(0);
  const [valueEditing, setValueEditing] = useState(false);
  const [geoError, setGeoError] = useState(false);
  const [incomeDisplay, setIncomeDisplay] = useState(
    incomeInfo.annualIncome ? formatDollars(incomeInfo.annualIncome) : "",
  );

  useEffect(() => {
    if (incomeInfo.annualIncome === 0) setIncomeDisplay("");
  }, [incomeInfo.annualIncome]);

  return (
    <>
    {geoError && <GeocodingErrorModal onClose={() => setGeoError(false)} />}
    <TutorialTemplate>
      {tutPage === 0 && (
        <div className="flex flex-col h-full gap-y-8 justify-around text-center">
          <div className=" text-4xl font-bold">
            Welcome to the Utah State Taxpayer Receipt!
          </div>

          <div className="flex w-2/3 text-xl place-self-center justify-center">
            The purpose of this tool is to estimate how individual taxes flow
            into public purchases. Each of the four tax types below represent
            one of the major sources of revenue within the state.
          </div>

          <div className="flex flex-row w-full h-1/2 font-bold text-2xl place-self-center justify-between px-2">
            <div className="flex flex-col w-1/4 justify-around">
              <div>💸 Income Tax 💸</div>
              <div className="text-base font-normal ">
                One of the largest revenue sources for the state, income tax is
                assessed as a percentage on most types of individual income.
                These funds are constitutionally earmarked for public education
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
                The total rate levied on a given taxable transaction is the sum
                of the individual components charged by each level of
                government. While the state's sales tax revenue is unrestricted,
                most local rate components are dedicated to specific purposes.
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
                essential functions including public education, municipal
                services, and basic government administration.
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
                state. The fees here are the collection of fees charged when
                registering a vehicle. Both generally go to infrastructure
                related purposes.
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
            Answer the questions on the next few pages to see what the taxes of
            Utahns like you buy, or select one of the tax types to explore it in
            more detail.
          </div>
          <button
            onClick={() => setTutPage(tutPage + 1)}
            className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
          >
            {" "}
            Estimate my Taxes →
          </button>
        </div>
      )}
      {tutPage >= 1 && tutPage <= 4 && (
        <div className="flex flex-col h-full gap-y-8 justify-between text-center">
          <div className="flex flex-row h-1/20 w-8/10 rounded-xl overflow-hidden justify-evenly border-1 place-self-center divide-x ">
            <div
              className={`flex w-1/4 justify-center ${tutPage >= 1 ? "bg-emerald-950/15" : ""}`}
            >
              General
            </div>
            <div
              className={`flex w-1/4 justify-center ${tutPage >= 2 ? "bg-emerald-950/15" : ""}`}
            >
              Income
            </div>
            <div
              className={`flex w-1/4 justify-center ${tutPage >= 3 ? "bg-emerald-950/15" : ""}`}
            >
              Property
            </div>
            <div
              className={`flex w-1/4 justify-center ${tutPage >= 4 ? "bg-emerald-950/15" : ""}`}
            >
              Fuel & Fees
            </div>
          </div>

          {tutPage === 1 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                The first step in getting an estimate of one's overall tax
                liability is to know which local taxes apply. The Taxpayer
                Receipt achieves this by using geocoding (latitude/ longitude)
                to filter the list of all political subdivisions in the state
                down to only those which tax Utahns like you. As a result, the
                receipt needs a location to attribute the taxes. This can be as
                specific as a street address or as general as a city or county.
                For maximum accuracy, please enter a location physically
                proximate to your primary residence.
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
                    } else if (e.target.value) {
                      setGeoError(true);
                    }
                  }}
                />
              </div>
              <div className="flex w-1/2 place-self-center ">
                This location determines which property tax entities and sales
                tax rates apply during the final calculations. This, and all
                other information entered into the Receipt is not stored by or
                sent to any government entity.
              </div>
            </>
          )}
          {tutPage === 2 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Instead of needing an entire tax return's information to
                calculate your income tax, the Receipt uses effective tax rates
                to estimate liability. By calculating the effective tax rates
                conditioned on gross income and filing status for all taxpayers,
                the Receipt can approximate one's income tax from a much smaller
                set of information than a full return.
              </div>
              <div className="flex flex-col gap-2">
                <div className=" font-bold">
                  Please enter your total pre-tax household income:
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
                The above information also allows the Receipt to estimate sales
                tax. On average, people tend to spend a relatively consistent
                share of income on taxable sales. Applying that share to the
                income entered yields a approximation of annualized sales tax.
              </div>
            </>
          )}
          {tutPage === 3 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Using the location entered in the 'General' tab, the Receipt can
                identify the set of property tax entities that apply. It then,
                combined with the value of property, computes a property tax
                estimate by applying each entity's tax rate to the property's
                value.
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
                Primary residences receive a tax exemption of 45% of their fair
                market value. By contrast, other classes of property are taxed
                on the full value. The Receipt automatically accounts for this
                in its calculations of property tax.
              </div>
            </>
          )}
          {tutPage === 4 && (
            <>
              <div className=" flex w-1/2 place-self-center">
                Last but not least, fuel taxes and fees can be calculated from a
                car's characteristics and annual mileage. Typical drivers range
                around ten to fifteen thousand miles annually. The Receipt looks
                up the fuel efficiency of the car entered and computes the tax
                by estimating the fuel consumed in a year. Fees by contrast are
                flat charges based on vehicle type, age, and county of
                registration.
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
                to approximate the tax liability of Utahn's like you. Click
                'Show my results' to see a flow diagram which maps out an
                estimate of how those taxes flow into public purchases.
                Additionally, specific tax types can be explored in more depth
                in their individual pages.
              </div>
            </>
          )}

          <div className="flex flex-row w-full gap-8 justify-center">
            <button
              onClick={() => setTutPage(tutPage - 1)}
              className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              ← Back
            </button>
            <button
              onClick={() =>
                tutPage === 4 ? setTutorialOpen(false) : setTutPage(tutPage + 1)
              }
              className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
            >
              {tutPage === 4 ? "Show my Results" : "Next →"}
            </button>
          </div>
        </div>
      )}
    </TutorialTemplate>
    </>
  );
}

export function IncomeTutorial() {
  const { setTutorialOpen } = useAppContext();

  const [tutPage, setTutPage] = useState(0);

  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 p-2 text-center">
        <div className=" text-4xl font-bold"> Income Tax </div>

        {tutPage === 0 ? (
          <>
            <div className="flex flex-col w-2/3 place-self-center py-8 gap-4">
              <p>
                There are two ways income tax can be estimated. One way is to
                compile records, document circumstances, and file a fully
                complete return to calculate one's tax liability down to the
                dollar. This would not be appropriate here due to privacy
                concerns and because requiring all that information would make
                the Receipt unusable due to needless complexity.
              </p>
              <p>
                Instead, the Receipt relies upon the second method: calculating
                effective tax rates across the population of taxpayers. While
                this cannot calculate one's specific tax liability, it provides
                a reliable statistical approximation of the liability for
                similarly situated taxpayers. In other words, while the Receipt
                cannot calculate your specific taxes, it calculates an estimate
                for taxpayers like you. Additionally, this takes substantially
                less information, ensuring the Receipt is simple, non-invasive,
                and easy to use.
              </p>
              <p>
                Please refer to the demo below for a walkthrough of how the
                Receipt goes from the statewide population of taxpayers to the
                specific estimate shown on this page.{" "}
              </p>
            </div>
            <button
              onClick={() => setTutPage(tutPage + 1)}
              className="flex text-xl text-gray-300 w-1/2 place-self-center justify-center"
            >
              Begin Demo
            </button>
          </>
        ) : (
          <>
            <div className=" flex h-full gap-1">
              <div className="flex flex-col h-full gap-2 w-1/5 shrink-0">
                <div className="h-1/20 text-white bg-[#17301b]/90 border-1 rounded-xl">
                  All Tax Returns
                </div>
                <div className=" flex font-bold text-xl h-19/20 border-1 items-center justify-center ">
                  Nearly 2 million tax returns
                </div>
              </div>

              {tutPage >= 2 && (
                <div className="flex flex-col h-full gap-2 w-1/5 shrink-0">
                  <div className="h-1/20 text-white bg-[#17301b]/90 border-1 rounded-xl">
                    Filing Status
                  </div>
                  <div className="flex flex-col h-full gap-0.5">
                    <div className="h-1/5 border-1">Single</div>
                    <div className="h-1/5 border-1">Married Filling Joint</div>
                    <div className="h-1/5 border-1">Married Filing Single</div>
                    <div className="h-1/5 border-1 ">Head of Household</div>
                    <div className="h-1/5 border-1">Qualifying Spouse</div>
                  </div>
                </div>
              )}

              {tutPage >= 3 && (
                <div className="flex flex-col h-full gap-2 w-1/5 shrink-0">
                  <div className="h-1/20 text-white bg-[#17301b]/90 border-1 rounded-xl">
                    Percentile
                  </div>
                  <div className="flex flex-row gap-0 overflow-hidden flex-1">
                    <div className="flex flex-col w-9/10">
                      {Array.from({ length: 100 }, (_, i) => (
                        <div key={i} className="h-1/100 border-t-1 w-full">
                          {" "}
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-col justify-between w-1/10">
                      <p>100</p>
                      <p>90</p>
                      <p>80</p>
                      <p>70</p>
                      <p>60</p>
                      <p>50</p>
                      <p>40</p>
                      <p>30</p>
                      <p>20</p>
                      <p>10</p>
                      <p>1</p>
                    </div>
                  </div>
                </div>
              )}

              {tutPage >= 4 && (
                <div className="flex flex-col h-full  gap-2 w-1/5 shrink-0">
                  <div className="h-1/20 text-white bg-[#17301b]/90 border-1 rounded-xl">
                    Variables of Interest
                  </div>
                  <div className="h-1/5 ">Average Effective Tax Rate</div>
                  <div className="h-1/5 ">Average Taxable Income</div>
                  <div className="h-1/5 ">Cumulative Income</div>
                  <div className="h-1/5 ">Cumulative Tax Liability</div>
                  <div className="h-1/5 ">Average Household Size</div>
                </div>
              )}
              <div className="flex items-center justify-center">
                {tutPage === 1 && (
                  <div className="w-1/2 ">
                    <p>
                      To calculate effective income tax rates, the Receipt
                      starts with the entire collection of individual income tax
                      returns filed with the state. These returns are anonymized
                      and de-identified before any analysis is conducted. The
                      nearly 2 million returns are represented by the rectangle
                      to the left.
                    </p>
                  </div>
                )}
                {tutPage === 2 && (
                  <div className="w-1/2">
                    <p>
                      The Receipt's analysis starts by categorizing each return
                      by filing status. Grouping the returns this way increases
                      the precision of the estimates by comparing like with like
                      in the next steps. The approximate size of the boxes shows
                      the relative prevalence of each filing status across the
                      entire taxpaying population.
                    </p>
                  </div>
                )}
                {tutPage === 3 && (
                  <div className="w-9/10">
                    Next, each filing status group is further subdivided into
                    percentiles. This is accomplished by sorting the returns by
                    reported income, and dividing them into one hundred equally
                    sized groups. In this way, a return in the first group
                    represents a household whose income is in the lowest
                    hundredth among households with their filing status. A
                    household in the second group has second hundredth lowest,
                    and so on.
                  </div>
                )}
                {tutPage === 4 && (
                  <div>
                    Once subdivided by filing status and percentile, the Receipt
                    calculates the variables of interest within and between
                    groups. For example, average effective tax rate is computed
                    by dividing tax liability by reported income for each
                    return, then averaging the result across all returns in each
                    percentile group. Analogous calculations are done for each
                    variable of interest listed to the left.
                  </div>
                )}
                {tutPage === 5 && (
                  <div>
                    It is these variables of interest which power the estimates
                    listed on this page. They also power the charts as well.
                    Each of the charts is organized with the percentiles along
                    the horizontal axis and a given variable on the vertical
                    axis. This allows one to examine how the variable changes
                    along the income spectrum. Finally, a vertical reference
                    line corresponding to the entered income is also included to
                    mark where that income falls among the percentiles.
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-row grow gap-8 justify-center">
              <button
                onClick={() => setTutPage(tutPage - 1)}
                className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
              >
                ← Back
              </button>
              <button
                onClick={() =>
                  tutPage === 5
                    ? setTutorialOpen(false)
                    : setTutPage(tutPage + 1)
                }
                className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
              >
                {tutPage === 5 ? "Close Guide" : "Next →"}
              </button>
            </div>
          </>
        )}
      </div>
    </TutorialTemplate>
  );
}

export function SalesTutorial() {
  const { setTutorialOpen } = useAppContext();

  const [tutPage, setTutPage] = useState(0);

  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-between text-center">
        <div className=" text-4xl font-bold"> Sales Tax </div>
        <div className="flex flex-row h-full justify-around">
          <div className="flex flex-col h-full w-1/2 gap-4 p-2 place-self-center ">
            <p className="font-bold text-xl">What is the tax rate?</p>
            <p>
              Sales taxes in Utah are assessed as a composite rate on the value
              of a taxable transaction. In practice, this means that the total
              tax on a given transaction is the sum of the rates charged by all
              levels of government.
            </p>
            <p className="font-bold text-xl">What are Tax Areas?</p>

            <p>
              These composite rates are organized geographically into Sales Tax
              Areas. A Sales Tax Area is a geographic region with a unique
              combination of sales tax rates. See the demo to the right for a
              visual demonstration of how these areas are determined.
            </p>

            <p className="font-bold text-xl">How does the Receipt use Areas?</p>
            <p>
              The Taxpayer Receipt estimates sales tax by first identifying the
              Sales Tax Area(s) which apply. Then, multiplies the area's rates
              by the annualized value of taxable transactions entered by the
              user (or inferred from the user's income). This allows the Receipt
              to determine the amount of sales tax attributable to each rate
              component, and therefore each level of government.
            </p>
          </div>

          <div className="flex flex-col h-full justify-center w-1/2 gap-4">
            {tutPage === 0 ? (
              <button
                onClick={() => setTutPage(tutPage + 1)}
                className="flex text-xl text-gray-300 w-1/2 place-self-center justify-center"
              >
                Begin Demo
              </button>
            ) : (
              <div className="flex flex-col font-bold bg-[#F5E3EF] w-2/3 h-9/10 p-2 place-self-center rounded-xl">
                <p>State</p>
                {tutPage >= 2 && (
                  <p className="font-bold">
                    {" "}
                    {round(STATE_SALES_RATE * 100, 2)}%
                  </p>
                )}
                {tutPage === 1 ? (
                  <div className="flex flex-col h-full font-normal text-center justify-center gap-8">
                    <p className="w-2/3 place-self-center">
                      Starting at the highest level, all tax areas contain the
                      state sales tax rate since it applies statewide.
                    </p>
                    <p className="font-bold">
                      {" "}
                      Tax Rate: {round(STATE_SALES_RATE * 100, 2)}%
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full w-full place-items-center justify-around">
                    <div className=" flex flex-col bg-[#D8A8C4] w-1/2 h-3/4 place-items-center gap-2 p-2 rounded-xl">
                      <p>County</p>
                      <div>
                        <p> {round(STATE_SALES_RATE * 100, 2)}%</p>
                        <p> +2.00%* </p>
                      </div>
                      {tutPage >= 3 && (
                        <div className="bg-[#BA749E] w-1/2 h-1/2 rounded-xl">
                          <p>City</p>
                          <p> {round(STATE_SALES_RATE * 100, 2)}%</p>
                          <p> +2.00%* </p>
                          <p> +1.00%* </p>
                        </div>
                      )}
                    </div>
                    {tutPage === 2 ? (
                      <div className=" flex flex-col font-normal w-1/3 h-2/3  place-items-center justify-around rounded-xl">
                        <p>
                          Layering on top of the state rate are the county
                          rate(s). Since each county covers a subset of the
                          state, the rate options applied by a county only apply
                          within their borders.
                        </p>
                      </div>
                    ) : (
                      <div className=" flex flex-col font-normal w-1/3 h-2/3  place-items-center justify-around rounded-xl">
                        Lastly, any municipal sales tax rates are added within
                        municipal borders. Together, these three layers comprise
                        the total sales tax rate.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {tutPage >= 1 && (
              <>
                {tutPage >= 2 && (
                  <div className="text-sm">
                    *Local rates are illustrative only. Actual rates may vary.
                  </div>
                )}
                <div className="flex flex-row w-full gap-8 justify-center">
                  <button
                    onClick={() => setTutPage(tutPage - 1)}
                    className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() =>
                      tutPage === 3
                        ? setTutorialOpen(false)
                        : setTutPage(tutPage + 1)
                    }
                    className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
                  >
                    {tutPage === 3 ? "Close Guide" : "Next →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div> - </div>
      </div>
    </TutorialTemplate>
  );
}

export function PropertyTutorial() {
  const { setTutorialOpen } = useAppContext();

  const [tutPage, setTutPage] = useState(0);

  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 justify-between text-center">
        <div className=" text-4xl font-bold"> Property Tax </div>
        <div className="flex flex-row h-full justify-around">
          <div className="flex flex-col h-full w-1/2 gap-4 p-2 place-self-center ">
            <p className="font-bold text-xl">What is the tax rate?</p>
            <p>
              Property taxes rates in Utah are set by individual taxing entities
              through a process called Truth in Taxation. Broadly, rates go down
              when property values increase to maintain the same level of
              revenue unless the entity acts to increase revenue.
            </p>
            <p className="font-bold text-xl">What are Tax Entities?</p>

            <p>
              Tax entities are generally political subdivisions of the state
              such as counties, school districts, municipalities, etc. State
              code endows these entities with property taxing authority: the
              authority to collect property tax, and set the tax to be collected
              via Truth in Taxation. See the demo to the right to see how these
              entities interact.
            </p>

            <p className="font-bold text-xl">
              How does the Receipt use Entities?
            </p>
            <p>
              The Taxpayer Receipt estimates property tax by first identifying
              the Property Tax Entities which apply. Then, multiplies the
              entities' rates by the taxable value of property as entered by the
              user. This allows the Receipt to determine the amount of property
              tax attributable to each taxing entities, and therefore each level
              of government.
            </p>
          </div>

          <div className="flex flex-col h-full justify-center w-1/2 gap-4">
            {tutPage === 0 ? (
              <button
                onClick={() => setTutPage(tutPage + 1)}
                className="flex text-xl text-gray-300 w-1/2 place-self-center justify-center"
              >
                Begin Demo
              </button>
            ) : (
              <div className="flex flex-col font-bold border-1 w-2/3 h-9/10 p-2 place-self-center rounded-xl">
                <p>State</p>

                {tutPage === 1 ? (
                  <div className="flex flex-col h-full font-normal text-center justify-center gap-8">
                    <p className="w-2/3 place-self-center">
                      The state itself does not levy a property tax. All
                      property tax in the state is levied at the county level or
                      below.
                    </p>
                  </div>
                ) : (
                  <div className="flex h-full w-full place-items-center justify-around">
                    <div className=" flex flex-col bg-[#5576e020] w-1/2 h-3/4 place-items-center gap-2 p-2 rounded-xl">
                      <p>County</p>
                      <div>
                        <p> .15%* </p>
                      </div>
                      {tutPage >= 3 && (
                        <div className="bg-[#5576e050] w-1/2 h-1/2 rounded-xl">
                          <p>City</p>
                          <p> +.15%* </p>
                        </div>
                      )}
                    </div>
                    {tutPage === 2 ? (
                      <div className=" flex flex-col font-normal w-1/3 h-2/3  place-items-center rounded-xl">
                        <p>
                          All taxable property is (at minimum) taxed by a county
                          and a school district. Although not true universally,
                          many school districts use the same boundaries as their
                          county.
                        </p>
                      </div>
                    ) : (
                      <div className=" flex flex-col font-normal w-1/3 h-2/3  place-items-center justify-around rounded-xl">
                        Any property within a municipality or a special district
                        is also taxed by those entities. This applies to most
                        taxpayer since most live within cities or towns.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            {tutPage >= 1 && (
              <>
                {tutPage >= 2 && (
                  <div className="text-sm">
                    *Local rates are illustrative only. Actual rates may vary.
                  </div>
                )}
                <div className="flex flex-row w-full gap-8 justify-center">
                  <button
                    onClick={() => setTutPage(tutPage - 1)}
                    className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() =>
                      tutPage === 3
                        ? setTutorialOpen(false)
                        : setTutPage(tutPage + 1)
                    }
                    className="text-xl text-gray-300 font-bold w-1/5 place-self-center border-1 rounded-xl bg-emerald-950/10 hover:bg-emerald-950/15"
                  >
                    {tutPage === 3 ? "Close Guide" : "Next →"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div> - </div>
      </div>
    </TutorialTemplate>
  );
}

export function FuelsTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-2 justify-between text-center">
        <div className=" text-4xl font-bold"> Fuel Tax and Fees </div>
        <div className="flex flex-col h-full w-full p-2 gap-4 place-self-center">
          <div className="flex w-2/3 place-self-center">
            Since fuel taxes and fees are fixed charges per unit, calculating
            them is among the most straightforward of the Receipt's
            computations. For each vehicle, it's EPA fuel economy is used to
            estimate fuel tax as detailed in the formula below. Additionally,
            its characteristics are compared against the criteria of the fees to
            determine which apply. See the table below for a summary of these
            criteria.
          </div>

          <div className="flex flex-row justify-around">
            <div className="flex flex-col gap-2 w-1/2 ">
              <div className=" text-2xl font-bold pb-4">Fuel Tax</div>
              <div className="px-8 pb-8">
                Fuels taxes are computed by identifying the combined fuel
                economy for the specific make, model, and year combination
                entered by the user. This value is then used to compute
                estimated fuel tax using this formula:
              </div>
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {
                  "$\\Large\\frac{\\text{Vehicle Mileage}}{\\text{Fuel Economy}} \\times \\text{Fuel Tax Rate} = \\text{Estimated Fuel Tax}$"
                }
              </ReactMarkdown>
              <div className="px-8 pt-8">
                The Fuel Tax Rate is measured in cents per gallon rather than as
                a percentage rate on the value of the transaction. As a result,
                changes in the price of fuel do not directly impact the tax
                paid. The rate itself is updated annually by the State Tax
                Commission as specified in law.
              </div>
            </div>

            <div className="flex flex-col w-1/2 px-8 gap-2">
              <div className=" text-2xl font-bold pb-4">Fees</div>
              <div className="px-8 pb-4">
                Each fee has criteria outlined in statute to determine whether
                it applies to a given vehicle or to determine the amount charged
                at registration. More information about individual fees can be
                found on the Tax Commission's website.
              </div>
              <div className="grid grid-cols-[50%_50%]">
                <div className="font-bold border-b border-gray-200">Fee</div>
                <div className="font-bold border-b border-gray-200">
                  Criteria
                </div>
                {Object.entries(feeInfo)
                  .filter(([name]) => name !== "Total")
                  .map(([name, info]) => (
                    <React.Fragment key={name}>
                      <div
                        key={`${name}-name`}
                        className="py-1 border-b border-gray-200"
                      >
                        {name}
                      </div>
                      <div
                        key={`${name}-criteria`}
                        className="py-1 border-b border-gray-200"
                      >
                        {info.criteria}
                      </div>
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div>-</div>
      </div>
    </TutorialTemplate>
  );
}

export function LegTutorial() {
  return (
    <TutorialTemplate>
      <div className="flex flex-col h-full gap-y-8 p-2 text-center">
        <div className="text-4xl font-bold"> Legislative Map </div>
        <div className="w-2/3 place-self-center">
          In contrast to the other features of the Receipt, this page does not
          compute taxation of any sort. Instead, it aims at identifying the list
          of taxing districts which impact the residents of a given legislative
          district. It does this by filtering all taxing districts down to those
          which geographically overlap with the selected legislative
          district(s). In other words, when a legislative district is selected
          in the Map controls on the left, any and all taxing districts which at
          least partially overlap with the legislative boundaries will appear in
          the list on the right.
        </div>
        <div className="w-2/3 place-self-center">
          For convenience, districts are grouped into a property entity layer
          and a sales areas layer. These layers can be toggled on and off in the
          map controls. Districts will only appear on the map and in the list
          when the layer containing them is toggled on. For the best experience,
          turn on either the property layer or the sales layer but not both at
          one time to prevent the map from becoming too cluttered.
        </div>
      </div>
    </TutorialTemplate>
  );
}
