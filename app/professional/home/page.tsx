"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, MessageSquare, Calendar, Star, TrendingUp, Eye, Settings, FileText } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type RevenueMonth = {
  month: string
  amount: number
  percentage: number
}

type Activity = {
  id: string
  type: "inquiry" | "appointment" | "payment" | "review"
  description: string
  timestamp: string
}

const REVENUE_DATA: RevenueMonth[] = [
  { month: "June", amount: 2850, percentage: 65 },
  { month: "July", amount: 3200, percentage: 75 },
  { month: "August", amount: 3900, percentage: 90 },
  { month: "September", amount: 2500, percentage: 60 },
]

const RECENT_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "inquiry",
    description: "New inquiry from john_s",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    type: "appointment",
    description: "Appointment confirmed with sarah_m",
    timestamp: "5 hours ago",
  },
  {
    id: "3",
    type: "payment",
    description: "Payment received: $250",
    timestamp: "1 day ago",
  },
  {
    id: "4",
    type: "review",
    description: "New 5-star review from mike_t",
    timestamp: "2 days ago",
  },
]

function getActivityColor(type: Activity["type"]) {
  switch (type) {
    case "inquiry":
      return "bg-blue-500"
    case "appointment":
      return "bg-green-500"
    case "payment":
      return "bg-purple-500"
    case "review":
      return "bg-yellow-500"
  }
}

export default function ProfessionalHome() {
  const router = useRouter()
  const [professionalName, setProfessionalName] = useState("")
  const [businessName, setBusinessName] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    const business = sessionStorage.getItem("businessName") || "Your Business"
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)
      setBusinessName(business)
    }
  }, [router])

  if (!professionalName) return null

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Blue Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-600">
              📊 Dashboard for Business Stuff: Track your business performance, customer engagement, and revenue metrics
              all in one place.
            </p>
          </div>

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">{businessName}</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {professionalName}</p>
          </div>

          {/* Business Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">$12,450</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      +12.5% from last month
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Inquiries</p>
                    <p className="text-2xl font-bold text-foreground mt-1">8</p>
                    <p className="text-xs text-blue-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      +3 this week
                    </p>
                  </div>
                  <div className="bg-blue-500/10 p-3 rounded-full">
                    <MessageSquare className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Appointments</p>
                    <p className="text-2xl font-bold text-foreground mt-1">15</p>
                    <p className="text-xs text-purple-600 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      5 upcoming
                    </p>
                  </div>
                  <div className="bg-purple-500/10 p-3 rounded-full">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Rating</p>
                    <p className="text-2xl font-bold text-foreground mt-1">4.8</p>
                    <p className="text-xs text-yellow-600 flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-current" />
                      Based on 42 reviews
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 p-3 rounded-full">
                    <Star className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
                <div className="space-y-4">
                  {REVENUE_DATA.map((item) => (
                    <div key={item.month}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">{item.month}</span>
                        <span className="text-sm font-medium text-foreground">${item.amount}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary rounded-full h-2 transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => router.push("/professional/inquiries")}
                  >
                    <Eye className="w-5 h-5" />
                    View All Inquiries
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => router.push("/appointments")}
                  >
                    <Calendar className="w-5 h-5" />
                    Manage Appointments
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => router.push("/professional/profile")}
                  >
                    <Settings className="w-5 h-5" />
                    Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="border-2">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {RECENT_ACTIVITIES.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

