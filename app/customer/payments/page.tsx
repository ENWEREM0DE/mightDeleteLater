"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DollarSign, Calendar as CalendarIcon, FileText, CreditCard, ArrowLeft, CheckCircle } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { toast } from "sonner"
import type { Invoice } from "@/components/invoice-modal"

export default function CustomerPaymentsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filter, setFilter] = useState<"all" | "unpaid" | "paid" | "overdue">("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "other">("card")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem("customerName")
    if (!name) {
      router.push("/customer/login")
    } else {
      setUserName(name)
      loadInvoices()
    }
  }, [router])

  const loadInvoices = () => {
    const customerInvoices = JSON.parse(sessionStorage.getItem("customerInvoices") || "[]")
    
    // Check for overdue invoices
    const now = new Date()
    const updatedInvoices = customerInvoices.map((inv: Invoice) => {
      if (inv.status === "unpaid" && new Date(inv.dueDate) < now) {
        return { ...inv, status: "overdue" as const }
      }
      return inv
    })
    
    sessionStorage.setItem("customerInvoices", JSON.stringify(updatedInvoices))
    setInvoices(updatedInvoices)
  }

  if (!userName) return null

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return

    setIsProcessing(true)

    // Update invoice status to paid
    const updatedInvoices = invoices.map((inv) => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: "paid" as const,
          datePaid: new Date().toISOString(),
          paymentMethod: paymentMethod,
        }
      }
      return inv
    })

    // Save to sessionStorage
    sessionStorage.setItem("customerInvoices", JSON.stringify(updatedInvoices))
    setInvoices(updatedInvoices)

    // Update professional's job status
    const professionalJobs = JSON.parse(sessionStorage.getItem("professionalJobs") || "[]")
    const updatedJobs = professionalJobs.map((job: any) => {
      if (job.id === selectedInvoice.jobId) {
        return {
          ...job,
          paymentStatus: "paid",
          paymentMethod: paymentMethod,
        }
      }
      return job
    })
    sessionStorage.setItem("professionalJobs", JSON.stringify(updatedJobs))

    // Update sent invoices
    const sentInvoices = JSON.parse(sessionStorage.getItem("sentInvoices") || "[]")
    const updatedSentInvoices = sentInvoices.map((inv: Invoice) => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: "paid" as const,
          datePaid: new Date().toISOString(),
          paymentMethod: paymentMethod,
        }
      }
      return inv
    })
    sessionStorage.setItem("sentInvoices", JSON.stringify(updatedSentInvoices))

    toast.success("Payment successful!", {
      description: `Payment of $${selectedInvoice.amount.toFixed(2)} has been processed.`,
    })

    setIsProcessing(false)
    setShowPaymentModal(false)
    setSelectedInvoice(null)
  }

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === "all") return true
    return inv.status === filter
  })

  const unpaidCount = invoices.filter((i) => i.status === "unpaid" || i.status === "overdue").length
  const totalUnpaid = invoices
    .filter((i) => i.status === "unpaid" || i.status === "overdue")
    .reduce((sum, inv) => sum + inv.amount, 0)
  const totalPaid = invoices.filter((i) => i.status === "paid").reduce((sum, inv) => sum + inv.amount, 0)

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-6xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/customer/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">My Payments</h1>
                <p className="text-muted-foreground mt-1">View and pay invoices from professionals</p>
              </div>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Unpaid</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">${totalUnpaid.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">{unpaidCount} invoice(s)</p>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">${totalPaid.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {invoices.filter((i) => i.status === "paid").length} invoice(s)
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Invoices</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{invoices.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({invoices.length})
            </Button>
            <Button
              variant={filter === "unpaid" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unpaid")}
            >
              Unpaid ({invoices.filter((i) => i.status === "unpaid").length})
            </Button>
            <Button
              variant={filter === "overdue" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("overdue")}
            >
              Overdue ({invoices.filter((i) => i.status === "overdue").length})
            </Button>
            <Button variant={filter === "paid" ? "default" : "outline"} size="sm" onClick={() => setFilter("paid")}>
              Paid ({invoices.filter((i) => i.status === "paid").length})
            </Button>
          </div>

          {/* Invoices List */}
          <div className="space-y-3">
            {filteredInvoices.length === 0 ? (
              <Card className="border-2">
                <CardContent className="p-12 text-center space-y-4">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="font-semibold text-lg">No invoices found</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {filter === "all"
                        ? "You don't have any invoices yet."
                        : `You don't have any ${filter} invoices.`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              filteredInvoices.map((invoice) => (
                <Card key={invoice.id} className="border-2">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-semibold text-lg text-foreground">{invoice.businessName}</h3>
                          <Badge
                            variant="outline"
                            className={
                              invoice.status === "paid"
                                ? "text-green-600 border-green-600"
                                : invoice.status === "overdue"
                                  ? "text-red-600 border-red-600"
                                  : "text-amber-600 border-amber-600"
                            }
                          >
                            {invoice.status === "paid" ? "Paid" : invoice.status === "overdue" ? "Overdue" : "Unpaid"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <FileText className="w-4 h-4" />
                            {invoice.jobName}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <DollarSign className="w-4 h-4" />
                            Amount: ${invoice.amount.toFixed(2)}
                          </div>
                          {invoice.datePaid && (
                            <div className="flex items-center gap-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              Paid: {new Date(invoice.datePaid).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        {invoice.jobDescription && (
                          <p className="text-sm text-muted-foreground">{invoice.jobDescription}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">${invoice.amount.toFixed(2)}</p>
                        </div>
                        {invoice.status !== "paid" && (
                          <Button onClick={() => handlePayInvoice(invoice)} className="gap-2">
                            <CreditCard className="w-4 h-4" />
                            Pay Now
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Process Payment</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Professional:</span>
                  <span className="font-medium">{selectedInvoice.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedInvoice.jobName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Due Date:</span>
                  <span className="font-medium">{new Date(selectedInvoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-primary">${selectedInvoice.amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(v: "cash" | "card" | "other") => setPaymentMethod(v)}>
                  <SelectTrigger id="paymentMethod">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/10 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  💡 This is a mock payment. In production, this would integrate with a real payment processor.
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowPaymentModal(false)} disabled={isProcessing}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment} disabled={isProcessing} className="gap-2">
              <CheckCircle className="w-4 h-4" />
              {isProcessing ? "Processing..." : "Confirm Payment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

