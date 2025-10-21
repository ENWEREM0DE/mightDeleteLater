"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wrench, Home, Zap, Sparkles, Truck, Star, Shield, Clock, TrendingUp } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  
  const handleCustomerLogin = () => {
    console.log("Customer login clicked")
    router.push("/customer/login")
  }
  
  const handleProfessionalLogin = () => {
    console.log("Professional login clicked")
    router.push("/professional/login")
  }
  
  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden gradient-hero py-20 px-4">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto text-center space-y-8 animate-fadeIn">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-accent rounded-xl p-4 shadow-glow-accent animate-pulse-glow">
              <Home className="w-12 h-12 text-accent-foreground" />
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-white">WMNM</h1>
          </div>
          
          {/* Tagline */}
          <h2 className="text-2xl md:text-4xl font-bold text-white/95 max-w-3xl mx-auto leading-tight">
            Your <span className="text-accent">Connection</span> to Trusted Home Services
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Connect with verified professionals or grow your business. Fast, reliable, and built for success.
          </p>

          {/* CTA Buttons */}
          <div className="grid md:grid-cols-2 gap-6 pt-8 max-w-3xl mx-auto relative z-10">
            <div 
              onClick={handleCustomerLogin}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleCustomerLogin()}
              className="w-full h-auto py-8 px-6 text-lg flex flex-col gap-3 bg-white text-primary hover:bg-white/90 shadow-lg rounded-lg cursor-pointer transition-all border-2 border-transparent hover:border-primary/20 relative z-10 pointer-events-auto"
              style={{ transform: 'translateZ(0)' }}
            >
              <Home className="w-8 h-8 mx-auto pointer-events-none" />
              <span className="font-semibold text-center pointer-events-none">Find a Professional</span>
              <span className="text-sm font-normal opacity-75 text-center pointer-events-none">Get matched with trusted service providers</span>
            </div>

            <div 
              onClick={handleProfessionalLogin}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleProfessionalLogin()}
              className="w-full h-auto py-8 px-6 text-lg flex flex-col gap-3 border-2 border-white/30 bg-white/10 text-white hover:bg-white hover:text-primary shadow-lg rounded-lg cursor-pointer transition-all backdrop-blur-sm relative z-10 pointer-events-auto"
              style={{ transform: 'translateZ(0)' }}
            >
              <Wrench className="w-8 h-8 mx-auto pointer-events-none" />
              <span className="font-semibold text-center pointer-events-none">I am a Professional</span>
              <span className="text-sm font-normal opacity-75 text-center pointer-events-none">Connect with customers who need your services</span>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="pt-12 grid grid-cols-3 gap-6 text-center stagger-fadeIn">
            <div className="glass rounded-xl p-4">
              <div className="text-4xl font-bold text-accent">10k+</div>
              <div className="text-sm text-white/80">Professionals</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-4xl font-bold text-accent">50k+</div>
              <div className="text-sm text-white/80">Jobs Completed</div>
            </div>
            <div className="glass rounded-xl p-4">
              <div className="text-4xl font-bold text-accent">4.8⭐</div>
              <div className="text-sm text-white/80">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose WMNM?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            The modern platform connecting professionals with customers who need their services
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 stagger-fadeIn">
            <Card className="card-hover border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 gradient-primary rounded-xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Verified Professionals</h3>
                <p className="text-muted-foreground">All professionals are vetted and verified for your peace of mind</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 gradient-accent rounded-xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-bold">Quick Response</h3>
                <p className="text-muted-foreground">Get responses from professionals within hours, not days</p>
              </CardContent>
            </Card>

            <Card className="card-hover border-2">
              <CardContent className="pt-6 text-center space-y-4">
                <div className="mx-auto w-16 h-16 gradient-success rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold">Business Growth</h3>
                <p className="text-muted-foreground">Tools to help professionals grow and manage their business</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 px-4 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Popular Services</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="card-hover category-plumbing border-2 hover:border-[var(--category-color)] transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--category-bg)" }}>
                  <Wrench className="w-7 h-7" style={{ color: "var(--category-color)" }} />
                </div>
                <h3 className="font-bold">Plumbing</h3>
                <p className="text-sm text-muted-foreground">Expert plumbers for all your needs</p>
              </CardContent>
            </Card>

            <Card className="card-hover category-electrical border-2 hover:border-[var(--category-color)] transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--category-bg)" }}>
                  <Zap className="w-7 h-7" style={{ color: "var(--category-color)" }} />
                </div>
                <h3 className="font-bold">Electrical</h3>
                <p className="text-sm text-muted-foreground">Licensed electricians ready to help</p>
              </CardContent>
            </Card>

            <Card className="card-hover category-cleaning border-2 hover:border-[var(--category-color)] transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--category-bg)" }}>
                  <Sparkles className="w-7 h-7" style={{ color: "var(--category-color)" }} />
                </div>
                <h3 className="font-bold">Cleaning</h3>
                <p className="text-sm text-muted-foreground">Professional cleaning services</p>
              </CardContent>
            </Card>

            <Card className="card-hover category-moving border-2 hover:border-[var(--category-color)] transition-colors">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "var(--category-bg)" }}>
                  <Truck className="w-7 h-7" style={{ color: "var(--category-color)" }} />
                </div>
                <h3 className="font-bold">Moving</h3>
                <p className="text-sm text-muted-foreground">Reliable moving and relocation</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="gradient-card border-2 border-primary/20 shadow-glow">
            <CardContent className="pt-12 pb-12 space-y-6">
              <Star className="w-16 h-16 mx-auto text-accent" />
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of satisfied customers and professionals on WMNM today
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <div 
                  onClick={handleCustomerLogin}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomerLogin()}
                  className="px-8 py-3 text-lg gradient-primary text-white shadow-lg rounded-lg cursor-pointer font-semibold text-center relative z-10 pointer-events-auto hover:scale-105 transition-transform"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Find Services
                </div>
                <div 
                  onClick={handleProfessionalLogin}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleProfessionalLogin()}
                  className="px-8 py-3 text-lg border-2 border-border rounded-lg cursor-pointer font-semibold bg-background hover:bg-secondary transition-colors text-center relative z-10 pointer-events-auto hover:scale-105"
                  style={{ transform: 'translateZ(0)' }}
                >
                  Become a Professional
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
