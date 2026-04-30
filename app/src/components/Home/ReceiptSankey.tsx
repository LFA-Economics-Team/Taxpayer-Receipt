import { useMemo, useState } from "react";
import type React from "react";
import {
  ResponsiveContainer,
  Sankey,
  Tooltip,
  Rectangle,
  Text,
  type SankeyNodeProps,
} from "recharts";
import { type SankeyData, formatDollars } from "../MetaMisc/types";

function resolveIndex(ref: number | { index: number }): number {
  return typeof ref === "number" ? ref : ref.index;
}

type CustomLinkProps = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourceControlX: number;
  targetControlX: number;
  linkWidth: number;
  index: number;
  payload: {
    source: number | { index: number };
    target: number | { index: number };
  };
  activeLinkIndices: Set<number> | null;
  onLinkHover: (index: number | null) => void;
};

function CustomLink({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourceControlX,
  targetControlX,
  linkWidth,
  index,
  activeLinkIndices,
  onLinkHover,
}: CustomLinkProps) {
  const isActive = activeLinkIndices === null || activeLinkIndices.has(index);

  const d = [
    `M ${sourceX} ${sourceY - linkWidth / 2}`,
    `C ${sourceControlX} ${sourceY - linkWidth / 2}, ${targetControlX} ${targetY - linkWidth / 2}, ${targetX} ${targetY - linkWidth / 2}`,
    `L ${targetX} ${targetY + linkWidth / 2}`,
    `C ${targetControlX} ${targetY + linkWidth / 2}, ${sourceControlX} ${sourceY + linkWidth / 2}, ${sourceX} ${sourceY + linkWidth / 2}`,
    "Z",
  ].join(" ");

  return (
    <path
      d={d}
      fill="#5f7063"
      fillOpacity={isActive ? 0.25 : 0.06}
      style={{ transition: "fill-opacity 0.2s", cursor: "pointer" }}
      onMouseEnter={() => onLinkHover(index)}
      onMouseLeave={() => onLinkHover(null)}
    />
  );
}

function CustomNode({
  x,
  y,
  width,
  height,
  index,
  payload,
  chartWidth,
  connectedIndices,
  onHover,
}: SankeyNodeProps & {
  chartWidth: number;
  connectedIndices: Set<number> | null;
  onHover: (index: number | null) => void;
}) {
  const isActive = connectedIndices === null || connectedIndices.has(index!);
  const isOut = chartWidth > 0 && x + width + 6 > chartWidth;
  const labelX = isOut ? x - 6 : x + width + 6;

  return (
    <g
      onMouseEnter={() => onHover(index!)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      <Rectangle
        x={x}
        y={y}
        width={width}
        height={height}
        fill="#5f7063"
        fillOpacity={isActive ? 1 : 0.15}
        style={{ transition: "fill-opacity 0.2s" }}
      />
      <Text
        x={labelX}
        y={y + height / 2 - 16}
        textAnchor={isOut ? "end" : "start"}
        verticalAnchor="middle"
        fillOpacity={isActive ? 1 : 0.35}
        style={{ transition: "fill-opacity 0.2s" }}
      >
        {payload.name}
      </Text>
      <Text
        x={labelX}
        y={y + height / 2}
        textAnchor={isOut ? "end" : "start"}
        verticalAnchor="middle"
        fillOpacity={isActive ? 1 : 0.35}
        style={{ transition: "fill-opacity 0.2s" }}
      >
        {formatDollars(payload.value)}
      </Text>
    </g>
  );
}

export function ReceiptSankey({
  data,
  containerRef,
}: {
  data: SankeyData;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const [chartWidth, setChartWidth] = useState(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number | null>(null);
  const [activeLinkIndex, setActiveLinkIndex] = useState<number | null>(null);

  // Snapshot numeric source/target indices before recharts/d3-sankey mutates them to node objects
  const originalLinks = useMemo(
    () =>
      data.links.map((l) => ({
        source: resolveIndex(l.source as number | { index: number }),
        target: resolveIndex(l.target as number | { index: number }),
      })),
    [data],
  );

  const handleNodeHover = (index: number | null) => {
    setActiveNodeIndex(index);
    if (index !== null) setActiveLinkIndex(null);
  };

  const handleLinkHover = (index: number | null) => {
    setActiveLinkIndex(index);
    if (index !== null) setActiveNodeIndex(null);
  };

  // Which nodes should be highlighted
  const connectedIndices = useMemo(() => {
    if (activeNodeIndex !== null) {
      const set = new Set<number>([activeNodeIndex]);
      for (const { source, target } of originalLinks) {
        if (source === activeNodeIndex) set.add(target);
        if (target === activeNodeIndex) set.add(source);
      }
      return set;
    }
    if (activeLinkIndex !== null) {
      const link = originalLinks[activeLinkIndex];
      if (link) return new Set<number>([link.source, link.target]);
    }
    return null;
  }, [activeNodeIndex, activeLinkIndex, originalLinks]);

  // Which links should be highlighted
  const activeLinkIndices = useMemo(() => {
    if (activeNodeIndex !== null) {
      const set = new Set<number>();
      originalLinks.forEach(({ source, target }, i) => {
        if (source === activeNodeIndex || target === activeNodeIndex)
          set.add(i);
      });
      return set;
    }
    if (activeLinkIndex !== null) {
      return new Set<number>([activeLinkIndex]);
    }
    return null;
  }, [activeNodeIndex, activeLinkIndex, originalLinks]);

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full items-center justify-around">
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
          node={(props) => (
            <CustomNode
              {...props}
              chartWidth={chartWidth}
              connectedIndices={connectedIndices}
              onHover={handleNodeHover}
            />
          )}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          link={(props: any) => (
            <CustomLink
              {...props}
              activeLinkIndices={activeLinkIndices}
              onLinkHover={handleLinkHover}
            />
          )}
          sort={false}
        >
          <Tooltip formatter={(value) => formatDollars(value as number)} />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
}
