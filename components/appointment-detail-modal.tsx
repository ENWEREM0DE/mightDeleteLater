"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, User, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

type AppointmentDetailModalProps = {
  open: boolean
  onClose: () => void
  appointment: {
    id: string
    otherPartyName: string
    dateTime: string
    address: string
    priceInfo: string
    inquiryId: string
  } | null
}

export function AppointmentDetailModal({ open, onClose, appointment }: AppointmentDetailModalProps) {
  const router = useRouter()

  if (!appointment) return null

  const handleViewConversation = () => {
    router.push(`/chat/${appointment.inquiryId}`)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Appointment Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Who</div>
                <div className="text-base font-semibold">{appointment.otherPartyName}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">When</div>
                <div className="text-base font-semibold">{appointment.dateTime}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Where</div>
                <div className="text-base font-semibold">{appointment.address}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <div className="text-sm font-medium text-muted-foreground">Estimated Cost</div>
                <div className="text-base font-semibold">{appointment.priceInfo}</div>
              </div>
            </div>
          </div>
          <Button onClick={handleViewConversation} className="w-full gap-2">
            <MessageSquare className="w-4 h-4" />
            View Conversation
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
