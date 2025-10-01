"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Star, MapPin } from "lucide-react"
import { AppHeader } from "@/components/app-header"

// Mock data for professionals
const MOCK_PROFESSIONALS = {
  "Plumbing services": [
    { id: "1", businessName: "Pro Plumbers Inc.", rating: 4.8, distance: "2.1 miles" },
    { id: "2", businessName: "Pipe Masters", rating: 4.5, distance: "3.5 miles" },
    { id: "3", businessName: "Quick Fix Plumbing", rating: 4.9, distance: "1.8 miles" },
    { id: "4", businessName: "Reliable Pipes Co.", rating: 4.6, distance: "4.2 miles" },
  ],
  "Electrical services": [
    { id: "5", businessName: "Bright Spark Electric", rating: 4.7, distance: "2.3 miles" },
    { id: "6", businessName: "Power Pro Electricians", rating: 4.9, distance: "1.5 miles" },
    { id: "7", businessName: "Voltage Experts", rating: 4.4, distance: "3.8 miles" },
  ],
  "Cleaning Services": [
    { id: "8", businessName: "Sparkle Clean Co.", rating: 4.8, distance: "1.2 miles" },
    { id: "9", businessName: "Fresh Start Cleaning", rating: 4.6, distance: "2.7 miles" },
    { id: "10", businessName: "Pristine Home Services", rating: 4.9, distance: "3.1 miles" },
  ],
  "Moving services": [
    { id: "11", businessName: "Swift Movers", rating: 4.5, distance: "2.9 miles" },
    { id: "12", businessName: "Careful Hands Moving", rating: 4.7, distance: "1.6 miles" },
  ],
  "Tutoring services": [
    { id: "13", businessName: "Academic Excellence Tutors", rating: 4.9, distance: "1.9 miles" },
    { id: "14", businessName: "Learn & Grow Education", rating: 4.6, distance: "2.4 miles" },
    { id: "15", businessName: "Bright Minds Tutoring", rating: 4.8, distance: "3.3 miles" },
  ],
}

function ProfessionalsListContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || ""
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("customerName")
    if (!name) {
      router.push("/customer/login")
    } else {
      setUserName(name)
    }
  }, [router])

  if (!userName) return null

  const professionals = MOCK_PROFESSIONALS[category as keyof typeof MOCK_PROFESSIONALS] || []

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <Link href="/customer/dashboard">
              <Button variant="ghost" className="gap-2 -ml-2">
                <ArrowLeft className="w-4 h-4" />
                Back to categories
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground text-balance">{category}</h1>
              <p className="text-muted-foreground mt-1">Showing {professionals.length} professionals near you</p>
            </div>
          </div>

          {/* Professionals List */}
          <div className="space-y-4">
            {professionals.map((pro) => (
              <Link key={pro.id} href={`/customer/professional/${pro.id}?category=${encodeURIComponent(category)}`}>
                <Card className="border-2 hover:border-primary hover:shadow-lg transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <h3 className="text-xl font-semibold text-foreground">{pro.businessName}</h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-amber-600">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{pro.rating}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span>{pro.distance}</span>
                          </div>
                        </div>
                      </div>
                      <Button>View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function ProfessionalsListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfessionalsListContent />
    </Suspense>
  )
}
