"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { 
  HelpCircle,
  MessageSquare,
  FileText,
  Book,
  ExternalLink,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Globe,
  Github,
  Youtube,
  FileQuestion,
  Bug,
  Lightbulb,
  Shield
} from "lucide-react"

interface Ticket {
  id: string
  subject: string
  category: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  created: string
  lastUpdated: string
  requester: string
}

export default function SupportCenter() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "general",
    priority: "medium",
    description: ""
  })

  // Mock support tickets
  const [tickets] = useState<Ticket[]>([
    {
      id: "SUP-001",
      subject: "Cannot access SoleBrew dashboard",
      category: "technical",
      status: "open",
      priority: "high",
      created: "2 hours ago",
      lastUpdated: "1 hour ago",
      requester: "john.doe@example.com"
    },
    {
      id: "SUP-002",
      subject: "How to add team members?",
      category: "general",
      status: "resolved",
      priority: "medium",
      created: "1 day ago",
      lastUpdated: "6 hours ago",
      requester: "jane.smith@example.com"
    },
    {
      id: "SUP-003",
      subject: "Privy authentication not working",
      category: "bug",
      status: "in_progress",
      priority: "urgent",
      created: "3 hours ago",
      lastUpdated: "30 minutes ago",
      requester: "admin@company.com"
    }
  ])

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.description) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // In production, submit ticket via API
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert("Support ticket submitted successfully! We'll respond within 24 hours.")
      setTicketForm({ subject: "", category: "general", priority: "medium", description: "" })
    } catch (error) {
      alert("Failed to submit ticket")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Open</Badge>
      case "in_progress":
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">In Progress</Badge>
      case "resolved":
        return <Badge variant="default" className="bg-green-100 text-green-800">Resolved</Badge>
      case "closed":
        return <Badge variant="secondary">Closed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>
      case "high":
        return <Badge variant="default" className="bg-orange-100 text-orange-800">High</Badge>
      case "medium":
        return <Badge variant="default" className="bg-blue-100 text-blue-800">Medium</Badge>
      case "low":
        return <Badge variant="secondary">Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Support Center</h1>
          <p className="text-muted-foreground">Get help, submit tickets, and access documentation</p>
        </div>
        <Button variant="outline" onClick={() => window.open('https://docs.bearified.com', '_blank')}>
          <Book className="mr-2 h-4 w-4" />
          Documentation
          <ExternalLink className="ml-1 h-3 w-3" />
        </Button>
      </div>

      {/* Quick Help Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('https://docs.bearified.com/getting-started', '_blank')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Book className="mr-2 h-4 w-4" />
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">New to Bearified Apps? Start here</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('https://docs.bearified.com/faq', '_blank')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <FileQuestion className="mr-2 h-4 w-4" />
              FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Frequently asked questions</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('https://github.com/bearified/apps/issues', '_blank')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Bug className="mr-2 h-4 w-4" />
              Report Bug
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Found a bug? Let us know</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => window.open('https://bearified.com/feedback', '_blank')}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center">
              <Lightbulb className="mr-2 h-4 w-4" />
              Feature Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Suggest new features</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tickets">Support Tickets</TabsTrigger>
          <TabsTrigger value="submit">Submit Ticket</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="contact">Contact Info</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Support Tickets</CardTitle>
              <CardDescription>Track and manage your support requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-mono">{ticket.id}</TableCell>
                      <TableCell className="max-w-[250px] truncate">{ticket.subject}</TableCell>
                      <TableCell className="capitalize">{ticket.category}</TableCell>
                      <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                      <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                      <TableCell className="text-muted-foreground">{ticket.created}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submit a Support Ticket</CardTitle>
              <CardDescription>Get help from our support team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                    placeholder="Brief description of your issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={ticketForm.category}
                    onValueChange={(value) => setTicketForm({ ...ticketForm, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="technical">Technical Issue</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="billing">Billing</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={ticketForm.priority}
                  onValueChange={(value) => setTicketForm({ ...ticketForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General inquiry</SelectItem>
                    <SelectItem value="medium">Medium - Some impact on work</SelectItem>
                    <SelectItem value="high">High - Significant impact</SelectItem>
                    <SelectItem value="urgent">Urgent - Critical issue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  placeholder="Please provide detailed information about your issue..."
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  Include steps to reproduce, error messages, and any relevant details
                </p>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Response Time</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      We typically respond within 24 hours. Urgent issues are prioritized and may receive faster response.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setTicketForm({ subject: "", category: "general", priority: "medium", description: "" })}>
                  Clear
                </Button>
                <Button onClick={handleSubmitTicket} disabled={loading}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Documentation</CardTitle>
                <CardDescription>Comprehensive guides and API references</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <Book className="h-5 w-5 text-muted-foreground" />
                      <span>Getting Started Guide</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>API Documentation</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <span>Security Best Practices</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Resources</CardTitle>
                <CardDescription>Connect with other users and developers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <Github className="h-5 w-5 text-muted-foreground" />
                      <span>GitHub Repository</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <span>Discord Community</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href="#" className="flex items-center justify-between p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="flex items-center space-x-3">
                      <Youtube className="h-5 w-5 text-muted-foreground" />
                      <span>Video Tutorials</span>
                    </div>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Get in touch with our team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@bearified.com</p>
                      <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-xs text-muted-foreground mt-1">Mon-Fri 9AM-5PM PST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Website</p>
                      <a href="https://bearified.com" className="text-sm text-blue-600 hover:underline">
                        bearified.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Office Hours</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 5:00 PM PST</p>
                      <p>Saturday - Sunday: Closed</p>
                      <p>Holidays: Limited support via email</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Emergency Support</h4>
                    <p className="text-sm text-muted-foreground">
                      For critical production issues affecting multiple users, 
                      email <span className="font-mono">urgent@bearified.com</span>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}