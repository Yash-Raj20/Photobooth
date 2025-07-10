"use client"

import { useEffect, useState } from "react"

const themes = ["light", "dark", "cupcake", "synthwave", "retro", "cyberpunk", "coffee"]

export default function ThemeSwitcher() {
  const [theme, setTheme] = useState("cupcake")

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved) {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    }
  }, [])

  // Update DOM + localStorage when theme changes
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  return (
    <ul className="menu rounded-box w-full">
      {themes.map((t) => (
        <li key={t}>
          <a
            className={`capitalize ${theme === t ? "font-bold text-primary" : ""}`}
            onClick={() => setTheme(t)}
          >
            {t}
          </a>
        </li>
      ))}
    </ul>
  )
}