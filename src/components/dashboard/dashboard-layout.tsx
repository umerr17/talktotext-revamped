import { useState } from "react"
import { NavLink, Outlet, Link } from "react-router-dom"
import { LayoutDashboard, Upload, History, LogOut, Menu } from "lucide-react"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { UserProvider, useUser } from "@/context/user-provider"
import { cn } from "@/lib/utils"

const navigation = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard, end: true },
  { title: "Upload", to: "/dashboard/upload", icon: Upload, end: false },
  { title: "History", to: "/dashboard/history", icon: History, end: false },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user, isLoading } = useUser()

  const initials = () => {
    if (!user) return "??"
    const first = user.first_name?.[0] || ""
    const last = user.last_name?.[0] || ""
    return `${first}${last}`.toUpperCase() || user.username[0].toUpperCase()
  }

  return (
    <div className="flex h-full flex-col">
      <div className="px-6 pt-6">
        <Logo onClick={onNavigate} className="h-9" />
      </div>

      <nav className="mt-8 flex-1 space-y-1 px-3" aria-label="Dashboard">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">Workspace</p>
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex h-10 items-center gap-3 rounded-xl px-3 text-sm transition-colors",
                isActive
                  ? "bg-foreground/[0.07] font-semibold text-foreground"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      <div className="p-3">
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl bg-card p-3 transition-colors hover:bg-card/70"
        >
          {isLoading ? (
            <>
              <Skeleton className="size-9 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </>
          ) : (
            <>
              <Avatar className="size-9">
                <AvatarImage src={user?.avatar_url} alt={user?.username} />
                <AvatarFallback className="bg-muted text-xs font-semibold">{initials()}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-sm leading-tight">
                <span className="truncate font-semibold">
                  {user?.first_name || "User"} {user?.last_name}
                </span>
                <span className="truncate text-xs text-muted-foreground">{user?.username}</span>
              </div>
            </>
          )}
        </Link>
      </div>
    </div>
  )
}

function Shell() {
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("token")
    // Full reload clears all in-memory state
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Desktop sidebar */}
      <aside className="frosted fixed inset-y-0 left-0 z-30 hidden w-64 border-r lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <header className="frosted sticky top-0 z-20 flex h-14 items-center justify-between border-b px-4 sm:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sign out">
                  <LogOut className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sign out</TooltipContent>
            </Tooltip>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout() {
  return (
    <UserProvider>
      <Shell />
    </UserProvider>
  )
}
