"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, MapPin, ArrowLeft } from "lucide-react"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"
import { AppHeader } from "@/components/app-header"

type Appointment = {
  id: string
  title: string
  status: "pending" | "scheduled"
  start: string
  end: string
  professionalName: string
  category: string
  address: string
  priceInfo: string
  inquiryId: string
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "A1",
    title: "Plumbing Inspection",
    status: "scheduled",
    start: "2025-10-15T14:00:00",
    end: "2025-10-15T15:00:00",
    professionalName: "Pro Plumbers Inc.",
    category: "Plumbing",
    address: "123 Main St, Anytown, USA",
    priceInfo: "$150 - $250",
    inquiryId: "101",
  },
  {
    id: "A2",
    title: "Electrical Outlet Repair",
    status: "pending",
    start: "2025-10-20T10:00:00",
    end: "2025-10-20T11:00:00",
    professionalName: "Spark Electric Co.",
    category: "Electrical",
    address: "456 Oak Ave, Anytown, USA",
    priceInfo: "Needs Further Investigation",
    inquiryId: "102",
  },
  {
    id: "A3",
    title: "HVAC Maintenance",
    status: "scheduled",
    start: "2025-10-18T09:00:00",
    end: "2025-10-18T10:30:00",
    professionalName: "Cool Air Services",
    category: "HVAC",
    address: "789 Pine Rd, Anytown, USA",
    priceInfo: "$200 - $300",
    inquiryId: "103",
  },
  {
    id: "A4",
    title: "Drain Cleaning",
    status: "pending",
    start: "2025-10-22T13:00:00",
    end: "2025-10-22T14:00:00",
    professionalName: "Quick Fix Plumbing",
    category: "Plumbing",
    address: "321 Elm St, Anytown, USA",
    priceInfo: "$100 - $150",
    inquiryId: "104",
  },
  {
    id: "A5",
    title: "Kitchen Sink Installation",
    status: "scheduled",
    start: "2025-10-25T11:00:00",
    end: "2025-10-25T13:00:00",
    professionalName: "Pro Plumbers Inc.",
    category: "Plumbing",
    address: "555 Maple Dr, Anytown, USA",
    priceInfo: "$300 - $400",
    inquiryId: "105",
  },
]

export default function CustomerAppointmentsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem("customerName")
    if (!name) {
      router.push("/customer/login")
    } else {
      setUserName(name)
    }
  }, [router])

  if (!userName) return null

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const handleAppointmentClick = (appointment: Appointment) => {
    if (appointment.status === "scheduled") {
      setSelectedAppointment(appointment)
      setShowDetailModal(true)
    }
  }

  // Group appointments by category
  const appointmentsByCategory = MOCK_APPOINTMENTS.reduce(
    (acc, appointment) => {
      if (!acc[appointment.category]) {
        acc[appointment.category] = []
      }
      acc[appointment.category].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>,
  )

  const pendingCount = MOCK_APPOINTMENTS.filter((a) => a.status === "pending").length
  const scheduledCount = MOCK_APPOINTMENTS.filter((a) => a.status === "scheduled").length

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/customer/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                <p className="text-muted-foreground mt-1">View your appointments organized by service category</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{MOCK_APPOINTMENTS.length}</div>
                <div className="text-sm text-muted-foreground">Total Appointments</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
                <div className="text-sm text-muted-foreground">Pending Confirmation</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{scheduledCount}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </CardContent>
            </Card>
          </div>

          {/* Appointments Grouped by Category */}
          <div className="space-y-6">
            {Object.entries(appointmentsByCategory).map(([category, appointments]) => (
              <Card key={category} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category}
                    <Badge variant="secondary">{appointments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {appointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className={`cursor-pointer hover:border-primary transition-colors ${
                        appointment.status === "scheduled" ? "" : "opacity-75"
                      }`}
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.professionalName}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              appointment.status === "pending"
                                ? "text-amber-600 border-amber-600"
                                : "text-green-600 border-green-600"
                            }
                          >
                            {appointment.status === "pending" ? (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            ) : (
                              "Scheduled"
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="w-4 h-4" />
                          {formatDateTime(appointment.start)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {appointment.address}
                        </div>
                        {appointment.priceInfo && (
                          <div className="text-sm font-medium text-foreground">Price: {appointment.priceInfo}</div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {MOCK_APPOINTMENTS.length === 0 && (
            <Card className="border-2">
              <CardContent className="p-12 text-center space-y-4">
                <CalendarIcon className="w-12 h-12 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="font-semibold text-lg">No appointments yet</h3>
                  <p className="text-muted-foreground text-sm mt-1">
                    Start by finding a professional and sending an inquiry
                  </p>
                </div>
                <Button onClick={() => router.push("/customer/dashboard")}>Find Services</Button>
              </CardContent>
            </Card>
          )}
        </div>

        <AppointmentDetailModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          appointment={
            selectedAppointment
              ? {
                  ...selectedAppointment,
                  otherPartyName: selectedAppointment.professionalName,
                  dateTime: formatDateTime(selectedAppointment.start),
                }
              : null
          }
        />
      </div>
    </>
  )
}

