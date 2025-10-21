"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, MoveUp, MoveDown, Save, ArrowLeft, Eye } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { toast } from "sonner"

export type FormField = {
  id: string
  label: string
  type: "text" | "textarea" | "select" | "image"
  options?: string[]
  required: boolean
}

const DEFAULT_FORM_TEMPLATE: FormField[] = [
  {
    id: "q1",
    label: "What is the issue?",
    type: "select",
    options: ["Leaky Faucet", "Clogged Drain", "Broken Pipe", "Water Heater Issue", "Other"],
    required: true,
  },
  { id: "q2", label: "Describe the issue in detail", type: "textarea", required: true },
  { id: "q3", label: "Preferred contact method", type: "select", options: ["Phone", "Email", "Text Message"], required: true },
  {
    id: "q4",
    label: "When do you need service?",
    type: "select",
    options: ["Emergency (ASAP)", "Within 24 hours", "Within a week", "Flexible"],
    required: true,
  },
]

export default function FormBuilderPage() {
  const router = useRouter()
  const [professionalName, setProfessionalName] = useState("")
  const [formTemplate, setFormTemplate] = useState<FormField[]>([])
  const [editingField, setEditingField] = useState<FormField | null>(null)
  const [showAddField, setShowAddField] = useState(false)

  // New field form state
  const [newField, setNewField] = useState<Partial<FormField>>({
    label: "",
    type: "text",
    options: [],
    required: true,
  })
  const [optionInput, setOptionInput] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    if (!name) {
      router.push("/professional/login")
    } else {
      setProfessionalName(name)

      // Load form template from sessionStorage
      const savedTemplate = sessionStorage.getItem("professionalFormTemplate")
      if (savedTemplate) {
        setFormTemplate(JSON.parse(savedTemplate))
      } else {
        setFormTemplate(DEFAULT_FORM_TEMPLATE)
      }
    }
  }, [router])

  if (!professionalName) return null

  const handleSaveTemplate = () => {
    if (formTemplate.length === 0) {
      toast.error("Form must have at least one field")
      return
    }

    sessionStorage.setItem("professionalFormTemplate", JSON.stringify(formTemplate))
    toast.success("Form template saved successfully!")
  }

  const handleAddField = () => {
    if (!newField.label || !newField.type) {
      toast.error("Please fill in all required fields")
      return
    }

    if ((newField.type === "select") && (!newField.options || newField.options.length === 0)) {
      toast.error("Select fields must have at least one option")
      return
    }

    const field: FormField = {
      id: `q${Date.now()}`,
      label: newField.label,
      type: newField.type as "text" | "textarea" | "select" | "image",
      options: newField.options || [],
      required: newField.required || true,
    }

    setFormTemplate([...formTemplate, field])
    setNewField({ label: "", type: "text", options: [], required: true })
    setOptionInput("")
    setShowAddField(false)
    toast.success("Field added successfully!")
  }

  const handleDeleteField = (id: string) => {
    setFormTemplate(formTemplate.filter((f) => f.id !== id))
    toast.success("Field deleted")
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newTemplate = [...formTemplate]
    ;[newTemplate[index - 1], newTemplate[index]] = [newTemplate[index], newTemplate[index - 1]]
    setFormTemplate(newTemplate)
  }

  const handleMoveDown = (index: number) => {
    if (index === formTemplate.length - 1) return
    const newTemplate = [...formTemplate]
    ;[newTemplate[index], newTemplate[index + 1]] = [newTemplate[index + 1], newTemplate[index]]
    setFormTemplate(newTemplate)
  }

  const handleAddOption = () => {
    if (!optionInput.trim()) return
    setNewField({
      ...newField,
      options: [...(newField.options || []), optionInput.trim()],
    })
    setOptionInput("")
  }

  const handleRemoveOption = (index: number) => {
    setNewField({
      ...newField,
      options: newField.options?.filter((_, i) => i !== index) || [],
    })
  }

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/professional/profile")}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Inquiry Form Builder</h1>
                <p className="text-muted-foreground mt-1">Customize the form customers see when sending inquiries</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSaveTemplate} className="gap-2">
                <Save className="w-4 h-4" />
                Save Template
              </Button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-600">
              💡 Design your custom inquiry form. Customers will fill out this form when they want to contact you. You can
              add text fields, dropdowns, text areas, and image uploads.
            </p>
          </div>

          {/* Form Preview */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Form Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formTemplate.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No fields yet. Add fields to build your inquiry form.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formTemplate.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <Label className="text-base">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                          </Label>
                          <Badge variant="outline" className="ml-2">
                            {field.type === "text" && "Text Input"}
                            {field.type === "textarea" && "Text Area"}
                            {field.type === "select" && "Dropdown"}
                            {field.type === "image" && "Image Upload"}
                          </Badge>

                          {/* Preview of field */}
                          <div className="mt-3">
                            {field.type === "text" && (
                              <Input placeholder="Customer will type here..." disabled />
                            )}
                            {field.type === "textarea" && (
                              <textarea
                                className="w-full min-h-[100px] p-2 border rounded-md bg-muted"
                                placeholder="Customer will type here..."
                                disabled
                              />
                            )}
                            {field.type === "select" && (
                              <Select disabled>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select an option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {field.options?.map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                            {field.type === "image" && (
                              <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                                Click to upload image
                              </div>
                            )}
                          </div>

                          {field.type === "select" && field.options && (
                            <div className="mt-2 text-sm text-muted-foreground">
                              Options: {field.options.join(", ")}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <MoveUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === formTemplate.length - 1}
                          >
                            <MoveDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteField(field.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Field Button */}
          {!showAddField && (
            <Button onClick={() => setShowAddField(true)} className="w-full gap-2" variant="outline" size="lg">
              <Plus className="w-5 h-5" />
              Add Field
            </Button>
          )}

          {/* Add Field Form */}
          {showAddField && (
            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Add New Field</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fieldLabel">Field Label *</Label>
                  <Input
                    id="fieldLabel"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="e.g., What service do you need?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fieldType">Field Type *</Label>
                  <Select
                    value={newField.type}
                    onValueChange={(value: "text" | "textarea" | "select" | "image") =>
                      setNewField({ ...newField, type: value, options: value === "select" ? [] : undefined })
                    }
                  >
                    <SelectTrigger id="fieldType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Text Input (short answer)</SelectItem>
                      <SelectItem value="textarea">Text Area (long answer)</SelectItem>
                      <SelectItem value="select">Dropdown (select from options)</SelectItem>
                      <SelectItem value="image">Image Upload</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newField.type === "select" && (
                  <div className="space-y-2">
                    <Label>Options *</Label>
                    <div className="flex gap-2">
                      <Input
                        value={optionInput}
                        onChange={(e) => setOptionInput(e.target.value)}
                        placeholder="Enter option"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddOption()
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddOption} variant="outline">
                        Add
                      </Button>
                    </div>
                    {newField.options && newField.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newField.options.map((option, index) => (
                          <Badge key={index} variant="secondary" className="gap-2">
                            {option}
                            <button
                              type="button"
                              onClick={() => handleRemoveOption(index)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddField(false)
                      setNewField({ label: "", type: "text", options: [], required: true })
                      setOptionInput("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleAddField}>
                    Add Field
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}

