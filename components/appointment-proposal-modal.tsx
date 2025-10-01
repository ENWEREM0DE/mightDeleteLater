"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"

type AppointmentProposalModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (dateTime: Date) => void
}

export function AppointmentProposalModal({ open, onClose, onSubmit }: AppointmentProposalModalProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const handleSubmit = () => {
    if (!date || !time) return
    const dateTime = new Date(`${date}T${time}`)
    onSubmit(dateTime)
    setDate("")
    setTime("")
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Propose Appointment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!date || !time}>
            Send Proposal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
