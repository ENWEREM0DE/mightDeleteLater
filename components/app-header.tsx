"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, MessageSquare, Calendar } from "lucide-react"
import { useEffect, useState } from "react"

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [userType, setUserType] = useState<"customer" | "professional" | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const customerName = sessionStorage.getItem("customerName")
    const professionalName = sessionStorage.getItem("professionalName")

    if (customerName) {
      setUserType("customer")
      setUserName(customerName)
    } else if (professionalName) {
      setUserType("professional")
      setUserName(professionalName)
    }
  }, [])

  const handleSignOut = () => {
    sessionStorage.clear()
    router.push("/")
  }

  const getNavItems = () => {
    if (!userType) return []

    if (userType === "customer") {
      return [
        { label: "Home", href: "/customer/dashboard", icon: Home },
        { label: "Inquiries", href: "/customer/inquiries", icon: MessageSquare },
        { label: "Appointments", href: "/appointments", icon: Calendar },
      ]
    }

    // professional
    return [
      { label: "Home", href: "/professional/home", icon: Home },
      { label: "Inquiries", href: "/professional/inquiries", icon: MessageSquare },
      { label: "Appointments", href: "/appointments", icon: Calendar },
    ]
  }

  const navItems = getNavItems()

  // Don't show header on login pages or home page
  if (pathname === "/" || pathname.includes("/login")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo and Navigation Menu */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            WMNM
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className="gap-2"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Right: User info and Sign Out */}
        <div className="flex items-center gap-4">
          {userName && <span className="text-sm text-muted-foreground hidden sm:inline">{userName}</span>}
          <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
