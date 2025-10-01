"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ProfessionalDashboard() {
  const router = useRouter()

  useEffect(() => {
    router.push("/professional/home")
  }, [router])

  return null
}
