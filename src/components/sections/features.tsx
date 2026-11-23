import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Mic, Brain, FileText, Download, Clock, Users, Shield, TrendingUp, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const features = [
  {
    icon: Mic,
    title: "Transcription that gets every word.",
    label: "Smart Transcription",
    description: "Advanced AI converts speech to text with 99% accuracy, handling multiple speakers and accents.",
    span: "lg:col-span-2",
    dark: true,
  },
  {
    icon: Brain,
    title: "Summaries that think ahead.",
    label: "Intelligent Summarization",
    description: "Executive summaries, key points, and action items automatically extracted from your meetings.",
    span: "",
  },
  {
    icon: FileText,
    title: "Notes with real structure.",
    label: "Structured Notes",
    description: "Organized sections for decisions, action items, and follow-ups in a professional format.",
    span: "",
  },
  {
    icon: Download,
    title: "Take them anywhere.",
    label: "Multiple Export Formats",
    description: "Export to PDF, Word, or share via email. Compatible with all major productivity tools.",
    span: "lg:col-span-2",
  },
  {
    icon: Clock,
    title: "Get 80% of your time back.",
    label: "Save Time",
    description: "Turn hours of manual note-taking into minutes of AI-powered processing.",
    span: "",
  },
  {
    icon: Users,
    title: "Better together.",
    label: "Team Collaboration",
    description: "Share notes with teammates and track action items across your organization.",
    span: "",
  },
  {
    icon: Shield,
    title: "Private and secure by design.",
    label: "Enterprise Security",
    description: "Bank-level encryption and compliance with GDPR, SOC2, and enterprise security standards.",
    span: "",
  },
  {
    icon: TrendingUp,
    title: "See how your meetings run.",
    label: "Meeting Analytics",
    description: "Track meeting patterns, participation, and productivity metrics over time.",
    span: "sm:col-span-2 lg:col-span-3",
  },
]

export function Features() {
  return (
    <>
      <section id="features" className="px-4 py-24 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-[1080px]">
          <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.07] tracking-[-0.04em] sm:text-6xl">
            Everything you need for perfect meeting notes.
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-xl leading-snug text-muted-foreground sm:text-2xl">
            From transcription to structured summaries, the whole process is handled, so you can focus on the meeting.
          </p>

          <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.label}
                className={cn(
                  "flex min-h-[280px] flex-col justify-between rounded-[1.75rem] p-8 sm:p-10",
                  feature.dark ? "bg-black text-white dark:bg-card" : "bg-muted",
                  feature.span,
                )}
              >
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                  <feature.icon className="h-5 w-5" />
                  {feature.label}
                </div>
                <div>
                  <h3
                    className={cn(
                      "mt-10 text-pretty text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-[1.75rem]",
                    )}
                  >
                    {feature.title}
                  </h3>
                  <p className={cn("mt-3 text-[17px] leading-snug", feature.dark ? "text-white/65" : "text-muted-foreground")}>
                    {feature.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing band */}
      <section className="relative overflow-hidden bg-black px-4 py-28 text-center text-white sm:px-6 sm:py-40">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(41,151,255,0.35),rgba(165,107,255,0.18)_55%,transparent)] blur-2xl" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-balance text-5xl font-semibold leading-[1.05] tracking-[-0.045em] sm:text-7xl">
            Ready to transform your meetings?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xl text-white/65">
            Join thousands of professionals who save hours every week.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Button size="lg" asChild>
              <Link to="/signup">Get started free</Link>
            </Button>
            <Link to="/#pricing" className="group inline-flex items-center gap-0.5 text-[19px] text-[#2997ff] hover:underline">
              View pricing
              <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
