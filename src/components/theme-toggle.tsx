"use client"

import { useTheme } from "@/components/providers/theme-provider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark"

  const onCheckedChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  return (
    <div className="flex items-center">
      <Label htmlFor="theme-switch" className="sr-only">
        Toggle theme
      </Label>
      <Switch
        id="theme-switch"
        checked={isDark}
        onCheckedChange={onCheckedChange}
        aria-label="Toggle theme"
      />
    </div>
  )
}
