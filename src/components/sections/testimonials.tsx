import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechCorp",
    avatar: "/professional-woman-diverse.png",
    content:
      "TalkToText Pro has revolutionized how our team handles meeting documentation. What used to take me 2 hours now takes 10 minutes.",
    rating: 5,
  },
  {
    name: "Michael Rodriguez",
    role: "CEO",
    company: "StartupXYZ",
    avatar: "/professional-man.png",
    content:
      "The AI-generated action items are incredibly accurate. Our team productivity has increased by 40% since we started using this tool.",
    rating: 5,
  },
  {
    name: "Emily Johnson",
    role: "Operations Director",
    company: "Global Inc",
    avatar: "/confident-business-woman.png",
    content:
      "Finally, a tool that understands context and creates meaningful summaries. The export features are exactly what we needed.",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Team Lead",
    company: "DevStudio",
    avatar: "/developer-man.png",
    content:
      "The transcription accuracy is phenomenal, even with technical jargon. It's become an essential part of our workflow.",
    rating: 5,
  },
  {
    name: "Lisa Thompson",
    role: "HR Manager",
    company: "PeopleFirst",
    avatar: "/hr-professional.png",
    content:
      "Compliance and security features give us peace of mind. The structured format makes sharing with stakeholders effortless.",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Consultant",
    company: "Advisory Group",
    avatar: "/consultant-man.jpg",
    content:
      "Client meetings are now properly documented and actionable. The sentiment analysis helps me understand meeting dynamics better.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1080px]">
        <h2 className="max-w-3xl text-balance text-4xl font-semibold leading-[1.07] tracking-[-0.04em] sm:text-6xl">
          Loved by teams around the world.
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-xl leading-snug text-muted-foreground sm:text-2xl">
          Trusted by more than 10,000 professionals to turn conversations into clear notes.
        </p>

        <div className="mt-14 columns-1 gap-4 space-y-4 md:columns-2 lg:columns-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="break-inside-avoid rounded-[1.75rem] bg-muted p-8">
              <div className="flex items-center gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />
                ))}
              </div>
              <blockquote className="mt-5 text-[19px] font-medium leading-snug tracking-[-0.02em]">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={t.avatar || "/placeholder.svg"} alt={t.name} />
                  <AvatarFallback className="bg-card text-xs">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm leading-tight">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-muted-foreground">
                    {t.role}, {t.company}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
