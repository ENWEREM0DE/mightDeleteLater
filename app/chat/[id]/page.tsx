"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Send, Calendar, Check, X } from "lucide-react"
import { AppointmentProposalModal } from "@/components/appointment-proposal-modal"
import { AppointmentAcceptanceModal } from "@/components/appointment-acceptance-modal"
import { AppHeader } from "@/components/app-header"

type Message = {
  sender: "customer" | "professional"
  senderName: string
  isFormSubmission: boolean
  isAppointmentProposal?: boolean
  appointmentData?: {
    dateTime: string
    status: "pending" | "accepted" | "declined"
    priceInfo?: string
  }
  content: string | Record<string, string>
  timestamp: string
}

// Mock chat data with sender names
const MOCK_CHAT_DATA: Record<string, Message[]> = {
  "101": [
    {
      sender: "customer",
      senderName: "john_s",
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
    {
      sender: "professional",
      senderName: "Pro Plumbers Inc.",
      isFormSubmission: false,
      content: "Thanks for reaching out! I can come take a look tomorrow morning. Does 10 AM work for you?",
      timestamp: "Oct 1, 2025 at 10:15 AM",
    },
    {
      sender: "customer",
      senderName: "john_s",
      isFormSubmission: false,
      content: "That works perfectly! See you then.",
      timestamp: "Oct 1, 2025 at 10:30 AM",
    },
    {
      sender: "customer",
      senderName: "john_s",
      isFormSubmission: false,
      isAppointmentProposal: true,
      appointmentData: {
        dateTime: "October 2, 2025 at 10:00 AM",
        status: "pending",
      },
      content: "Appointment proposed for October 2, 2025 at 10:00 AM",
      timestamp: "Oct 1, 2025 at 10:35 AM",
    },
  ],
  "102": [
    {
      sender: "customer",
      senderName: "sarah_m",
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
      senderName: "mike_t",
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
      senderName: "Pro Plumbers Inc.",
      isFormSubmission: false,
      content: "I can be there in 2 hours. Is that okay?",
      timestamp: "Sep 29, 2025 at 10:15 AM",
    },
    {
      sender: "customer",
      senderName: "mike_t",
      isFormSubmission: false,
      content: "Thanks for the quick response! I'll be available tomorrow afternoon.",
      timestamp: "Sep 29, 2025 at 10:20 AM",
    },
  ],
  "104": [
    {
      sender: "customer",
      senderName: "emily_r",
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
      senderName: "Pro Plumbers Inc.",
      isFormSubmission: false,
      content: "I'll come take a look this afternoon. What's your address?",
      timestamp: "Sep 28, 2025 at 9:00 AM",
    },
    {
      sender: "customer",
      senderName: "emily_r",
      isFormSubmission: false,
      content: "123 Main Street, Apt 4B. Thank you!",
      timestamp: "Sep 28, 2025 at 9:05 AM",
    },
  ],
}

export default function SharedChatPage() {
  const router = useRouter()
  const params = useParams()
  const inquiryId = params.id as string

  const [userType, setUserType] = useState<"customer" | "professional" | null>(null)
  const [userName, setUserName] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [otherPartyName, setOtherPartyName] = useState("")
  const [showProposalModal, setShowProposalModal] = useState(false)
  const [showAcceptanceModal, setShowAcceptanceModal] = useState(false)
  const [selectedAppointmentIndex, setSelectedAppointmentIndex] = useState<number | null>(null)

  useEffect(() => {
    const customerName = sessionStorage.getItem("customerName")
    const professionalName = sessionStorage.getItem("professionalName")

    if (customerName) {
      setUserType("customer")
      setUserName(customerName)
    } else if (professionalName) {
      setUserType("professional")
      setUserName(professionalName)
    } else {
      router.push("/")
      return
    }

    const chatMessages = MOCK_CHAT_DATA[inquiryId] || []
    setMessages(chatMessages)

    if (chatMessages.length > 0) {
      if (customerName) {
        const professionalMessage = chatMessages.find((m) => m.sender === "professional")
        setOtherPartyName(professionalMessage?.senderName || "Professional")
      } else if (professionalName) {
        const customerMessage = chatMessages.find((m) => m.sender === "customer")
        setOtherPartyName(customerMessage?.senderName || "Customer")
      }
    }
  }, [router, inquiryId])

  if (!userType || !userName) return null

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: Message = {
      sender: userType,
      senderName: userName,
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

  const handleAppointmentProposal = (dateTime: Date) => {
    const message: Message = {
      sender: userType,
      senderName: userName,
      isFormSubmission: false,
      isAppointmentProposal: true,
      appointmentData: {
        dateTime: dateTime.toLocaleString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "pending",
      },
      content: `Appointment proposed for ${dateTime.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}`,
      timestamp: new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
    }

    setMessages([...messages, message])
  }

  const handleAcceptAppointment = (data: { price?: { min: number; max: number }; notes?: string }) => {
    if (selectedAppointmentIndex === null) return

    const updatedMessages = [...messages]
    const appointmentMessage = updatedMessages[selectedAppointmentIndex]

    if (appointmentMessage.appointmentData) {
      appointmentMessage.appointmentData.status = "accepted"
      appointmentMessage.appointmentData.priceInfo = data.notes
        ? data.notes
        : `$${data.price?.min} - $${data.price?.max}`
    }

    setMessages(updatedMessages)
    setSelectedAppointmentIndex(null)
  }

  const handleDeclineAppointment = (index: number) => {
    const updatedMessages = [...messages]
    const appointmentMessage = updatedMessages[index]

    if (appointmentMessage.appointmentData) {
      appointmentMessage.appointmentData.status = "declined"
    }

    setMessages(updatedMessages)
  }

  const backUrl = userType === "customer" ? "/customer/inquiries" : "/professional/dashboard"

  return (
    <>
      <AppHeader />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          {/* Back Button */}
          <Button variant="ghost" className="gap-2 -ml-2" onClick={() => router.push(backUrl)}>
            <ArrowLeft className="w-4 h-4" />
            Back to {userType === "customer" ? "inquiries" : "dashboard"}
          </Button>

          {/* Chat Card */}
          <Card className="border-2">
            <CardHeader className="border-b">
              <CardTitle>Conversation with {otherPartyName}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.sender === userType ? "justify-end" : "justify-start"}`}>
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
                      ) : message.isAppointmentProposal ? (
                        <Card className="bg-primary/10 border-2 border-primary/30">
                          <CardContent className="p-4 space-y-3">
                            <div className="flex items-center gap-2 font-semibold text-sm text-primary">
                              <Calendar className="w-4 h-4" />
                              {message.sender === userType ? "Appointment Request Sent" : "Appointment Pending"}
                            </div>
                            <div className="text-base font-medium">{message.appointmentData?.dateTime}</div>
                            {message.appointmentData?.status === "pending" && message.sender === userType && (
                              <div className="text-sm text-muted-foreground">
                                Waiting for professional to respond...
                              </div>
                            )}
                            {message.appointmentData?.status === "pending" && message.sender !== userType && (
                              <div className="flex gap-2 pt-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedAppointmentIndex(index)
                                    setShowAcceptanceModal(true)
                                  }}
                                  className="gap-1"
                                >
                                  <Check className="w-4 h-4" />
                                  Accept
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeclineAppointment(index)}
                                  className="gap-1"
                                >
                                  <X className="w-4 h-4" />
                                  Decline
                                </Button>
                              </div>
                            )}
                            {message.appointmentData?.status === "accepted" && (
                              <div className="space-y-2 pt-2">
                                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                                  ✓ Appointment Accepted
                                </div>
                                {message.appointmentData.priceInfo && (
                                  <div className="text-sm text-muted-foreground">
                                    Estimated Cost: {message.appointmentData.priceInfo}
                                  </div>
                                )}
                              </div>
                            )}
                            {message.appointmentData?.status === "declined" && (
                              <div className="text-sm font-medium text-red-600 dark:text-red-400 pt-2">
                                ✗ Appointment Declined
                              </div>
                            )}
                            <div className="text-xs text-muted-foreground pt-2">{message.timestamp}</div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div
                          className={`rounded-2xl px-4 py-3 ${
                            message.sender === userType
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content as string}</p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === userType ? "text-primary-foreground/70" : "text-muted-foreground"
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
                  {userType === "customer" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setShowProposalModal(true)}
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Propose Appointment
                    </Button>
                  )}
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

        {/* Appointment Modals */}
        <AppointmentProposalModal
          open={showProposalModal}
          onClose={() => setShowProposalModal(false)}
          onSubmit={handleAppointmentProposal}
        />
        <AppointmentAcceptanceModal
          open={showAcceptanceModal}
          onClose={() => setShowAcceptanceModal(false)}
          onSubmit={handleAcceptAppointment}
        />
      </div>
    </>
  )
}
