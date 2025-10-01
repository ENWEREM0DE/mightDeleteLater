"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Wrench } from "lucide-react"

const CATEGORIES = [
  "Plumbing services",
  "Electrical services",
  "Cleaning Services",
  "Moving services",
  "Tutoring services",
]

export default function ProfessionalLoginPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [category, setCategory] = useState("")
  const [isNewUser, setIsNewUser] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim() && (!isNewUser || (businessName.trim() && category))) {
      // Store professional data in sessionStorage for demo purposes
      sessionStorage.setItem("professionalName", userName)
      if (isNewUser) {
        sessionStorage.setItem("businessName", businessName)
        sessionStorage.setItem("category", category)
      }
      router.push("/professional/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="border-2">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-accent rounded-lg p-2">
                <Wrench className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Professional Sign-In</CardTitle>
            </div>
            <CardDescription>
              {isNewUser ? "Create your professional profile" : "Sign in to manage your inquiries"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="userName">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {isNewUser && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category" className="h-11">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full h-11" size="lg">
                {isNewUser ? "Create Account" : "Sign In"}
              </Button>

              <Button type="button" variant="ghost" className="w-full" onClick={() => setIsNewUser(!isNewUser)}>
                {isNewUser ? "Already have an account? Sign in" : "New professional? Sign up"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
