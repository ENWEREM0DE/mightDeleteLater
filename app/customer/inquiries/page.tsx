"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Search, Clock, Calendar, FileText } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type InquirySummary = {
  inquiryId: string
  professionalName: string
  lastMessagePreview: string
  timestamp: string
  category: string
  status: "initial" | "pending" | "appointment"
}

// Mock inquiry data
const MOCK_INQUIRIES: InquirySummary[] = [
  {
    inquiryId: "101",
    professionalName: "Pro Plumbers Inc.",
    lastMessagePreview: "Appointment proposed for October 2, 2025 at 10:00 AM",
    timestamp: "Oct 1, 2025",
    category: "Plumbing",
    status: "pending", // Customer proposed appointment, waiting for professional to accept
  },
  {
    inquiryId: "103",
    professionalName: "Quick Fix Plumbing",
    lastMessagePreview: "Thanks for the quick response! I'll be available tomorrow afternoon.",
    timestamp: "Sep 29, 2025",
    category: "Plumbing",
    status: "initial", // No appointment proposed yet, just conversation
  },
  {
    inquiryId: "104",
    professionalName: "Elite Electricians",
    lastMessagePreview: "123 Main Street, Apt 4B. Thank you!",
    timestamp: "Sep 28, 2025",
    category: "Electrical",
    status: "initial", // No appointment proposed yet
  },
  {
    inquiryId: "105",
    professionalName: "Cool Air HVAC",
    lastMessagePreview: "I can come by next week to inspect the system.",
    timestamp: "Sep 27, 2025",
    category: "HVAC",
    status: "initial", // No appointment proposed yet
  },
  {
    inquiryId: "106",
    professionalName: "Spark Electric Co.",
    lastMessagePreview: "The panel upgrade will take about 2 days.",
    timestamp: "Sep 26, 2025",
    category: "Electrical",
    status: "initial", // No appointment proposed yet
  },
]

function getStatusBadge(status: "initial" | "pending" | "appointment") {
  switch (status) {
    case "initial":
      return {
        label: "Initial Inquiry",
        icon: FileText,
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      }
    case "pending":
      return {
        label: "Pending",
        icon: Clock,
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      }
    case "appointment":
      return {
        label: "Appointment",
        icon: Calendar,
        className: "bg-green-500/10 text-green-600 border-green-500/20",
      }
  }
}

export default function CustomerInquiriesPage() {
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

  const groupedInquiries = MOCK_INQUIRIES.reduce(
    (acc, inquiry) => {
      if (!acc[inquiry.category]) {
        acc[inquiry.category] = []
      }
      acc[inquiry.category].push(inquiry)
      return acc
    },
    {} as Record<string, InquirySummary[]>,
  )

  if (!userName) return null

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header with Navigation */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-foreground">My Inquiries</h1>
              <Button
                variant="outline"
                className="gap-2 bg-transparent"
                onClick={() => router.push("/customer/dashboard")}
              >
                <Search className="w-4 h-4" />
                Find Services
              </Button>
            </div>
            <p className="text-muted-foreground">View and manage your conversations with professionals</p>
          </div>

          {/* Inquiries List - Grouped by Category */}
          <div className="space-y-8">
            {MOCK_INQUIRIES.length === 0 ? (
              <Card className="border-2">
                <CardContent className="p-12 text-center space-y-4">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg">No inquiries yet</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Start by finding a professional and sending an inquiry
                    </p>
                  </div>
                  <Button onClick={() => router.push("/customer/dashboard")}>Find Services</Button>
                </CardContent>
              </Card>
            ) : (
              Object.entries(groupedInquiries).map(([category, inquiries]) => (
                <div key={category} className="space-y-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold text-foreground">{category}</h2>
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-sm text-muted-foreground">
                      {inquiries.length} conversation{inquiries.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Inquiries in this category */}
                  <div className="space-y-3">
                    {inquiries.map((inquiry) => {
                      const statusBadge = getStatusBadge(inquiry.status)
                      const StatusIcon = statusBadge.icon

                      return (
                        <Link key={inquiry.inquiryId} href={`/chat/${inquiry.inquiryId}`}>
                          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                            <CardContent className="p-6">
                              <div className="flex items-start gap-4">
                                <div className="bg-primary/10 rounded-full p-3">
                                  <MessageSquare className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0 space-y-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-lg text-foreground">
                                          {inquiry.professionalName}
                                        </h3>
                                        <span
                                          className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge.className}`}
                                        >
                                          <StatusIcon className="w-3.5 h-3.5" />
                                          {statusBadge.label}
                                        </span>
                                      </div>
                                      <p className="text-muted-foreground text-sm line-clamp-2">
                                        {inquiry.lastMessagePreview}
                                      </p>
                                    </div>
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                                      {inquiry.timestamp}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  )
}
