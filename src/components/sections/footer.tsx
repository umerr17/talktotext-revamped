import { Link } from "react-router-dom"
import { APP_NAME, SUPPORT_EMAIL } from "@/config"

const groups = [
  {
    title: "Product",
    links: [
      { name: "Features", to: "/#features" },
      { name: "Pricing", to: "/#pricing" },
    ],
  },
  {
    title: "Account",
    links: [
      { name: "Sign in", to: "/login" },
      { name: "Get started", to: "/signup" },
      { name: "Dashboard", to: "/dashboard" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-muted px-4 text-xs text-muted-foreground sm:px-6">
      <div className="mx-auto max-w-[1080px]">
        <p className="border-b py-5 leading-relaxed">
          {APP_NAME} turns meeting recordings into professional notes with AI-powered transcription and analysis.
        </p>

        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-foreground">{group.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.to} className="transition-colors hover:text-foreground hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-semibold text-foreground">Support</h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a href={`mailto:${SUPPORT_EMAIL}`} className="transition-colors hover:text-foreground hover:underline">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t py-5">
          <p>
            Copyright © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
