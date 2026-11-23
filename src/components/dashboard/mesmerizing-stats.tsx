import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Clock, Users, Brain } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { getDashboardStats, DashboardStats as StatsData } from "@/lib/api"

interface StatCard {
  title: string
  value: string
  icon: React.ElementType
  tint: string
}

// One consistent card style; only the icon tint changes (uses the chart palette tokens).
const statCardStyles = [
  { icon: FileText, tint: "text-[var(--chart-1)] bg-[color-mix(in_srgb,var(--chart-1)_12%,transparent)]" },
  { icon: Clock, tint: "text-[var(--chart-2)] bg-[color-mix(in_srgb,var(--chart-2)_12%,transparent)]" },
  { icon: Users, tint: "text-[var(--chart-3)] bg-[color-mix(in_srgb,var(--chart-3)_14%,transparent)]" },
  { icon: Brain, tint: "text-[var(--chart-4)] bg-[color-mix(in_srgb,var(--chart-4)_12%,transparent)]" },
]

// Animated Counter Component
function AnimatedCounter({ value, duration = 1200 }: { value: string | number; duration?: number }) {
  const [count, setCount] = useState(0)
  const numericValue = Number.parseFloat(String(value).replace(/[^0-9.]/g, ""))

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(numericValue * easeOutQuart)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [numericValue, duration])

  return (
    <span>
      {String(value).includes("%")
        ? `${count.toFixed(1)}%`
        : String(value).includes(".")
          ? count.toFixed(1)
          : Math.floor(count).toLocaleString()}
    </span>
  )
}

export function MesmerizingStats() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
        // Set some default error state if needed
        setStats({ total_meetings: 0, hours_processed: 0, team_members: 0, accuracy_rate: 0 })
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="gap-4 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-9 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-20" />
          </Card>
        ))}
      </div>
    )
  }

  const formattedStats: StatCard[] = [
    { title: "Meetings Processed", value: stats?.total_meetings.toString() ?? "0", ...statCardStyles[0] },
    { title: "Hours Processed", value: stats?.hours_processed.toString() ?? "0", ...statCardStyles[1] },
    { title: "Team Members", value: stats?.team_members.toString() ?? "1", ...statCardStyles[2] },
    { title: "Accuracy Rate", value: `${stats?.accuracy_rate ?? 0}%`, ...statCardStyles[3] },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {formattedStats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <Card className="gap-4 p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.tint}`}>
                <stat.icon className="h-[18px] w-[18px]" />
              </div>
            </div>
            <div className="text-4xl font-semibold tracking-[-0.04em] tabular-nums">
              <AnimatedCounter value={stat.value} duration={1000 + index * 150} />
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
