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
  customerName: string
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
    customerName: "john_s",
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
    customerName: "sarah_m",
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
    customerName: "mike_t",
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
    customerName: "emily_r",
    address: "321 Elm St, Anytown, USA",
    priceInfo: "$100 - $150",
    inquiryId: "104",
  },
  {
    id: "A5",
    title: "Water Heater Repair",
    status: "scheduled",
    start: "2025-10-25T11:00:00",
    end: "2025-10-25T13:00:00",
    customerName: "john_s",
    address: "555 Maple Dr, Anytown, USA",
    priceInfo: "$300 - $400",
    inquiryId: "105",
  },
  {
    id: "A6",
    title: "Kitchen Faucet Installation",
    status: "pending",
    start: "2025-10-28T14:00:00",
    end: "2025-10-28T15:30:00",
    customerName: "david_k",
    address: "789 Oak Blvd, Anytown, USA",
    priceInfo: "$150 - $200",
    inquiryId: "106",
  },
]

export default function ProfessionalAppointmentsPage() {
  const router = useRouter()
  const [professionalName, setProfessionalName] = useState("")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false)
  const [appointmentToAccept, setAppointmentToAccept] = useState<string | null>(null)

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)
    }
  }, [router])

  if (!professionalName) return null

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

  const handleAcceptAppointment = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAppointmentToAccept(appointmentId)
    setShowAcceptanceModal(true)
  }

  const handleAcceptanceSubmit = (data: { price?: { min: number; max: number }; notes?: string }) => {
    setShowAcceptanceModal(false)
    setAppointmentToAccept(null)
    // TODO: Update appointment status to "scheduled" in backend
  }

  const handleDeclineAppointment = (appointmentId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    // TODO: Remove appointment from pending list in backend
  }

  // Group appointments by customer
  const appointmentsByCustomer = MOCK_APPOINTMENTS.reduce(
    (acc, appointment) => {
      if (!acc[appointment.customerName]) {
        acc[appointment.customerName] = []
      }
      acc[appointment.customerName].push(appointment)
      return acc
    },
    {} as Record<string, Appointment[]>,
  )

  const pendingAppointments = MOCK_APPOINTMENTS.filter((apt) => apt.status === "pending")
  const scheduledAppointments = MOCK_APPOINTMENTS.filter((apt) => apt.status === "scheduled")

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/professional/home")}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
                <p className="text-muted-foreground mt-1">Manage appointments organized by customer</p>
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
                <div className="text-2xl font-bold text-amber-600">{pendingAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Pending Requests</div>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">{scheduledAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Scheduled</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Requests */}
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Requests
                  <Badge variant="secondary">{pendingAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingAppointments.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No pending requests</p>
                ) : (
                  pendingAppointments.map((appointment) => (
                    <Card key={appointment.id}>
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold text-foreground">{appointment.title}</h3>
                            <p className="text-sm text-muted-foreground">Customer: {appointment.customerName}</p>
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
                  Scheduled
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
                            <p className="text-sm text-muted-foreground">Customer: {appointment.customerName}</p>
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

          {/* Appointments Grouped by Customer */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Appointments by Customer</h2>
            {Object.entries(appointmentsByCustomer).map(([customerName, appointments]) => (
              <Card key={customerName} className="border-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {customerName}
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
                      onClick={() => appointment.status === "scheduled" && handleAppointmentClick(appointment)}
                    >
                      <CardContent className="p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-semibold text-foreground">{appointment.title}</h3>
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
                  otherPartyName: selectedAppointment.customerName,
                  dateTime: formatDateTime(selectedAppointment.start),
                }
              : null
          }
        />
      </div>
    </>
  )
}

