"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Bot, 
  Shield, 
  Activity, 
  AlertTriangle, 
  Eye, 
  Lock, 
  Wallet, 
  MessageCircle, 
  Smartphone, 
  Globe,
  GitBranch,
  Clock,
  Users,
  CheckCircle,
  Code,
  Database,
  Settings,
  TrendingUp,
  Calendar,
  Star,
  Target,
  Plus,
  Edit,
  Trash2,
  ChevronRight,
  Circle,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

interface Task {
  id: string
  title: string
  description: string
  status: "todo" | "in_progress" | "done" | "blocked"
  assignee: string
  priority?: "low" | "medium" | "high" | "critical"
}

interface Sprint {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  tasks: Task[]
}

export default function ChimpanionPage() {
  const { user, hasRole } = useAuth()
  
  // Initialize with current sprint data
  const [currentSprint, setCurrentSprint] = useState<Sprint>({
    id: "sprint-3",
    name: "Sprint 3: Mobile Beta Expansion",
    description: "Expanding TestFlight beta features and wallet integration",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    tasks: [
      {
        id: "task-1",
        title: "iOS TestFlight Beta Updates",
        description: "Deploy latest features to TestFlight",
        status: "done",
        assignee: "AA",
        priority: "high"
      },
      {
        id: "task-2",
        title: "Multi-chain Wallet Support",
        description: "Add support for additional blockchain networks",
        status: "in_progress",
        assignee: "AS",
        priority: "critical"
      },
      {
        id: "task-3",
        title: "ElizaOS Agent Optimization",
        description: "Improve AI response accuracy and speed",
        status: "todo",
        assignee: "AA",
        priority: "high"
      }
    ]
  })

  const [newTaskDialog, setNewTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [projectProgress, setProjectProgress] = useState(85)
  
  // Form state for new/edit task
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "AA",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"]
  })

  if (!hasRole("chimpanion-admin") && !hasRole("chimpanion-member") && !hasRole("admin") && !hasRole("super_admin")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access Chimpanion.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCreateTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskForm.title,
      description: taskForm.description,
      status: taskForm.status,
      assignee: taskForm.assignee,
      priority: taskForm.priority
    }
    
    setCurrentSprint({
      ...currentSprint,
      tasks: [...currentSprint.tasks, newTask]
    })
    
    // Reset form
    setTaskForm({
      title: "",
      description: "",
      assignee: "AA",
      status: "todo",
      priority: "medium"
    })
    setNewTaskDialog(false)
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setCurrentSprint({
      ...currentSprint,
      tasks: currentSprint.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    })
  }

  const handleDeleteTask = (taskId: string) => {
    setCurrentSprint({
      ...currentSprint,
      tasks: currentSprint.tasks.filter(task => task.id !== taskId)
    })
  }

  const getStatusIcon = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return <Circle className="h-4 w-4 text-gray-400" />
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "blocked":
        return <XCircle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusBadge = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return <Badge variant="outline">To Do</Badge>
      case "in_progress":
        return <Badge variant="default" className="bg-blue-600">In Progress</Badge>
      case "done":
        return <Badge variant="default" className="bg-green-600">Done</Badge>
      case "blocked":
        return <Badge variant="destructive">Blocked</Badge>
    }
  }

  const calculateSprintProgress = () => {
    const done = currentSprint.tasks.filter(t => t.status === "done").length
    return Math.round((done / currentSprint.tasks.length) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Chimpanion Project Hub</h1>
            <p className="text-gray-600">AI-Powered Crypto Wallet Assistant Development</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            Production Phase
          </Badge>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit Progress
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Project Progress</DialogTitle>
                <DialogDescription>
                  Adjust the overall project completion percentage
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Progress: {projectProgress}%</Label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    value={projectProgress}
                    onChange={(e) => setProjectProgress(Number(e.target.value))}
                    className="w-full"
                  />
                  <Progress value={projectProgress} className="w-full" />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={() => {}}>Save Progress</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Production Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-green-800">Chimpanion V1 is Live in Production</h3>
              <p className="text-green-700 text-sm mt-1">
                Blockchain AI companion app helping users manage their wallets in natural language. 
                Available on Vercel web platform and Apple TestFlight beta program.
              </p>
              <div className="flex space-x-4 mt-3">
                <Button size="sm" variant="outline" className="bg-white">
                  <Globe className="mr-2 h-3 w-3" />
                  View Web App
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Smartphone className="mr-2 h-3 w-3" />
                  TestFlight Beta
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectProgress}%</div>
            <p className="text-xs text-muted-foreground">Production Features Complete</p>
            <Progress value={projectProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateSprintProgress()}%</div>
            <p className="text-xs text-muted-foreground">
              {currentSprint.tasks.filter(t => t.status === "done").length} of {currentSprint.tasks.length} tasks complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentSprint.tasks.filter(t => t.status === "in_progress").length}</div>
            <p className="text-xs text-muted-foreground">
              {currentSprint.tasks.filter(t => t.status === "blocked").length} blocked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Status</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">V1 deployed and active</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Sprint & Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sprint */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-purple-600" />
                <div>
                  <CardTitle>{currentSprint.name}</CardTitle>
                  <CardDescription>{currentSprint.description}</CardDescription>
                </div>
              </div>
              <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                      Add a new task to the current sprint
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title</Label>
                      <Input
                        id="title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                        placeholder="Enter task title"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                        placeholder="Describe the task"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="assignee">Assignee</Label>
                        <Select value={taskForm.assignee} onValueChange={(value) => setTaskForm({ ...taskForm, assignee: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="AA">Alex (AA)</SelectItem>
                            <SelectItem value="AS">Anson (AS)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select value={taskForm.priority} onValueChange={(value: Task["priority"]) => setTaskForm({ ...taskForm, priority: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="critical">Critical</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setNewTaskDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask}>Create Task</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {currentSprint.tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <div className="flex items-center space-x-3 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">{task.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">{task.assignee}</AvatarFallback>
                  </Avatar>
                  <Select
                    value={task.status}
                    onValueChange={(value: Task["status"]) => handleUpdateTask(task.id, { status: value })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">To Do</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="done">Done</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tech Stack & Architecture */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-blue-600" />
              <CardTitle>Production Architecture</CardTitle>
            </div>
            <CardDescription>Chimpanion V1 technology stack and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Globe className="h-4 w-4 text-green-600" />
                <span className="text-sm">Vercel</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span className="text-sm">React Native</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Bot className="h-4 w-4 text-purple-600" />
                <span className="text-sm">ElizaOS</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Wallet className="h-4 w-4 text-orange-600" />
                <span className="text-sm">Multi-chain</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Production Status:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Web Platform</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Live</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>iOS TestFlight</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Beta</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>AI Chat System</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">Production</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team & Features Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Development Team</CardTitle>
            <CardDescription>Chimpanion project contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Alaniz</p>
                    <p className="text-sm text-gray-500">Project Lead & Full-Stack Dev</p>
                  </div>
                </div>
                <Badge>Lead</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Anson</p>
                    <p className="text-sm text-gray-500">Developer</p>
                  </div>
                </div>
                <Badge variant="outline">Developer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Production Features */}
        <Card>
          <CardHeader>
            <CardTitle>Production Features</CardTitle>
            <CardDescription>Live Chimpanion V1 capabilities and integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <MessageCircle className="h-4 w-4 mb-1" />
                <span className="text-sm">AI Chat Interface</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Wallet className="h-4 w-4 mb-1" />
                <span className="text-sm">Multi-chain Wallet</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Globe className="h-4 w-4 mb-1" />
                <span className="text-sm">Web Platform</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Smartphone className="h-4 w-4 mb-1" />
                <span className="text-sm">iOS TestFlight</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
