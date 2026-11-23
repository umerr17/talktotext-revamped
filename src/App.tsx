import { lazy, Suspense, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import HomePage from "@/pages/home"
const DashboardLayout = lazy(() =>
  import("@/components/dashboard/dashboard-layout").then((m) => ({ default: m.DashboardLayout })),
)
const LoginPage = lazy(() => import("@/pages/login"))
const SignupPage = lazy(() => import("@/pages/signup"))
const ForgotPasswordPage = lazy(() => import("@/pages/forgot-password"))
const ResetPasswordPage = lazy(() => import("@/pages/reset-password"))
const VerifyEmailPage = lazy(() => import("@/pages/verify-email"))
const AuthCallbackPage = lazy(() => import("@/pages/auth-callback"))
const DashboardPage = lazy(() => import("@/pages/dashboard"))
const UploadPage = lazy(() => import("@/pages/upload"))
const HistoryPage = lazy(() => import("@/pages/history"))
const MeetingPage = lazy(() => import("@/pages/meeting"))
const ProfilePage = lazy(() => import("@/pages/profile"))
const NotFoundPage = lazy(() => import("@/pages/not-found"))

/** Scrolls to #anchors (e.g. /#pricing) and to the top on normal navigation. */
function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      // wait a tick so the target section has rendered
      const id = window.setTimeout(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 0)
      return () => window.clearTimeout(id)
    }
    window.scrollTo({ top: 0 })
  }, [pathname, hash])

  return null
}

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="history" element={<HistoryPage />} />
        </Route>

        <Route path="/meeting/:id" element={<MeetingPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
