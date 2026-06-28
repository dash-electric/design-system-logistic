"use client"

import * as React from "react"
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Funnel, FunnelChart,
  LabelList, Line, LineChart, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart,
  ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis, ZAxis,
} from "recharts"
import { cn } from "./lib/utils"
import { routeColor } from "./lib/route-colors"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "./chart"

/**
 * Opinionated, GSM-themed charts on top of recharts + ChartContainer. Every
 * series color defaults to routeColor(index) (operational categorical palette,
 * exempt from the one-accent rule). Axes are ink-soft, grid is a gray-200
 * hairline, numbers are tabular. Drop any of these inside a <ChartCard>.
 */

export type ChartSeries = { key: string; label?: string; color?: string }

function useChartConfig(series: ChartSeries[]): ChartConfig {
  return React.useMemo(
    () =>
      Object.fromEntries(
        series.map((s, i) => [s.key, { label: s.label ?? s.key, color: s.color ?? routeColor(i) }]),
      ) as ChartConfig,
    [series],
  )
}

type Datum = Record<string, any>
type BaseProps = {
  data: Datum[]
  series: ChartSeries[]
  /** X-axis category key. */
  xKey: string
  height?: number
  className?: string
}

const axisProps = { tickLine: false, axisLine: false, tickMargin: 8 } as const
const GRID = "var(--dash-gray-200)"

function frame(height: number | undefined, className?: string) {
  return cn("aspect-auto w-full", className)
}

/* ── Sparkline — tiny inline trend (no axes), for KPI/Stat cards ────────── */
export type SparklineProps = {
  data: Datum[]
  dataKey?: string
  color?: string
  height?: number
  area?: boolean
  className?: string
}
export function Sparkline({ data, dataKey = "value", color, height = 36, area = true, className }: SparklineProps) {
  const c = color ?? routeColor(0)
  return (
    <div className={cn("w-full", className)} style={{ height }} data-slot="sparkline">
      <ResponsiveContainer width="100%" height="100%">
        {area ? (
          <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <Area dataKey={dataKey} stroke={c} fill={c} fillOpacity={0.12} strokeWidth={2} dot={false} isAnimationActive={false} />
          </AreaChart>
        ) : (
          <LineChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
            <Line dataKey={dataKey} stroke={c} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

/* ── TrendLineChart — multi-series time series ──────────────────────────── */
export function TrendLineChart({ data, series, xKey, height = 240, className, curved = true }: BaseProps & { curved?: boolean }) {
  const config = useChartConfig(series)
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey={xKey} {...axisProps} fontSize={11} />
        <YAxis {...axisProps} width={36} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Line key={s.key} dataKey={s.key} type={curved ? "monotone" : "linear"} stroke={`var(--color-${s.key})`} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        ))}
      </LineChart>
    </ChartContainer>
  )
}

/* ── TrendAreaChart — volume over time (single or stacked) ───────────────── */
export function TrendAreaChart({ data, series, xKey, height = 240, className, stacked }: BaseProps & { stacked?: boolean }) {
  const config = useChartConfig(series)
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey={xKey} {...axisProps} fontSize={11} />
        <YAxis {...axisProps} width={36} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Area key={s.key} dataKey={s.key} type="monotone" stackId={stacked ? "a" : undefined} stroke={`var(--color-${s.key})`} fill={`var(--color-${s.key})`} fillOpacity={stacked ? 0.6 : 0.15} strokeWidth={2} />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}

/* ── CompareBarChart — grouped bars (vertical or horizontal) ────────────── */
export function CompareBarChart({ data, series, xKey, height = 240, className, horizontal }: BaseProps & { horizontal?: boolean }) {
  const config = useChartConfig(series)
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, bottom: 0, left: horizontal ? 8 : -8 }}>
        <CartesianGrid vertical={horizontal} horizontal={!horizontal} stroke={GRID} />
        {horizontal ? (
          <>
            <XAxis type="number" {...axisProps} fontSize={11} />
            <YAxis type="category" dataKey={xKey} {...axisProps} width={84} fontSize={11} />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...axisProps} fontSize={11} />
            <YAxis {...axisProps} width={36} fontSize={11} />
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} fill={`var(--color-${s.key})`} radius={2} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

/* ── StackedBarChart — composition per category ─────────────────────────── */
export function StackedBarChart({ data, series, xKey, height = 240, className }: BaseProps) {
  const config = useChartConfig(series)
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey={xKey} {...axisProps} fontSize={11} />
        <YAxis {...axisProps} width={36} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s, i) => (
          <Bar key={s.key} dataKey={s.key} stackId="a" fill={`var(--color-${s.key})`} radius={i === series.length - 1 ? [2, 2, 0, 0] : 0} />
        ))}
      </BarChart>
    </ChartContainer>
  )
}

/* ── ComboChart — bars + line on a dual axis ────────────────────────────── */
export type ComboChartProps = {
  data: Datum[]
  xKey: string
  bars: ChartSeries[]
  lines: ChartSeries[]
  height?: number
  className?: string
}
export function ComboChart({ data, xKey, bars, lines, height = 240, className }: ComboChartProps) {
  const config = useChartConfig([...bars, ...lines])
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid vertical={false} stroke={GRID} />
        <XAxis dataKey={xKey} {...axisProps} fontSize={11} />
        <YAxis yAxisId="left" {...axisProps} width={36} fontSize={11} />
        <YAxis yAxisId="right" orientation="right" {...axisProps} width={36} fontSize={11} />
        <ChartTooltip content={<ChartTooltipContent />} />
        {bars.map((s) => (
          <Bar key={s.key} yAxisId="left" dataKey={s.key} fill={`var(--color-${s.key})`} radius={2} />
        ))}
        {lines.map((s) => (
          <Line key={s.key} yAxisId="right" dataKey={s.key} type="monotone" stroke={`var(--color-${s.key})`} strokeWidth={2} dot={false} />
        ))}
      </ComposedChart>
    </ChartContainer>
  )
}

/* ── DonutChart — proportion with a center total ────────────────────────── */
export type DonutDatum = { key: string; label?: string; value: number; color?: string }
export type DonutChartProps = {
  data: DonutDatum[]
  height?: number
  centerLabel?: React.ReactNode
  centerValue?: React.ReactNode
  className?: string
}
export function DonutChart({ data, height = 240, centerLabel, centerValue, className }: DonutChartProps) {
  const config = React.useMemo(
    () => Object.fromEntries(data.map((d, i) => [d.key, { label: d.label ?? d.key, color: d.color ?? routeColor(i) }])) as ChartConfig,
    [data],
  )
  const total = React.useMemo(() => data.reduce((n, d) => n + d.value, 0), [data])
  return (
    <div className={cn("relative", className)} data-slot="donut-chart" style={{ height }}>
      <ChartContainer config={config} className="aspect-auto size-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          <Pie data={data.map((d) => ({ ...d, name: d.label ?? d.key }))} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="92%" paddingAngle={2} strokeWidth={2}>
            {data.map((d, i) => (
              <Cell key={d.key} fill={d.color ?? routeColor(i)} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
        <span className="text-2xl font-semibold tabular-nums text-text-strong-950">{centerValue ?? total}</span>
        {centerLabel ? <span className="gsm-label text-[10px] text-text-soft-400">{centerLabel}</span> : null}
      </div>
    </div>
  )
}

/* ── FunnelChart — delivery funnel ──────────────────────────────────────── */
export type FunnelDatum = { key: string; label: string; value: number; color?: string }
export function DeliveryFunnelChart({ data, height = 260, className }: { data: FunnelDatum[]; height?: number; className?: string }) {
  const rows = data.map((d, i) => ({ ...d, name: d.label, fill: d.color ?? routeColor(i) }))
  const config = Object.fromEntries(data.map((d, i) => [d.key, { label: d.label, color: d.color ?? routeColor(i) }])) as ChartConfig
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <FunnelChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
        <Funnel dataKey="value" data={rows} isAnimationActive>
          <LabelList position="insideLeft" dataKey="name" fill="#fff" stroke="none" fontSize={12} offset={12} />
          <LabelList position="insideRight" dataKey="value" fill="#fff" stroke="none" fontSize={12} offset={12} className="tabular-nums" />
        </Funnel>
      </FunnelChart>
    </ChartContainer>
  )
}

/* ── ScatterPlot — distribution (x vs y) ────────────────────────────────── */
export type ScatterSeries = { key: string; label?: string; color?: string; points: { x: number; y: number; z?: number }[] }
export function ScatterPlot({ groups, xLabel, yLabel, height = 240, className }: { groups: ScatterSeries[]; xLabel?: string; yLabel?: string; height?: number; className?: string }) {
  const config = useChartConfig(groups)
  return (
    <ChartContainer config={config} className={frame(height, className)} style={{ height }}>
      <ScatterChart margin={{ top: 8, right: 8, bottom: 4, left: -8 }}>
        <CartesianGrid stroke={GRID} />
        <XAxis type="number" dataKey="x" name={xLabel} {...axisProps} fontSize={11} />
        <YAxis type="number" dataKey="y" name={yLabel} {...axisProps} width={36} fontSize={11} />
        <ZAxis type="number" dataKey="z" range={[40, 200]} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={{ strokeDasharray: "3 3" }} />
        {groups.map((g) => (
          <Scatter key={g.key} name={g.label ?? g.key} data={g.points} fill={`var(--color-${g.key})`} />
        ))}
      </ScatterChart>
    </ChartContainer>
  )
}

/* ── RadialGauge — utilization gauge (one or more rings) ────────────────── */
export type GaugeDatum = { key: string; label?: string; value: number; color?: string }
export function RadialGauge({ data, height = 200, max = 100, centerValue, centerLabel, className }: { data: GaugeDatum[]; height?: number; max?: number; centerValue?: React.ReactNode; centerLabel?: React.ReactNode; className?: string }) {
  const config = React.useMemo(
    () => Object.fromEntries(data.map((d, i) => [d.key, { label: d.label ?? d.key, color: d.color ?? routeColor(i) }])) as ChartConfig,
    [data],
  )
  const rows = data.map((d, i) => ({ ...d, name: d.label ?? d.key, fill: d.color ?? routeColor(i) }))
  return (
    <div className={cn("relative", className)} style={{ height }} data-slot="radial-gauge">
      <ChartContainer config={config} className="aspect-auto size-full">
        <RadialBarChart data={rows} innerRadius="55%" outerRadius="100%" startAngle={90} endAngle={-270} barSize={12}>
          <PolarAngleAxis type="number" domain={[0, max]} tick={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
          <RadialBar dataKey="value" background cornerRadius={6} />
        </RadialBarChart>
      </ChartContainer>
      {centerValue != null ? (
        <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
          <span className="text-2xl font-semibold tabular-nums text-text-strong-950">{centerValue}</span>
          {centerLabel ? <span className="gsm-label text-[10px] text-text-soft-400">{centerLabel}</span> : null}
        </div>
      ) : null}
    </div>
  )
}
