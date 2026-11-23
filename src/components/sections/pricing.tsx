import { Button } from "@/components/ui/button"
import { Check, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { SUPPORT_EMAIL } from "@/config"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Starter",
    description: "Perfect for individuals and small teams",
    price: "$9",
    period: "month",
    yearlyPrice: "$90",
    features: [
      "Up to 10 hours of transcription per month",
      "Basic AI summarization",
      "PDF & Word export",
      "Email support",
      "Standard security",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: "$29",
    period: "month",
    yearlyPrice: "$290",
    features: [
      "Up to 50 hours of transcription per month",
      "Advanced AI analysis & insights",
      "All export formats",
      "Priority support",
      "Team collaboration tools",
      "Meeting analytics",
      "Custom templates",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with advanced needs",
    price: "Custom",
    period: "",
    yearlyPrice: null,
    features: [
      "Unlimited transcription",
      "Custom AI models",
      "Advanced security & compliance",
      "Dedicated account manager",
      "API access",
      "Single sign-on (SSO)",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    popular: false,
  },
]

const faqs = [
  {
    q: "How does the free trial work?",
    a: "Start with a 14-day free trial of our Professional plan. No credit card required. You can cancel anytime during the trial period.",
  },
  {
    q: "Can I change plans anytime?",
    a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we'll prorate your billing.",
  },
  {
    q: "What file formats do you support?",
    a: "We support MP3, WAV, M4A, and most common audio formats. Video files (MP4, MOV) are also supported for audio extraction.",
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use bank-level encryption and are compliant with GDPR, SOC2, and other security standards. Your data is never shared with third parties.",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="bg-muted px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1080px]">
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.07] tracking-[-0.04em] sm:text-6xl">
          Simple, transparent pricing.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-xl leading-snug text-muted-foreground sm:text-2xl">
          Start with a free 14-day trial. No credit card required. Cancel anytime.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "flex flex-col rounded-[1.75rem] bg-card p-8 sm:p-10",
                plan.popular && "ring-2 ring-primary",
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold tracking-tight">{plan.name}</h3>
                {plan.popular && <span className="text-sm font-medium text-primary">Most popular</span>}
              </div>
              <p className="mt-2 min-h-[44px] text-[15px] leading-snug text-muted-foreground">{plan.description}</p>

              <div className="mt-8 flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold tracking-[-0.04em]">{plan.price}</span>
                {plan.period && <span className="text-[15px] text-muted-foreground">per {plan.period}</span>}
              </div>
              <p className="mt-1.5 h-5 text-sm text-muted-foreground">
                {plan.yearlyPrice ? `${plan.yearlyPrice} billed yearly (save 17%)` : "Tailored to your organization"}
              </p>

              <Button className="mt-7 w-full" variant={plan.popular ? "default" : "outline"} size="lg" asChild>
                {plan.name === "Enterprise" ? (
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=Enterprise%20plan`}>{plan.cta}</a>
                ) : (
                  <Link to="/signup">{plan.cta}</Link>
                )}
              </Button>

              <ul className="mt-8 space-y-3.5 border-t pt-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-[15px] leading-snug">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={2.5} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-24 sm:mt-32">
          <h3 className="text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Frequently asked questions.</h3>
          <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-10 md:grid-cols-2">
            {faqs.map((item) => (
              <div key={item.q}>
                <h4 className="text-lg font-semibold tracking-tight">{item.q}</h4>
                <p className="mt-2 text-[17px] leading-relaxed text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
          <a href={`mailto:${SUPPORT_EMAIL}`} className="group mt-10 inline-flex items-center gap-0.5 text-[19px] text-primary hover:underline">
            Contact support
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}
