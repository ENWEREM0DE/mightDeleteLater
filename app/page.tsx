import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Wrench, Home } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Logo and Tagline */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-primary rounded-xl p-3">
              <Home className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold text-foreground">WMNM</h1>
          </div>
          <p className="text-xl text-muted-foreground text-balance">Your Connection to Trusted Home Services</p>
        </div>

        {/* Call to Action Buttons */}
        <div className="grid md:grid-cols-2 gap-6 pt-8">
          <Link href="/customer/login" className="block">
            <Button size="lg" className="w-full h-auto py-8 text-lg flex flex-col gap-3 bg-primary hover:bg-primary/90">
              <Home className="w-8 h-8" />
              <span className="font-semibold">Find a Professional</span>
              <span className="text-sm font-normal opacity-90">Get matched with trusted service providers</span>
            </Button>
          </Link>

          <Link href="/professional/login" className="block">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-auto py-8 text-lg flex flex-col gap-3 border-2 hover:bg-accent hover:text-accent-foreground hover:border-accent bg-transparent"
            >
              <Wrench className="w-8 h-8" />
              <span className="font-semibold">I am a Professional</span>
              <span className="text-sm font-normal opacity-75">Connect with customers who need your services</span>
            </Button>
          </Link>
        </div>

        {/* Trust Indicators */}
        <div className="pt-12 grid grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-primary">10k+</div>
            <div className="text-sm text-muted-foreground">Professionals</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">50k+</div>
            <div className="text-sm text-muted-foreground">Jobs Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary">4.8</div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
        </div>
      </div>
    </div>
  )
}
