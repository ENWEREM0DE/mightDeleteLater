"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Star, MapPin, Send } from "lucide-react"

// Mock professional data
const MOCK_PROFESSIONAL_DATA: Record<string, any> = {
  "1": {
    businessName: "Pro Plumbers Inc.",
    rating: 4.8,
    distance: "2.1 miles",
    bio: "With over 15 years of experience, Pro Plumbers Inc. provides reliable and professional plumbing services. We specialize in emergency repairs, installations, and maintenance for residential and commercial properties.",
    pictures: ["/plumber-working.png", "/plumbing-tools-and-equipment.jpg", "/modern-bathroom-installation.jpg"],
    formTemplate: [
      {
        id: "q1",
        label: "What is the issue?",
        type: "select",
        options: ["Leaky Faucet", "Clogged Drain", "Broken Pipe", "Water Heater Issue", "Other"],
      },
      { id: "q2", label: "Describe the issue in detail", type: "textarea" },
      { id: "q3", label: "Preferred contact method", type: "select", options: ["Phone", "Email", "Text Message"] },
      {
        id: "q4",
        label: "When do you need service?",
        type: "select",
        options: ["Emergency (ASAP)", "Within 24 hours", "Within a week", "Flexible"],
      },
    ],
  },
  "2": {
    businessName: "Pipe Masters",
    rating: 4.5,
    distance: "3.5 miles",
    bio: "Pipe Masters offers comprehensive plumbing solutions with a focus on quality workmanship and customer satisfaction. Our certified technicians are available 24/7 for emergency services.",
    pictures: ["/professional-plumber.png", "/pipe-repair-work.jpg"],
    formTemplate: [
      {
        id: "q1",
        label: "Type of service needed",
        type: "select",
        options: ["Repair", "Installation", "Maintenance", "Inspection"],
      },
      { id: "q2", label: "Additional details", type: "textarea" },
    ],
  },
}

export default function ProfessionalDetailPage() {
  const router = useRouter()
  const params = useParams()
  const professionalId = params.id as string

  const [userName, setUserName] = useState("")
  const [formData, setFormData] = useState<Record<string, string>>({})

  useEffect(() => {
    const name = sessionStorage.getItem("customerName")
    if (!name) {
      router.push("/customer/login")
    } else {
      setUserName(name)
    }
  }, [router])

  if (!userName) return null

  const professional = MOCK_PROFESSIONAL_DATA[professionalId] || MOCK_PROFESSIONAL_DATA["1"]

  const handleInputChange = (questionId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Check if all required fields are filled
    const allFieldsFilled = professional.formTemplate.every((question: any) => formData[question.id]?.trim())

    if (!allFieldsFilled) {
      return
    }

    // Reset form
    setFormData({})
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back to professionals
        </Button>

        {/* Professional Profile */}
        <Card className="border-2">
          <CardHeader>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-3xl">{professional.businessName}</CardTitle>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-amber-600">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold text-base">{professional.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{professional.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">{professional.bio}</p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {professional.pictures.map((pic: string, idx: number) => (
                <div key={idx} className="aspect-video bg-muted rounded-lg overflow-hidden">
                  <img
                    src={pic || "/placeholder.svg"}
                    alt={`${professional.businessName} work ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inquiry Form */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle>Send an Inquiry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {professional.formTemplate.map((question: any) => (
                <div key={question.id} className="space-y-2">
                  <Label htmlFor={question.id}>{question.label}</Label>
                  {question.type === "text" && (
                    <Input
                      id={question.id}
                      type="text"
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                      className="h-11"
                    />
                  )}
                  {question.type === "textarea" && (
                    <Textarea
                      id={question.id}
                      value={formData[question.id] || ""}
                      onChange={(e) => handleInputChange(question.id, e.target.value)}
                      required
                      rows={4}
                      className="resize-none"
                    />
                  )}
                  {question.type === "select" && (
                    <Select
                      value={formData[question.id] || ""}
                      onValueChange={(value) => handleInputChange(question.id, value)}
                      required
                    >
                      <SelectTrigger id={question.id} className="h-11">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {question.options?.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              <Button type="submit" size="lg" className="w-full gap-2">
                <Send className="w-4 h-4" />
                Send Inquiry
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
