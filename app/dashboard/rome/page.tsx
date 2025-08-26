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
  Building,
  GitBranch,
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
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
  XCircle,
  Crown,
  Shield,
  Smartphone,
  Zap
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

export default function RomeProjectDashboard() {
  const { user, hasRole } = useAuth()
  
  // Initialize with current sprint data
  const [currentSprint, setCurrentSprint] = useState<Sprint>({
    id: "sprint-1",
    name: "Sprint 1: Streaming Platform Foundation",
    description: "Building core crypto streaming dashboard infrastructure",
    startDate: "2024-01-15",
    endDate: "2024-01-29",
    tasks: [
      {
        id: "task-1",
        title: "Live Streaming Integration",
        description: "Integrate Twitch/YouTube streaming APIs for real-time feeds",
        status: "done",
        assignee: "RJ",
        priority: "high"
      },
      {
        id: "task-2", 
        title: "Crypto Donation System",
        description: "Build multi-chain crypto donation widget for streams",
        status: "in_progress",
        assignee: "RJ",
        priority: "critical"
      },
      {
        id: "task-3",
        title: "Analytics Dashboard",
        description: "Create real-time viewer analytics and earnings tracking",
        status: "todo",
        assignee: "AA",
        priority: "high"
      },
      {
        id: "task-4",
        title: "Chat Token Integration",
        description: "Implement token-gated chat features for subscribers",
        status: "todo",
        assignee: "RJ",
        priority: "medium"
      }
    ]
  })

  const [newTaskDialog, setNewTaskDialog] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [projectProgress, setProjectProgress] = useState(25)
  
  // Form state for new/edit task
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assignee: "RJ",
    status: "todo" as Task["status"],
    priority: "medium" as Task["priority"]
  })

  if (!hasRole("rome-admin") && !hasRole("rome-member") && !hasRole("admin") && !hasRole("super_admin")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access Rome.</p>
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
      assignee: "RJ",
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

  const calculateSprintProgress = () => {
    const done = currentSprint.tasks.filter(t => t.status === "done").length
    return Math.round((done / currentSprint.tasks.length) * 100)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Rome Crypto Streamer Dashboard</h1>
            <p className="text-gray-600">Professional Crypto Streaming Platform Development</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Development Phase
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

      {/* Project KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectProgress}%</div>
            <p className="text-xs text-muted-foreground">Streaming Features Complete</p>
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
            <CardTitle className="text-sm font-medium">Platform Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8w</div>
            <p className="text-xs text-muted-foreground">Estimated platform launch</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Sprint & Tech Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sprint */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-red-600" />
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
                            <SelectItem value="RJ">RomeJay (RJ)</SelectItem>
                            <SelectItem value="AA">Alex (AA)</SelectItem>
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
              <Code className="h-5 w-5 text-purple-600" />
              <CardTitle>Streaming Architecture</CardTitle>
            </div>
            <CardDescription>Crypto streaming platform technology stack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Smartphone className="h-4 w-4 text-purple-600" />
                <span className="text-sm">Stream APIs</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm">Analytics DB</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Web3 Wallet</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Zap className="h-4 w-4 text-yellow-600" />
                <span className="text-sm">Real-time Chat</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Platform Features:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Stream Integration</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Complete</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Crypto Donations</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Token Chat</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Development Team</CardTitle>
            <CardDescription>Crypto streamer platform contributors</CardDescription>
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
                <Badge>Project Lead</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>RJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">RomeJay</p>
                    <p className="text-sm text-gray-500">Lead Developer & Crypto Expert</p>
                  </div>
                </div>
                <Badge variant="outline">Developer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common streaming platform tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <GitBranch className="h-4 w-4 mb-1" />
                <span className="text-sm">Create Feature Branch</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Code className="h-4 w-4 mb-1" />
                <span className="text-sm">Open Stream IDE</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Database className="h-4 w-4 mb-1" />
                <span className="text-sm">Analytics Console</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Settings className="h-4 w-4 mb-1" />
                <span className="text-sm">Deploy to CDN</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}