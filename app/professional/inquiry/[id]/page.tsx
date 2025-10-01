"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send } from "lucide-react"

type Message = {
  sender: "customer" | "professional"
  isFormSubmission: boolean
  content: string | Record<string, string>
  timestamp: string
}

// Mock chat data
const MOCK_CHAT_DATA: Record<string, Message[]> = {
  "101": [
    {
      sender: "customer",
      isFormSubmission: true,
      content: {
        "What is the issue?": "Leaky Faucet",
        "Describe the issue in detail":
          "My kitchen sink has been dripping for the past week. It's getting worse and wasting a lot of water.",
        "Preferred contact method": "Phone",
        "When do you need service?": "Within 24 hours",
      },
      timestamp: "Oct 1, 2025 at 9:30 AM",
    },
  ],
  "102": [
    {
      sender: "customer",
      isFormSubmission: true,
      content: {
        "What is the issue?": "Clogged Drain",
        "Describe the issue in detail": "Bathroom sink is completely clogged. Water won't drain at all.",
        "Preferred contact method": "Email",
        "When do you need service?": "Within a week",
      },
      timestamp: "Sep 30, 2025 at 2:15 PM",
    },
  ],
  "103": [
    {
      sender: "customer",
      isFormSubmission: true,
      content: {
        "What is the issue?": "Broken Pipe",
        "Describe the issue in detail": "Pipe under the sink is leaking badly.",
        "Preferred contact method": "Phone",
        "When do you need service?": "Emergency (ASAP)",
      },
      timestamp: "Sep 29, 2025 at 10:00 AM",
    },
    {
      sender: "professional",
      isFormSubmission: false,
      content: "I can be there in 2 hours. Is that okay?",
      timestamp: "Sep 29, 2025 at 10:15 AM",
    },
    {
      sender: "customer",
      isFormSubmission: false,
      content: "Thanks for the quick response! I'll be available tomorrow afternoon.",
      timestamp: "Sep 29, 2025 at 10:20 AM",
    },
  ],
  "104": [
    {
      sender: "customer",
      isFormSubmission: true,
      content: {
        "What is the issue?": "Water Heater Issue",
        "Describe the issue in detail": "Water heater is making strange noises and not heating properly.",
        "Preferred contact method": "Text Message",
        "When do you need service?": "Emergency (ASAP)",
      },
      timestamp: "Sep 28, 2025 at 8:45 AM",
    },
    {
      sender: "professional",
      isFormSubmission: false,
      content: "I'll come take a look this afternoon. What's your address?",
      timestamp: "Sep 28, 2025 at 9:00 AM",
    },
    {
      sender: "customer",
      isFormSubmission: false,
      content: "123 Main Street, Apt 4B. Thank you!",
      timestamp: "Sep 28, 2025 at 9:05 AM",
    },
  ],
}

export default function InquiryChatPage() {
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string

  const [userName, setUserName] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")

  useEffect(() => {
    const name = sessionStorage.getItem("professionalName")
    if (!name) {
      router.push("/professional/login")
    } else {
      router.push(`/chat/${inquiryId}`)
    }
  }, [router, inquiryId])

  if (!userName) return null

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      sender: "professional",
      isFormSubmission: false,
      content: newMessage,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const customerName =
    inquiryId === "101" ? "john_s" : inquiryId === "102" ? "sarah_m" : inquiryId === "103" ? "mike_t" : "emily_r"

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push("/professional/dashboard")}>
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Button>

        {/* Chat Card */}
        <Card className="border-2">
          <CardHeader className="border-b">
            <CardTitle>Conversation with {customerName}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {/* Messages */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.sender === "professional" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] space-y-2`}>
                    {message.isFormSubmission ? (
                      <Card className="bg-accent/50 border-2">
                        <CardContent className="p-4 space-y-3">
                          <div className="font-semibold text-sm text-muted-foreground">Initial Inquiry Form</div>
                          {Object.entries(message.content as Record<string, string>).map(([question, answer]) => (
                            <div key={question} className="space-y-1">
                              <div className="text-sm font-medium text-foreground">{question}</div>
                              <div className="text-sm text-muted-foreground">{answer}</div>
                            </div>
                          ))}
                          <div className="text-xs text-muted-foreground pt-2">{message.timestamp}</div>
                        </CardContent>
                      </Card>
                    ) : (
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === "professional"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content as string}</p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === "professional" ? "text-primary-foreground/70" : "text-muted-foreground"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-muted/30">
              <div className="flex gap-3">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="resize-none flex-1"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <Button type="submit" size="lg" className="gap-2 self-end">
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
