import { useState } from "react";
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Rectangle,
  Layer,
  Text,
  type SankeyNodeProps,
} from "recharts";
import { type SankeyData, formatDollars } from "../MetaMisc/types";

function CustomNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  chartWidth,
}: SankeyNodeProps & { chartWidth: number }) {
  const isOut = chartWidth > 0 && x + width + 6 > chartWidth;
  const labelX = isOut ? x - 6 : x + width + 6;

  return (
    <Layer key={`CustomNode${index}`}>
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5f7063"
        fillOpacity="1"
      />
      <Text
        x={labelX}
        y={y + height / 2 - 16}
        textAnchor={isOut ? "end" : "start"}
        verticalAnchor="middle"
      >
        {payload.name}
      </Text>
      <Text
        x={labelX}
        y={y + height / 2}
        textAnchor={isOut ? "end" : "start"}
        verticalAnchor="middle"
      >
        {formatDollars(payload.value)}
      </Text>
    </Layer>
  );
}

export function ReceiptSankey({ data }: { data: SankeyData }) {
  const [chartWidth, setChartWidth] = useState(0);

  return (
    <div className="flex flex-col h-full w-full items-center justify-around">
      <div className="text-2xl font-bold text-[#17301b]">
        Track how your tax dollar flow from collection to spending
      </div>
      <ResponsiveContainer
        width="90%"
        height="95%"
        onResize={(w) => setChartWidth(w)}
      >
        <Sankey
          data={data}
          node={(props) => <CustomNode {...props} chartWidth={chartWidth} />}
          sort={false}
        >
          <Tooltip formatter={(value) => formatDollars(value as number)} />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
