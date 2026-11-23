import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"

const navigation = [
  { name: "Overview", href: "/" },
  { name: "Features", href: "/#features" },
  { name: "Pricing", href: "/#pricing" },
]

export function Navbar() {
  const { pathname } = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Check for token on component mount
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [pathname]) // Re-check on path change to update UI after login/logout

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "frosted sticky top-0 z-50 w-full border-b transition-colors duration-300",
        scrolled ? "border-border" : "border-transparent",
      )}
    >
      <nav className="mx-auto flex h-14 max-w-[1080px] items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "text-[13px] transition-colors",
                pathname === item.href ? "text-foreground" : "text-foreground/70 hover:text-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          {isLoggedIn ? (
            <Button size="sm" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Link to="/login" className="px-3 text-[13px] text-foreground/70 transition-colors hover:text-foreground">
                Sign in
              </Link>
              <Button size="sm" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[360px]">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <div className="mt-6 flex flex-col gap-8 px-6">
                <div className="flex flex-col">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className="border-b py-4 text-2xl font-semibold tracking-tight"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {isLoggedIn ? (
                    <Button asChild size="lg">
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild size="lg">
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                          Get started
                        </Link>
                      </Button>
                      <Button variant="outline" asChild size="lg">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Sign in
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
