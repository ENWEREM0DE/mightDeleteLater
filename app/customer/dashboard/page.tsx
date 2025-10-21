"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Zap, Sparkles, Truck, GraduationCap, MessageSquare, Calendar, ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"

const CATEGORIES = [
  { name: "Plumbing services", icon: Wrench, category: "plumbing", description: "Repairs, installations & maintenance" },
  { name: "Electrical services", icon: Zap, category: "electrical", description: "Wiring, fixtures & troubleshooting" },
  { name: "Cleaning Services", icon: Sparkles, category: "cleaning", description: "Home & commercial cleaning" },
  { name: "Moving services", icon: Truck, category: "moving", description: "Relocation & packing services" },
  { name: "Tutoring services", icon: GraduationCap, category: "plumbing", description: "Academic support & guidance" },
]

export default function CustomerDashboard() {
  const router = useRouter()
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

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Header */}
          <div className="animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-2">Hello, {userName}! 👋</h1>
                <p className="text-lg text-muted-foreground">What service are you looking for today?</p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/customer/appointments")} 
                  className="gap-2 hover-lift border-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="hidden sm:inline">Appointments</span>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => router.push("/customer/inquiries")} 
                  className="gap-2 hover-lift border-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">My Inquiries</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 stagger-fadeIn">
            <Card className="gradient-card border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-muted-foreground">Active Pros</div>
                </div>
              </CardContent>
            </Card>
            <Card className="gradient-card border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 text-accent" />
                  <div className="text-2xl font-bold">4.8⭐</div>
                  <div className="text-sm text-muted-foreground">Avg Rating</div>
                </div>
              </CardContent>
            </Card>
            <Card className="gradient-card border-2">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">24hrs</div>
                  <div className="text-sm text-muted-foreground">Response</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Section */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Browse Services</h2>
              <p className="text-muted-foreground">Find the perfect professional for your needs</p>
            </div>
            
            {/* Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-fadeIn">
              {CATEGORIES.map((category, index) => {
                const Icon = category.icon
                return (
                  <Link
                    key={category.name}
                    href={`/customer/professionals?category=${encodeURIComponent(category.name)}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Card className={`h-full border-2 card-hover cursor-pointer group category-${category.category} hover:border-[var(--category-color)]`}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div 
                            className="rounded-2xl p-4 group-hover:scale-110 transition-transform shadow-md" 
                            style={{ backgroundColor: "var(--category-bg)" }}
                          >
                            <Icon className="w-10 h-10" style={{ color: "var(--category-color)" }} />
                          </div>
                          <Badge variant="secondary" className="animate-pulse-glow">
                            Popular
                          </Badge>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-[var(--category-color)] transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                        </div>
                        <div className="flex items-center text-sm font-medium text-primary group-hover:text-[var(--category-color)] transition-colors">
                          Browse professionals
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Featured CTA */}
          <Card className="gradient-primary text-white border-none shadow-glow animate-fadeIn">
            <CardContent className="py-8 px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Need Help Choosing?</h3>
                  <p className="text-white/90">Our support team is here to help you find the right professional</p>
                </div>
                <Button size="lg" variant="secondary" className="btn-scale shadow-lg">
                  Get Assistance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
