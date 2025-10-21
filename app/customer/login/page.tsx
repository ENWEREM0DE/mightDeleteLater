"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Home } from "lucide-react"

export default function CustomerLoginPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userName.trim()) {
      // Store username in sessionStorage for demo purposes
      sessionStorage.setItem("customerName", userName)
      router.push("/customer/dashboard")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors hover-lift"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="border-2 card-hover shadow-lg">
          <CardHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="gradient-primary rounded-xl p-3 shadow-glow">
                <Home className="w-7 h-7 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">Customer Sign-In</CardTitle>
            </div>
            <CardDescription className="text-base">Enter your username to find trusted professionals</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="userName" className="text-base font-medium">Username</Label>
                <Input
                  id="userName"
                  type="text"
                  placeholder="Enter your username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  className="h-12 border-2 focus:border-primary transition-all"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 gradient-primary text-white btn-scale shadow-lg text-lg font-semibold" 
                size="lg"
              >
                Continue
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Looking to offer services?{" "}
                <Link href="/professional/login" className="text-primary font-medium hover:underline">
                  Sign in as Professional
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
