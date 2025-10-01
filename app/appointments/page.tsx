"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, MapPin, Check, X, ArrowLeft } from "lucide-react"
import { AppointmentDetailModal } from "@/components/appointment-detail-modal"
import { AppointmentAcceptanceModal } from "@/components/appointment-acceptance-modal"
import { AppHeader } from "@/components/app-header"

type Appointment = {
  id: string
  title: string
  status: "pending" | "scheduled"
  start: string
  end: string
  otherPartyName: string
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
    otherPartyName: "Pro Plumbers Inc.",
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
    otherPartyName: "Spark Electric Co.",
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
    otherPartyName: "Cool Air Services",
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
    otherPartyName: "Pro Plumbers Inc.",
    address: "321 Elm St, Anytown, USA",
    priceInfo: "$100 - $150",
    inquiryId: "104",
  },
]

export default function AppointmentsPage() {
  const router = useRouter()
  const [userType, setUserType] = useState<"customer" | "professional" | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false)
  const [appointmentToAccept, setAppointmentToAccept] = useState<string | null>(null)

  useEffect(() => {
    const customerName = sessionStorage.getItem("customerName")
    const professionalName = sessionStorage.getItem("professionalName")

    if (customerName) {
      setUserType("customer")
    } else if (professionalName) {
      setUserType("professional")
    } else {
      router.push("/")
    }
  }, [router])

  if (!userType) return null

  const pendingAppointments = MOCK_APPOINTMENTS.filter((apt) => apt.status === "pending")
  const scheduledAppointments = MOCK_APPOINTMENTS.filter((apt) => apt.status === "scheduled")

  const handleAppointmentClick = (appointment: Appointment) => {
    if (appointment.status === "scheduled") {
      setSelectedAppointment(appointment)
      setShowDetailModal(true)
    }
  }

  const handleAcceptAppointment = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAppointmentToAccept(appointmentId)
    setShowAcceptanceModal(true)
  }

  const handleAcceptanceSubmit = (data: { price?: { min: number; max: number }; notes?: string }) => {
    const priceInfo = data.notes || `$${data.price?.min} - $${data.price?.max}`

    setShowAcceptanceModal(false)
    setAppointmentToAccept(null)

    // TODO: Update appointment status to "scheduled" in backend
  }

  const handleDeclineAppointment = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // TODO: Remove appointment from pending list in backend
  }

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

  const backUrl = userType === "customer" ? "/customer/dashboard" : "/professional/dashboard"

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push(backUrl)}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                <p className="text-muted-foreground mt-1">
                  {userType === "professional"
                    ? "Manage incoming appointment requests and scheduled appointments"
                    : "View your pending and scheduled appointments"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Appointments */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  {userType === "professional" ? "Pending Requests" : "Pending Appointments"}
                  <Badge variant="secondary">{pendingAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    {userType === "professional" ? "No pending requests" : "No pending appointments"}
                  </p>
                ) : (
                  pendingAppointments.map((appointment) => (
                    <Card key={appointment.id} className={userType === "customer" ? "" : ""}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.otherPartyName}</p>
                          </div>
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            Pending
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
                        {userType === "professional" && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              className="flex-1 gap-2"
                              onClick={(e) => handleAcceptAppointment(appointment.id, e)}
                            >
                              <Check className="w-4 h-4" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 gap-2 text-destructive hover:text-destructive bg-transparent"
                              onClick={(e) => handleDeclineAppointment(appointment.id, e)}
                            >
                              <X className="w-4 h-4" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Scheduled Appointments */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-green-500" />
                  Scheduled Appointments
                  <Badge variant="secondary">{scheduledAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scheduledAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No scheduled appointments</p>
                ) : (
                  scheduledAppointments.map((appointment) => (
                    <Card
                      key={appointment.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleAppointmentClick(appointment)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                            <p className="text-sm text-muted-foreground">{appointment.otherPartyName}</p>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Scheduled
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
                      </CardContent>
                    </Card>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <AppointmentAcceptanceModal
          open={showAcceptanceModal}
          onClose={() => {
            setShowAcceptanceModal(false)
            setAppointmentToAccept(null)
          }}
          onSubmit={handleAcceptanceSubmit}
        />

        <AppointmentDetailModal
          open={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          appointment={
            selectedAppointment
              ? {
                  ...selectedAppointment,
                  dateTime: formatDateTime(selectedAppointment.start),
                }
              : null
          }
        />
      </div>
    </>
  )
}
