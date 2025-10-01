"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Clock, FileText, Calendar } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type InquiryStatus = "initial" | "pending" | "appointment"

type Inquiry = {
  inquiryId: string
  customerName: string
  lastMessagePreview: string
  timestamp: string
  unread: boolean
  status: InquiryStatus
}

// Mock inquiry data with 8 inquiries
const MOCK_INQUIRIES: Inquiry[] = [
  {
    inquiryId: "101",
    customerName: "john_s",
    lastMessagePreview: "Appointment proposed for October 2, 2025 at 10:00 AM",
    timestamp: "Oct 1, 2025",
    unread: true,
    status: "pending",
  },
  {
    inquiryId: "102",
    customerName: "sarah_m",
    lastMessagePreview: "I have a clogged drain in my bathroom. Can you help with this?",
    timestamp: "Sep 30, 2025",
    unread: true,
    status: "initial",
  },
  {
    inquiryId: "103",
    customerName: "mike_t",
    lastMessagePreview: "Thanks for the quick response! I'll be available tomorrow afternoon.",
    timestamp: "Sep 29, 2025",
    unread: false,
    status: "appointment",
  },
  {
    inquiryId: "104",
    customerName: "emily_r",
    lastMessagePreview: "Water heater is making strange noises. Emergency service needed.",
    timestamp: "Sep 28, 2025",
    unread: false,
    status: "initial",
  },
  {
    inquiryId: "105",
    customerName: "david_k",
    lastMessagePreview: "Looking for electrical panel upgrade. Can you provide a quote?",
    timestamp: "Sep 27, 2025",
    unread: false,
    status: "appointment",
  },
  {
    inquiryId: "106",
    customerName: "lisa_p",
    lastMessagePreview: "Need help with kitchen sink installation. When are you available?",
    timestamp: "Sep 26, 2025",
    unread: false,
    status: "initial",
  },
  {
    inquiryId: "107",
    customerName: "robert_w",
    lastMessagePreview: "Appointment scheduled for next week confirmed.",
    timestamp: "Sep 25, 2025",
    unread: false,
    status: "pending",
  },
  {
    inquiryId: "108",
    customerName: "jennifer_h",
    lastMessagePreview: "Hi, I need some plumbing work done in my new house.",
    timestamp: "Sep 24, 2025",
    unread: false,
    status: "initial",
  },
]

function getStatusBadge(status: InquiryStatus) {
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

export default function ProfessionalInquiries() {
  const router = useRouter()
  const [professionalName, setProfessionalName] = useState("")
  const [filter, setFilter] = useState<InquiryStatus | "all" | "unread">("all")

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)
    }
  }, [router])

  if (!professionalName) return null

  const filteredInquiries = MOCK_INQUIRIES.filter((inquiry) => {
    if (filter === "all") return true
    if (filter === "unread") return inquiry.unread
    return inquiry.status === filter
  })

  const stats = {
    total: MOCK_INQUIRIES.length,
    unread: MOCK_INQUIRIES.filter((i) => i.unread).length,
    pending: MOCK_INQUIRIES.filter((i) => i.status === "pending").length,
    appointments: MOCK_INQUIRIES.filter((i) => i.status === "appointment").length,
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground">Customer Inquiries</h1>
            <p className="text-muted-foreground mt-1">Manage and respond to customer requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Inquiries</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">{stats.unread}</div>
                <div className="text-sm text-muted-foreground">Unread</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{stats.appointments}</div>
                <div className="text-sm text-muted-foreground">Appointments</div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className="gap-2"
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              onClick={() => setFilter("unread")}
              className="gap-2"
            >
              Unread ({stats.unread})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              onClick={() => setFilter("pending")}
              className="gap-2"
            >
              Pending ({stats.pending})
            </Button>
            <Button
              variant={filter === "appointment" ? "default" : "outline"}
              onClick={() => setFilter("appointment")}
              className="gap-2"
            >
              Appointments ({stats.appointments})
            </Button>
          </div>

          {/* Inquiries List */}
          <div className="space-y-3">
            {filteredInquiries.map((inquiry) => {
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
    </>
  )
}

