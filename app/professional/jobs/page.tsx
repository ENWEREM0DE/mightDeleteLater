"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign,
  Plus,
  FileText,
  Filter,
  Calendar as CalendarIcon,
  User,
  CreditCard,
  ArrowLeft,
  Download,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { InvoiceModal } from "@/components/invoice-modal"
import { toast } from "sonner"
import type { Expense } from "@/app/professional/expenses/page"

export type Job = {
  id: string
  jobName: string
  customerName: string
  date: string
  paymentReceived: number
  materialsCost: number
  paymentMethod: "cash" | "card" | "manual"
  paymentStatus: "paid" | "pending"
  notes?: string
  invoiceId?: string
}

// Initialize with mock data
const INITIAL_JOBS: Job[] = [
  {
    id: "J1",
    jobName: "Kitchen Sink Repair",
    customerName: "john_s",
    date: "2025-09-15",
    paymentReceived: 250,
    materialsCost: 50,
    paymentMethod: "card",
    paymentStatus: "paid",
    notes: "Fixed leaking pipes and replaced worn gaskets",
  },
  {
    id: "J2",
    jobName: "Bathroom Plumbing Installation",
    customerName: "sarah_m",
    date: "2025-09-20",
    paymentReceived: 800,
    materialsCost: 200,
    paymentMethod: "cash",
    paymentStatus: "paid",
  },
  {
    id: "J3",
    jobName: "Water Heater Maintenance",
    customerName: "mike_t",
    date: "2025-09-25",
    paymentReceived: 350,
    materialsCost: 75,
    paymentMethod: "card",
    paymentStatus: "paid",
  },
  {
    id: "J4",
    jobName: "Emergency Pipe Repair",
    customerName: "emily_r",
    date: "2025-10-01",
    paymentReceived: 450,
    materialsCost: 100,
    paymentMethod: "manual",
    paymentStatus: "pending",
  },
  {
    id: "J5",
    jobName: "Drain Cleaning Service",
    customerName: "david_k",
    date: "2025-10-05",
    paymentReceived: 180,
    materialsCost: 30,
    paymentMethod: "cash",
    paymentStatus: "paid",
  },
  {
    id: "J6",
    jobName: "Faucet Installation",
    customerName: "lisa_p",
    date: "2025-10-10",
    paymentReceived: 200,
    materialsCost: 0,
    paymentMethod: "manual",
    paymentStatus: "pending",
    notes: "Customer will pay upon completion",
  },
]

export default function ProfessionalJobsPage() {
  const router = useRouter()
  const [professionalName, setProfessionalName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [jobs, setJobs] = useState<Job[]>([])
  const [filter, setFilter] = useState<"all" | "paid" | "pending">("all")
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedJobForInvoice, setSelectedJobForInvoice] = useState<Job | null>(null)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    jobName: "",
    customerName: "",
    date: new Date().toISOString().split("T")[0],
    paymentReceived: "",
    materialsCost: "",
    paymentMethod: "cash" as "cash" | "card" | "manual",
    paymentStatus: "paid" as "paid" | "pending",
    notes: "",
  })

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    const business = sessionStorage.getItem("businessName") || "Your Business"
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)
      setBusinessName(business)

      // Load jobs from sessionStorage or use initial data
      const savedJobs = sessionStorage.getItem("professionalJobs")
      if (savedJobs) {
        setJobs(JSON.parse(savedJobs))
      } else {
        setJobs(INITIAL_JOBS)
        sessionStorage.setItem("professionalJobs", JSON.stringify(INITIAL_JOBS))
      }
    }
  }, [router])

  if (!professionalName) return null

  const saveJobs = (updatedJobs: Job[]) => {
    setJobs(updatedJobs)
    sessionStorage.setItem("professionalJobs", JSON.stringify(updatedJobs))
  }

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.jobName ||
      !formData.customerName ||
      !formData.date ||
      !formData.paymentReceived ||
      formData.materialsCost === ""
    ) {
      toast.error("Please fill in all required fields")
      return
    }

    const newJob: Job = {
      id: `J${Date.now()}`,
      jobName: formData.jobName,
      customerName: formData.customerName,
      date: formData.date,
      paymentReceived: parseFloat(formData.paymentReceived),
      materialsCost: parseFloat(formData.materialsCost),
      paymentMethod: formData.paymentStatus === "pending" ? "manual" : formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      notes: formData.notes,
    }

    const updatedJobs = [newJob, ...jobs]
    saveJobs(updatedJobs)

    // Auto-create expense entry for materials if materials cost > 0
    if (parseFloat(formData.materialsCost) > 0) {
      const expenses = JSON.parse(sessionStorage.getItem("professionalExpenses") || "[]")
      const newExpense: Expense = {
        id: `E${Date.now()}`,
        professionalId: professionalName,
        name: `Materials for ${formData.jobName}`,
        category: "materials",
        amount: parseFloat(formData.materialsCost),
        date: formData.date,
        relatedJobId: newJob.id,
        relatedJobName: formData.jobName,
        notes: `Auto-generated from job: ${formData.jobName}`,
        autoGenerated: true,
      }
      expenses.unshift(newExpense)
      sessionStorage.setItem("professionalExpenses", JSON.stringify(expenses))
    }

    toast.success("Job added successfully!")

    // Reset form
    setFormData({
      jobName: "",
      customerName: "",
      date: new Date().toISOString().split("T")[0],
      paymentReceived: "",
      materialsCost: "",
      paymentMethod: "cash",
      paymentStatus: "paid",
      notes: "",
    })
    setShowAddForm(false)
  }

  const handleGenerateInvoice = (job: Job) => {
    setSelectedJobForInvoice(job)
    setShowInvoiceModal(true)
  }

  const filteredJobs = jobs.filter((job) => {
    if (filter === "all") return true
    return job.paymentStatus === filter
  })

  const totalIncome = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce((sum, job) => sum + job.paymentReceived, 0)
  const totalExpenses = jobs
    .filter((j) => j.paymentStatus === "paid")
    .reduce((sum, job) => sum + job.materialsCost, 0)
  const netProfit = totalIncome - totalExpenses

  const pendingPayments = jobs
    .filter((j) => j.paymentStatus === "pending")
    .reduce((sum, job) => sum + job.paymentReceived, 0)

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
                <h1 className="text-3xl font-bold text-foreground">Job Tracking & Payments</h1>
                <p className="text-muted-foreground mt-1">Manage completed jobs and track your earnings</p>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Job
            </Button>
          </div>

          {/* Financial Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Income</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">${totalIncome.toFixed(2)}</p>
                  </div>
                  <div className="bg-green-500/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Expenses</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">${totalExpenses.toFixed(2)}</p>
                  </div>
                  <div className="bg-red-500/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Profit</p>
                    <p className="text-2xl font-bold text-primary mt-1">${netProfit.toFixed(2)}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending Payments</p>
                    <p className="text-2xl font-bold text-amber-600 mt-1">${pendingPayments.toFixed(2)}</p>
                  </div>
                  <div className="bg-amber-500/10 p-3 rounded-full">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Add Job Form */}
          {showAddForm && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Add New Job</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddJob} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobName">Job Name *</Label>
                      <Input
                        id="jobName"
                        value={formData.jobName}
                        onChange={(e) => setFormData({ ...formData, jobName: e.target.value })}
                        placeholder="e.g., Kitchen Sink Repair"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customerName">Customer Name *</Label>
                      <Input
                        id="customerName"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        placeholder="e.g., john_doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentReceived">Payment Received *</Label>
                      <Input
                        id="paymentReceived"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.paymentReceived}
                        onChange={(e) => setFormData({ ...formData, paymentReceived: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="materialsCost">Materials Cost *</Label>
                      <Input
                        id="materialsCost"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.materialsCost}
                        onChange={(e) => setFormData({ ...formData, materialsCost: e.target.value })}
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentStatus">Payment Status *</Label>
                      <Select
                        value={formData.paymentStatus}
                        onValueChange={(value: "paid" | "pending") =>
                          setFormData({ ...formData, paymentStatus: value })
                        }
                      >
                        <SelectTrigger id="paymentStatus">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.paymentStatus === "paid" && (
                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Payment Method *</Label>
                        <Select
                          value={formData.paymentMethod}
                          onValueChange={(value: "cash" | "card" | "manual") =>
                            setFormData({ ...formData, paymentMethod: value })
                          }
                        >
                          <SelectTrigger id="paymentMethod">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="card">Card</SelectItem>
                            <SelectItem value="manual">Manual/Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Additional details about the job"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Job</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Filters */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({jobs.length})
            </Button>
            <Button
              variant={filter === "paid" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("paid")}
              className="gap-1"
            >
              Paid ({jobs.filter((j) => j.paymentStatus === "paid").length})
            </Button>
            <Button
              variant={filter === "pending" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("pending")}
              className="gap-1"
            >
              Pending ({jobs.filter((j) => j.paymentStatus === "pending").length})
            </Button>
          </div>

          {/* Jobs Table */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Completed Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredJobs.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No jobs found</p>
                ) : (
                  filteredJobs.map((job) => (
                    <Card key={job.id} className="border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{job.jobName}</h3>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <User className="w-4 h-4" />
                                {job.customerName}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                {new Date(job.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                Payment: ${job.paymentReceived.toFixed(2)}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <DollarSign className="w-4 h-4" />
                                Materials: ${job.materialsCost.toFixed(2)}
                              </div>
                            </div>
                            {job.paymentStatus === "paid" && (
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="w-4 h-4 text-muted-foreground" />
                                <span className="text-muted-foreground">
                                  Method: {job.paymentMethod === "cash" ? "Cash" : job.paymentMethod === "card" ? "Card" : "Manual/Other"}
                                </span>
                              </div>
                            )}
                            {job.notes && <p className="text-sm text-muted-foreground italic">{job.notes}</p>}
                            <div className="text-sm font-medium text-foreground">
                              Net: ${(job.paymentReceived - job.materialsCost).toFixed(2)}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleGenerateInvoice(job)}
                          >
                            <Download className="w-4 h-4" />
                            Invoice
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <InvoiceModal
        open={showInvoiceModal}
        onClose={() => {
          setShowInvoiceModal(false)
          setSelectedJobForInvoice(null)
        }}
        job={selectedJobForInvoice}
        businessName={businessName}
        professionalName={professionalName}
      />
    </>
  )
}

