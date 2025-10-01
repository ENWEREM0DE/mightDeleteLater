"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, MessageSquare, Calendar, Clock, FileText } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type Inquiry = {
  inquiryId: string
  customerName: string
  lastMessagePreview: string
  timestamp: string
  unread: boolean
  status: "initial" | "pending" | "appointment"
}

// Mock inquiry data
const MOCK_INQUIRIES: Inquiry[] = [
  {
    inquiryId: "101",
    customerName: "john_s",
    lastMessagePreview: "Appointment proposed for October 2, 2025 at 10:00 AM",
    timestamp: "Oct 1, 2025",
    unread: true,
    status: "pending", // Customer proposed appointment, waiting for professional to accept
  },
  {
    inquiryId: "102",
    customerName: "sarah_m",
    lastMessagePreview: "I have a clogged drain in my bathroom. Can you help with this?",
    timestamp: "Sep 30, 2025",
    unread: true,
    status: "initial", // Only initial inquiry, no response yet
  },
  {
    inquiryId: "103",
    customerName: "mike_t",
    lastMessagePreview: "Thanks for the quick response! I'll be available tomorrow afternoon.",
    timestamp: "Sep 29, 2025",
    unread: false,
    status: "initial", // Has conversation but no appointment proposed
  },
  {
    inquiryId: "104",
    customerName: "emily_r",
    lastMessagePreview: "Water heater is making strange noises. Emergency service needed.",
    timestamp: "Sep 28, 2025",
    unread: false,
    status: "initial", // Has conversation but no appointment proposed
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

export default function ProfessionalDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [businessName, setBusinessName] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    const business = sessionStorage.getItem("businessName") || "Your Business"
    if (!name) {
      router.push("/professional/login")
    } else {
      setUserName(name)
      setBusinessName(business)
    }
  }, [router])

  if (!userName) return null

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{businessName}</h1>
              <p className="text-muted-foreground mt-1">Welcome back, {userName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push("/appointments")} className="gap-2 bg-transparent">
                <Calendar className="w-4 h-4" />
                Appointments
              </Button>
              <Link href="/professional/profile">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary">{MOCK_INQUIRIES.filter((i) => i.unread).length}</div>
                <div className="text-sm text-muted-foreground">New Inquiries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary">{MOCK_INQUIRIES.length}</div>
                <div className="text-sm text-muted-foreground">Total Inquiries</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-primary">4.8</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
          </div>

          {/* Inquiries List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Customer Inquiries</h2>
            <div className="space-y-3">
              {MOCK_INQUIRIES.map((inquiry) => {
                const statusBadge = getStatusBadge(inquiry.status)
                const StatusIcon = statusBadge.icon

                return (
                  <Link key={inquiry.inquiryId} href={`/chat/${inquiry.inquiryId}`}>
                    <Card
                      className={`border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer ${
                        inquiry.unread ? "bg-accent/30" : ""
                      }`}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3 flex-wrap">
                              <h3 className="font-semibold text-foreground">{inquiry.customerName}</h3>
                              {inquiry.unread && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                              <span
                                className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${statusBadge.className}`}
                              >
                                <StatusIcon className="w-3.5 h-3.5" />
                                {statusBadge.label}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{inquiry.lastMessagePreview}</p>
                            <p className="text-xs text-muted-foreground">{inquiry.timestamp}</p>
                          </div>
                          <MessageSquare className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
