"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp,
  Eye,
  Settings,
  FileText,
  Briefcase,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import type { Job } from "@/app/professional/jobs/page"
import type { Expense } from "@/app/professional/expenses/page"

type Activity = {
  id: string
  type: "inquiry" | "appointment" | "payment" | "review"
  description: string
  timestamp: string
}

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

const PAYMENT_COLORS = {
  cash: "#10b981",
  card: "#3b82f6",
  manual: "#8b5cf6",
}

const EXPENSE_COLORS = {
  materials: "#3b82f6",
  transportation: "#a855f7",
  miscellaneous: "#f97316",
}

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
  const [jobs, setJobs] = useState<Job[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    const business = sessionStorage.getItem("businessName") || "Your Business"
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)
      setBusinessName(business)

      // Load jobs from sessionStorage
      const savedJobs = sessionStorage.getItem("professionalJobs")
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs))
      }

      // Load expenses from sessionStorage
      const savedExpenses = sessionStorage.getItem("professionalExpenses")
      if (savedExpenses) {
        setExpenses(JSON.parse(savedExpenses))
      }
    }
  }, [router])

  if (!professionalName) return null

  // Calculate financial metrics using expense tracking
  const totalIncome = jobs.filter((j) => j.paymentStatus === "paid").reduce((sum, job) => sum + job.paymentReceived, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const netProfit = totalIncome - totalExpenses

  // Calculate monthly income vs expenses
  const monthlyData = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce(
      (acc, job) => {
        const date = new Date(job.date)
        const monthYear = date.toLocaleString("en-US", { month: "short", year: "numeric" })

        if (!acc[monthYear]) {
          acc[monthYear] = { month: monthYear, income: 0, expenses: 0 }
        }

        acc[monthYear].income += job.paymentReceived
        acc[monthYear].expenses += job.materialsCost

        return acc
      },
      {} as Record<string, { month: string; income: number; expenses: number }>,
    )

  const chartData = Object.values(monthlyData).slice(-4) // Last 4 months

  // Calculate payment method breakdown
  const paymentMethodData = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce(
      (acc, job) => {
        acc[job.paymentMethod] = (acc[job.paymentMethod] || 0) + job.paymentReceived
        return acc
      },
      {} as Record<string, number>,
    )

  const pieData = Object.entries(paymentMethodData).map(([method, value]) => ({
    name: method === "cash" ? "Cash" : method === "card" ? "Card" : "Manual/Other",
    value,
  }))

  // Calculate expense breakdown by category
  const expenseByCategory = expenses.reduce(
    (acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const expensePieData = Object.entries(expenseByCategory).map(([category, value]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value,
  }))

  const newInquiries = 8 // Mock data
  const appointments = 15 // Mock data
  const rating = 4.8 // Mock data

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold text-gradient mb-2">{businessName}</h1>
            <p className="text-lg text-muted-foreground">Welcome back, {professionalName} 👋</p>
          </div>

          {/* WMNM Tools - Quick Actions */}
          <Card className="border-2 gradient-primary shadow-glow animate-slideInLeft">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <h3 className="font-bold text-white text-lg">⚡ WMNM Tools</h3>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/inquiries")}
                  >
                    <Eye className="w-4 h-4" />
                    Inquiries
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/appointments")}
                  >
                    <Calendar className="w-4 h-4" />
                    Appointments
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/jobs")}
                  >
                    <Briefcase className="w-4 h-4" />
                    Jobs
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/expenses")}
                  >
                    <DollarSign className="w-4 h-4" />
                    Expenses
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/form-builder")}
                  >
                    <FileText className="w-4 h-4" />
                    Form Builder
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2 btn-scale"
                    onClick={() => router.push("/professional/profile")}
                  >
                    <Settings className="w-4 h-4" />
                    Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 stagger-fadeIn">
            <Card className="border-2 card-hover gradient-success">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Total Income</p>
                    <p className="text-3xl font-bold text-white mt-1">${totalIncome.toFixed(2)}</p>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      From completed jobs
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 card-hover bg-gradient-to-br from-red-500 to-red-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Total Expenses</p>
                    <p className="text-3xl font-bold text-white mt-1">${totalExpenses.toFixed(2)}</p>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-2">Business costs</p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 card-hover gradient-primary shadow-glow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/80">Net Profit</p>
                    <p className="text-3xl font-bold text-white mt-1">${netProfit.toFixed(2)}</p>
                    <p className="text-xs text-white/90 flex items-center gap-1 mt-2">
                      <TrendingUp className="w-3 h-3" />
                      After expenses
                    </p>
                  </div>
                  <div className="bg-white/20 p-4 rounded-2xl">
                    <DollarSign className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 card-hover gradient-accent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-accent-foreground/80">Rating</p>
                    <p className="text-3xl font-bold text-accent-foreground mt-1">{rating}⭐</p>
                    <p className="text-xs text-accent-foreground/90 flex items-center gap-1 mt-2">
                      <Star className="w-3 h-3 fill-current" />
                      Based on 42 reviews
                    </p>
                  </div>
                  <div className="bg-accent-foreground/20 p-4 rounded-2xl">
                    <Star className="w-8 h-8 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fadeIn">
            {/* Income vs Expenses Chart */}
            <Card className="border-2 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Monthly Income vs Expenses</h3>
                </div>
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" style={{ fontSize: "12px" }} />
                      <YAxis style={{ fontSize: "12px" }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" fill="#10b981" name="Income" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mb-2 opacity-20" />
                    <p>No data yet. Add completed jobs to see charts.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expense Breakdown */}
            <Card className="border-2 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-bold text-foreground">Expense Breakdown by Category</h3>
                </div>
                {expensePieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensePieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              entry.name === "Materials"
                                ? EXPENSE_COLORS.materials
                                : entry.name === "Transportation"
                                  ? EXPENSE_COLORS.transportation
                                  : EXPENSE_COLORS.miscellaneous
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "white", 
                          border: "2px solid #e5e7eb",
                          borderRadius: "8px"
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                    <DollarSign className="w-12 h-12 mb-2 opacity-20" />
                    <p>No expense data yet. Add expenses to see breakdown.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Method Breakdown */}
          <Card className="border-2 card-hover animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-500" />
                Payment Method Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: $${entry.value.toFixed(0)}`}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry.name === "Cash"
                              ? PAYMENT_COLORS.cash
                              : entry.name === "Card"
                                ? PAYMENT_COLORS.card
                                : PAYMENT_COLORS.manual
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "white", 
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px"
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                  <DollarSign className="w-12 h-12 mb-2 opacity-20" />
                  <p>No payment data yet. Add completed jobs to see breakdown.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-2 card-hover animate-fadeIn">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-bold text-foreground">Recent Activity</h3>
                </div>
                <div className="space-y-3">
                  {RECENT_ACTIVITIES.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors animate-fadeIn"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${getActivityColor(activity.type)} animate-pulse-glow`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{activity.description}</p>
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
