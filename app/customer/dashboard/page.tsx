"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Zap, Sparkles, Truck, GraduationCap, MessageSquare, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"

const CATEGORIES = [
  { name: "Plumbing services", icon: Wrench, color: "bg-blue-500" },
  { name: "Electrical services", icon: Zap, color: "bg-amber-500" },
  { name: "Cleaning Services", icon: Sparkles, color: "bg-emerald-500" },
  { name: "Moving services", icon: Truck, color: "bg-purple-500" },
  { name: "Tutoring services", icon: GraduationCap, color: "bg-rose-500" },
]

export default function CustomerDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("customerName")
    if (!name) {
      router.push("/customer/login")
    } else {
      setUserName(name)
    }
  }, [router])

  if (!userName) return null

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">Hello, {userName}!</h1>
              <p className="text-muted-foreground mt-1">How can we help you today?</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.push("/appointments")} className="gap-2">
                <Calendar className="w-4 h-4" />
                Appointments
              </Button>
              <Button variant="outline" onClick={() => router.push("/customer/inquiries")} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                My Inquiries
              </Button>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.name}
                  href={`/customer/professionals?category=${encodeURIComponent(category.name)}`}
                >
                  <Card className="h-full border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={`${category.color} rounded-2xl p-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
