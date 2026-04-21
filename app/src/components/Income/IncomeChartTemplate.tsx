import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import IncomeData from "../../data/Tax&Spend/IncomeData.json";
import SData from "../../data/Tax&Spend/IncomeData_S.json";
import HHData from "../../data/Tax&Spend/IncomeData_HH.json";
import MFJData from "../../data/Tax&Spend/IncomeData_MFJ.json";
import MFSData from "../../data/Tax&Spend/IncomeData_MFS.json";

interface LineChartTemplateProps {
  title: string;
  xDataKey: string;
  yDataKey: string;
  yDomain?: number;
  curveName: string;
  showReferenceLine?: boolean;
  horizonReferenceLineValue?: number;
  verticalReferenceLineValue?: number;
  equalityReferenceLine?: boolean;
  yAsPercent?: boolean;
  filingStatus?: string;
}

export function LineChartTemplate({
  title,
  xDataKey,
  yDataKey,
  yDomain = 0.05,
  curveName,
  showReferenceLine = false,
  horizonReferenceLineValue,
  verticalReferenceLineValue,
  equalityReferenceLine = false,
  yAsPercent = false,
  filingStatus,
}: LineChartTemplateProps) {
  const selectedData = {
    default: IncomeData,
    Single: SData,
    "Head of Household": HHData,
    "Married Filing Single": MFSData,
    "Married Filing Jointly": MFJData,
  };

  return (
    <>
      <div className="flex h-1/10 justify-center font-bold p-2">{title}</div>
      <div className="flex h-9/10 w-full p-2">
        {filingStatus === "Qualifying surviving spouse" ? (
          <div className="flex flex-col h-full w-full text-sm text-gray-500 items-center justify-center p-2 gap-2 text-center">
            Insufficent data for statistical analysis with selected varables.
            Please modify inputs.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={
                selectedData[
                  (filingStatus || "default") as keyof typeof selectedData
                ]
              }
            >
              <CartesianGrid strokeDasharray="2 2" />
              {showReferenceLine && (
                <ReferenceLine
                  y={horizonReferenceLineValue}
                  stroke="black"
                  strokeDasharray="2 2"
                  label="Statutory Tax Rate"
                />
              )}
              {verticalReferenceLineValue === 0 ? (
                <></>
              ) : (
                <ReferenceLine
                  x={verticalReferenceLineValue}
                  label={{ position: "insideBottom", value: "Income" }}
                  stroke="black"
                  strokeDasharray="2 2"
                />
              )}
              {equalityReferenceLine && (
                <ReferenceLine
                  label="Line of Equality"
                  segment={[
                    { x: 0, y: 0 },
                    { x: 100, y: 1 },
                  ]}
                />
              )}
              <XAxis
                dataKey={xDataKey}
                ticks={[10, 20, 30, 40, 50, 60, 70, 80, 90]}
              />
              <YAxis
                domain={[0, yDomain]}
                tickFormatter={(value) =>
                  yAsPercent ? `${(100 * value).toFixed(2)}%` : `${value}`
                }
              />
              <Line dataKey={yDataKey} name={curveName} />
              <Legend />
              <Tooltip
                labelFormatter={(value) => `Percentile: ${value}`}
                formatter={(value) =>
                  typeof value === "number"
                    ? yAsPercent
                      ? `${(100 * value).toFixed(2)}%`
                      : `${value.toFixed(2)}`
                    : value
                }
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </>
  );
}
