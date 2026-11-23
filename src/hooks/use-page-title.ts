import { useEffect } from "react"
import { APP_NAME } from "@/config"

/** Sets the browser tab title for the current page. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME}: AI-Powered Meeting Notes`
  }, [title])
}
