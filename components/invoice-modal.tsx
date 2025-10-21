"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Printer, Send } from "lucide-react"
import { toast } from "sonner"
import type { Job } from "@/app/professional/jobs/page"

type InvoiceModalProps = {
  open: boolean
  onClose: () => void
  job: Job | null
  businessName: string
  professionalName: string
}

export type Invoice = {
  id: string
  professionalId: string
  professionalName: string
  businessName: string
  customerId: string
  customerName: string
  jobId: string
  jobName: string
  jobDescription: string
  amount: number
  dueDate: string
  dateSent: string
  datePaid?: string
  paymentMethod?: "cash" | "card" | "other"
  status: "unpaid" | "paid" | "overdue"
}

export function InvoiceModal({ open, onClose, job, businessName, professionalName }: InvoiceModalProps) {
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [customerWMNMId, setCustomerWMNMId] = useState("")
  const [isSending, setIsSending] = useState(false)

  if (!job) return null

  const dueDate = new Date(job.date)
  dueDate.setDate(dueDate.getDate() + 30)

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    // For now, we'll just trigger the print dialog
    window.print()
  }

  const handleSendToCustomer = () => {
    setShowSendDialog(true)
  }

  const handleConfirmSend = () => {
    if (!customerWMNMId.trim()) {
      toast.error("Please enter a valid Customer WMNM ID")
      return
    }

    setIsSending(true)

    // Create invoice object
    const invoice: Invoice = {
      id: `INV-${Date.now()}`,
      professionalId: sessionStorage.getItem("professionalName") || "",
      professionalName: professionalName,
      businessName: businessName,
      customerId: customerWMNMId,
      customerName: job.customerName,
      jobId: job.id,
      jobName: job.jobName,
      jobDescription: job.notes || job.jobName,
      amount: job.paymentReceived,
      dueDate: dueDate.toISOString(),
      dateSent: new Date().toISOString(),
      status: "unpaid",
    }

    // Store invoice in sessionStorage for both professional and customer
    const sentInvoices = JSON.parse(sessionStorage.getItem("sentInvoices") || "[]")
    sentInvoices.push(invoice)
    sessionStorage.setItem("sentInvoices", JSON.stringify(sentInvoices))

    // Also store in customer invoices (simulate sending)
    const customerInvoices = JSON.parse(sessionStorage.getItem("customerInvoices") || "[]")
    customerInvoices.push(invoice)
    sessionStorage.setItem("customerInvoices", JSON.stringify(customerInvoices))

    // Update job with invoice ID
    const jobs = JSON.parse(sessionStorage.getItem("professionalJobs") || "[]")
    const updatedJobs = jobs.map((j: Job) => (j.id === job.id ? { ...j, invoiceId: invoice.id } : j))
    sessionStorage.setItem("professionalJobs", JSON.stringify(updatedJobs))

    toast.success("Invoice sent successfully!", {
      description: `Invoice has been sent to ${job.customerName} (ID: ${customerWMNMId})`,
    })

    setIsSending(false)
    setShowSendDialog(false)
    setCustomerWMNMId("")
    onClose()
  }

  return (
    <>
      <Dialog open={open && !showSendDialog} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto print:shadow-none">
          <DialogHeader className="print:hidden">
            <DialogTitle>Invoice</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 p-6 print:p-0">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">{businessName}</h1>
                <p className="text-muted-foreground mt-1">{professionalName}</p>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-primary">INVOICE</h2>
                <p className="text-sm text-muted-foreground mt-1">#{job.id}</p>
              </div>
            </div>

            <Separator />

            {/* Bill To & Invoice Details */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Bill To:</h3>
                <p className="text-foreground">{job.customerName}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <div>
                    <span className="text-sm text-muted-foreground">Invoice Date: </span>
                    <span className="text-foreground">{new Date(job.date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Due Date: </span>
                    <span className="text-foreground">{dueDate.toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Status: </span>
                    <Badge
                      variant="outline"
                      className={
                        job.paymentStatus === "paid"
                          ? "text-green-600 border-green-600"
                          : "text-amber-600 border-amber-600"
                      }
                    >
                      {job.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Job Details */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Service Details</h3>
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="text-foreground font-medium">{job.jobName}</p>
                </div>
                {job.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Description</p>
                    <p className="text-foreground">{job.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Invoice Items */}
            <div>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-sm font-semibold text-muted-foreground">Description</th>
                    <th className="text-right py-2 text-sm font-semibold text-muted-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 text-foreground">{job.jobName}</td>
                    <td className="py-3 text-right text-foreground">${job.paymentReceived.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-foreground">Total Amount Due:</span>
                <span className="text-xl font-bold text-primary">${job.paymentReceived.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Information */}
            {job.paymentStatus === "paid" && (
              <div className="bg-green-50 dark:bg-green-900/10 rounded-lg p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm font-semibold text-green-800 dark:text-green-400">Payment Received</p>
                <p className="text-sm text-green-700 dark:text-green-500 mt-1">
                  Paid on {new Date(job.date).toLocaleDateString()} via{" "}
                  {job.paymentMethod === "cash" ? "Cash" : job.paymentMethod === "card" ? "Card" : "Manual/Other"}
                </p>
              </div>
            )}

            {job.paymentStatus === "pending" && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Payment Pending</p>
                <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                  Please remit payment by {dueDate.toLocaleDateString()}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">Thank you for your business!</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end print:hidden">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button variant="outline" onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            {job.paymentStatus === "pending" && !job.invoiceId && (
              <Button onClick={handleSendToCustomer} className="gap-2">
                <Send className="w-4 h-4" />
                Send to Customer
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Send to Customer Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Invoice to Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customerWMNMId">Customer WMNM ID</Label>
              <Input
                id="customerWMNMId"
                value={customerWMNMId}
                onChange={(e) => setCustomerWMNMId(e.target.value)}
                placeholder="Enter customer WMNM ID"
                autoFocus
              />
              <p className="text-sm text-muted-foreground">
                Enter the customer's WMNM ID to send them this invoice
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Customer:</span>
                <span className="font-medium">{job.customerName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount:</span>
                <span className="font-medium">${job.paymentReceived.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Due Date:</span>
                <span className="font-medium">{dueDate.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowSendDialog(false)} disabled={isSending}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSend} disabled={isSending} className="gap-2">
              <Send className="w-4 h-4" />
              {isSending ? "Sending..." : "Send Invoice"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
