"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react"
import { AppHeader } from "@/components/app-header"

type FormQuestion = {
  id: string
  label: string
  type: "text" | "textarea" | "select"
  options?: string[]
}

export default function ProfileEditorPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessCategory, setBusinessCategory] = useState("plumbing")
  const [bio, setBio] = useState(
    "With over 15 years of experience, we provide reliable and professional services. We specialize in emergency repairs, installations, and maintenance for residential and commercial properties.",
  )
  const [formTemplate, setFormTemplate] = useState<FormQuestion[]>([
    {
      id: "q1",
      label: "What is the issue?",
      type: "select",
      options: ["Leaky Faucet", "Clogged Drain", "Broken Pipe", "Water Heater Issue", "Other"],
    },
    { id: "q2", label: "Describe the issue in detail", type: "textarea" },
    { id: "q3", label: "Preferred contact method", type: "select", options: ["Phone", "Email", "Text Message"] },
  ])

  const [editingQuestion, setEditingQuestion] = useState<FormQuestion | null>(null)
  const [showQuestionEditor, setShowQuestionEditor] = useState(false)

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    const business = sessionStorage.getItem("businessName") || "Your Business"
    if (!name) {
      router.push("/professional/login")
    } else {
      setUserName(name)
      setBusinessName(business)
    }
  }, [router])

  if (!userName) return null

  const handleAddQuestion = () => {
    setEditingQuestion({
      id: `q${Date.now()}`,
      label: "",
      type: "text",
      options: [],
    })
    setShowQuestionEditor(true)
  }

  const handleEditQuestion = (question: FormQuestion) => {
    setEditingQuestion({ ...question })
    setShowQuestionEditor(true)
  }

  const handleSaveQuestion = () => {
    if (!editingQuestion?.label.trim()) {
      return
    }

    if (editingQuestion.type === "select" && (!editingQuestion.options || editingQuestion.options.length === 0)) {
      return
    }

    const existingIndex = formTemplate.findIndex((q) => q.id === editingQuestion.id)
    if (existingIndex >= 0) {
      const updated = [...formTemplate]
      updated[existingIndex] = editingQuestion
      setFormTemplate(updated)
    } else {
      setFormTemplate([...formTemplate, editingQuestion])
    }

    setShowQuestionEditor(false)
    setEditingQuestion(null)
  }

  const handleDeleteQuestion = (questionId: string) => {
    setFormTemplate(formTemplate.filter((q) => q.id !== questionId))
  }

  const handleSaveProfile = () => {}

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Back Button */}
          <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/professional/dashboard")}>
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Button>

          {/* Bio Editor */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Business Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessCategory">Business Category</Label>
                <Select value={businessCategory} onValueChange={setBusinessCategory}>
                  <SelectTrigger id="businessCategory" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="roofing">Roofing</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Business Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={6}
                  className="resize-none"
                  placeholder="Tell customers about your business, experience, and services..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Builder */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Inquiry Form</CardTitle>
                <Button onClick={() => router.push("/professional/form-builder")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Customize Form
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <p>Use the Form Builder to customize the inquiry form that customers will see.</p>
                <Button
                  variant="outline"
                  onClick={() => router.push("/professional/form-builder")}
                  className="mt-4 gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Open Form Builder
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question Editor Modal */}
          {showQuestionEditor && editingQuestion && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-lg border-2">
                <CardHeader>
                  <CardTitle>
                    {editingQuestion.id.startsWith("q") && formTemplate.find((q) => q.id === editingQuestion.id)
                      ? "Edit"
                      : "Add"}{" "}
                    Question
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionLabel">Question Label</Label>
                    <Input
                      id="questionLabel"
                      value={editingQuestion.label}
                      onChange={(e) => setEditingQuestion({ ...editingQuestion, label: e.target.value })}
                      placeholder="e.g., What is the issue?"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="questionType">Question Type</Label>
                    <Select
                      value={editingQuestion.type}
                      onValueChange={(value: "text" | "textarea" | "select") =>
                        setEditingQuestion({ ...editingQuestion, type: value, options: value === "select" ? [""] : [] })
                      }
                    >
                      <SelectTrigger id="questionType" className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Short Text</SelectItem>
                        <SelectItem value="textarea">Long Text</SelectItem>
                        <SelectItem value="select">Multiple Choice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {editingQuestion.type === "select" && (
                    <div className="space-y-2">
                      <Label>Options (one per line)</Label>
                      <Textarea
                        value={editingQuestion.options?.join("\n") || ""}
                        onChange={(e) =>
                          setEditingQuestion({
                            ...editingQuestion,
                            options: e.target.value.split("\n").filter((o) => o.trim()),
                          })
                        }
                        rows={4}
                        placeholder="Option 1&#10;Option 2&#10;Option 3"
                        className="resize-none"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <Button onClick={handleSaveQuestion} className="flex-1">
                      Save Question
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowQuestionEditor(false)
                        setEditingQuestion(null)
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Save Button */}
          <Button onClick={handleSaveProfile} size="lg" className="w-full gap-2">
            <Save className="w-4 h-4" />
            Save Profile
          </Button>
        </div>
      </div>
    </>
  )
}
