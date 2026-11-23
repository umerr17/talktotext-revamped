import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Tooltip,
} from "recharts"
import { motion } from "framer-motion"
import { getWeeklyActivity, getMeetingTypes, getProcessingSpeed, WeeklyActivity, MeetingType, ProcessingSpeed } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

// Series colours come from the design tokens so light/dark both stay legible.
const PIE_CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

const tooltipStyle = {
  backgroundColor: "var(--popover)",
  color: "var(--popover-foreground)",
  border: "1px solid var(--border)",
  borderRadius: "10px",
  boxShadow: "0 8px 24px -8px rgba(16, 18, 40, 0.18)",
  fontSize: 12,
  padding: "8px 12px",
}

const axisTick = { fill: "var(--muted-foreground)", fontSize: 12 }

export function MesmerizingCharts() {
  const [weeklyData, setWeeklyData] = useState<WeeklyActivity[]>([])
  const [meetingTypes, setMeetingTypes] = useState<MeetingType[]>([])
  const [processingSpeed, setProcessingSpeed] = useState<ProcessingSpeed[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true)
        const [weekly, types, speed] = await Promise.all([getWeeklyActivity(), getMeetingTypes(), getProcessingSpeed()])
        setWeeklyData(weekly)
        setMeetingTypes(types)
        setProcessingSpeed(speed)
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChartData()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardContent>
            <Skeleton className="h-[260px] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {/* Weekly Activity Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="lg:col-span-2"
      >
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base">Weekly activity</CardTitle>
            <CardDescription>Meetings processed per day</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="meetingsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={axisTick} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={axisTick} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "var(--border)" }} />
                <Area
                  type="monotone"
                  dataKey="meetings"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  fill="url(#meetingsGradient)"
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meeting Types Pie Chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.12 }}>
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-base">Meeting types</CardTitle>
            <CardDescription>Share of processed meetings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col">
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meetingTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    cornerRadius={4}
                    stroke="var(--card)"
                    strokeWidth={2}
                    dataKey="value"
                    animationDuration={900}
                  >
                    {meetingTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2">
              {meetingTypes.map((type, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: PIE_CHART_COLORS[index % PIE_CHART_COLORS.length] }}
                  />
                  <span className="truncate">{type.name}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>

      {/* Processing Speed Chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.19 }}
        className="lg:col-span-3"
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI processing speed</CardTitle>
            <CardDescription>Distribution of processing times</CardDescription>
          </CardHeader>
          <CardContent className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processingSpeed} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={axisTick} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={axisTick} allowDecimals={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
                <Bar dataKey="count" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={44} animationDuration={900} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
