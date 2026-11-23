import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/sections/hero"
import { Features } from "@/components/sections/features"
import { Pricing } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonials"
import { Footer } from "@/components/sections/footer"
import { usePageTitle } from "@/hooks/use-page-title"

export default function HomePage() {
  usePageTitle()
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Pricing />
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
