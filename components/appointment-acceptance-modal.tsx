"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { DollarSign } from "lucide-react"

type AppointmentAcceptanceModalProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: { price?: { min: number; max: number }; notes?: string }) => void
}

export function AppointmentAcceptanceModal({ open, onClose, onSubmit }: AppointmentAcceptanceModalProps) {
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [needsInvestigation, setNeedsInvestigation] = useState(false)

  const handleSubmit = () => {
    if (needsInvestigation) {
      onSubmit({ notes: "Needs Further Investigation" })
    } else if (minPrice && maxPrice) {
      onSubmit({ price: { min: Number(minPrice), max: Number(maxPrice) } })
    } else {
      return
    }
    setMinPrice("")
    setMaxPrice("")
    setNeedsInvestigation(false)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Accept Appointment
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minPrice">Minimum $</Label>
                <Input
                  id="minPrice"
                  type="number"
                  placeholder="150"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  disabled={needsInvestigation}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Maximum $</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  placeholder="250"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  disabled={needsInvestigation}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="investigation"
                checked={needsInvestigation}
                onCheckedChange={(checked) => setNeedsInvestigation(checked as boolean)}
              />
              <Label htmlFor="investigation" className="text-sm font-normal cursor-pointer">
                Price cannot be determined until an in-person inspection
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!needsInvestigation && (!minPrice || !maxPrice)}>
            Accept Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
