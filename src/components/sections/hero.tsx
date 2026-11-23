import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ChevronRight, FileAudio, ListChecks, Gavel } from "lucide-react"
import { motion } from "framer-motion"

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] as const },
})

/** The product, shown large. Static UI only, no data. */
function ProductDisplay() {
  return (
    <div className="relative mx-auto mt-16 max-w-5xl sm:mt-20">
      <div className="rounded-[2rem] bg-muted p-3 sm:rounded-[2.5rem] sm:p-5">
        <div className="overflow-hidden rounded-[1.4rem] bg-card shadow-[var(--shadow-lift)] sm:rounded-[1.9rem]">
          {/* title bar */}
          <div className="flex items-center gap-2 border-b px-5 py-3.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="mx-auto flex items-center gap-2 text-xs text-muted-foreground">
              <FileAudio className="h-3.5 w-3.5" />
              product-strategy-q1.mp3
            </span>
            <span className="hidden text-xs text-success sm:inline">Processed in 2m 14s</span>
          </div>

          <div className="grid text-left md:grid-cols-[1.5fr_1fr]">
            <div className="p-7 sm:p-10">
              <p className="text-sm font-medium text-primary">Executive summary</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Q1 product strategy review</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-muted-foreground">
                The team aligned on shipping the analytics dashboard in the next sprint, deferring the mobile redesign
                to Q2 based on beta feedback and engineering capacity.
              </p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {["Beta users want faster exports", "Analytics is the top-requested feature", "Mobile redesign moves to Q2"].map(
                  (t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-4 bg-muted/60 p-7 sm:p-10 md:border-l">
              <div className="rounded-2xl bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="h-4 w-4 text-primary" />
                  Action items
                </div>
                <ul className="mt-3 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2.5">
                    <span className="h-4 w-4 rounded-full border border-input" /> Finalize dashboard scope
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="h-4 w-4 rounded-full border border-input" /> Share beta report
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl bg-card p-5">
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Gavel className="h-4 w-4 text-primary" />
                  Decisions
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Ship analytics first, redesign in Q2.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="px-4 pb-16 pt-16 text-center sm:px-6 sm:pb-20 sm:pt-24">
      <div className="mx-auto max-w-4xl">
        <motion.p {...rise(0)} className="text-xl font-semibold tracking-tight sm:text-2xl">
          TalkToText Pro
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="mt-3 text-balance text-5xl font-semibold leading-[1.03] tracking-[-0.045em] sm:text-7xl lg:text-[5.5rem]"
        >
          Every meeting. Clearly noted.
        </motion.h1>

        <motion.p
          {...rise(0.16)}
          className="mx-auto mt-6 max-w-2xl text-pretty text-xl leading-snug text-muted-foreground sm:text-[1.65rem] sm:leading-snug"
        >
          Upload a recording and get a structured summary, decisions and action items in minutes.
        </motion.p>

        <motion.div {...rise(0.24)} className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Button size="lg" asChild>
            <Link to="/signup">Start for free</Link>
          </Button>
          <Link to="/#features" className="group inline-flex items-center gap-0.5 text-[19px] text-primary hover:underline">
            Learn more
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        <motion.p {...rise(0.3)} className="mt-5 text-sm text-muted-foreground">
          Free 14-day trial. No credit card required.
        </motion.p>
      </div>

      <motion.div {...rise(0.42)}>
        <ProductDisplay />
      </motion.div>
    </section>
  )
}
