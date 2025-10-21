"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Home, MessageSquare, Calendar, DollarSign } from "lucide-react"
import { useEffect, useState } from "react"

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const [userType, setUserType] = useState<"customer" | "professional" | null>(null)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const customerName = sessionStorage.getItem("customerName")
    const professionalName = sessionStorage.getItem("professionalName")

    // Determine user type based on current path
    if (pathname.startsWith("/professional")) {
      if (professionalName) {
        setUserType("professional")
        setUserName(professionalName)
      }
    } else if (pathname.startsWith("/customer")) {
      if (customerName) {
        setUserType("customer")
        setUserName(customerName)
      }
    } else {
      // Fallback: prioritize customer if on a neutral page
      if (customerName) {
        setUserType("customer")
        setUserName(customerName)
      } else if (professionalName) {
        setUserType("professional")
        setUserName(professionalName)
      }
    }
  }, [pathname])

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
        { label: "Appointments", href: "/customer/appointments", icon: Calendar },
        { label: "Payments", href: "/customer/payments", icon: DollarSign },
      ]
    }

    // professional
    return [
      { label: "Home", href: "/professional/home", icon: Home },
      { label: "Inquiries", href: "/professional/inquiries", icon: MessageSquare },
      { label: "Appointments", href: "/professional/appointments", icon: Calendar },
    ]
  }

  const navItems = getNavItems()

  // Don't show header on login pages or home page
  if (pathname === "/" || pathname.includes("/login")) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b glass shadow-sm animate-slideInDown">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo and Navigation Menu */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-gradient hover:scale-105 transition-transform"
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
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => router.push(item.href)}
                  className={`gap-2 relative btn-scale ${isActive ? "gradient-primary text-white" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent rounded-full" />
                  )}
                </Button>
              )
            })}
          </nav>
        </div>

        {/* Right: User info and Sign Out */}
        <div className="flex items-center gap-3">
          {userName && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm font-medium">{userName}</span>
            </div>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleSignOut} 
            className="gap-2 hover-lift border border-transparent hover:border-destructive/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
