export interface User {
  id: string
  email: string
  name: string
  role: "super_admin" | "admin" | "user"
  roles: string[]
  createdAt: string
}

export interface App {
  id: string
  name: string
  slug: string
  description: string
  color: string
  status: "active" | "inactive"
}

// Mock users database
export const MOCK_USERS: User[] = [
  {
    id: "1",
    email: "alex@alexalaniz.com",
    name: "Alex Alaniz",
    role: "super_admin",
    roles: ["solebrew", "chimpanion", "admin"],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    roles: ["solebrew", "chimpanion"],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: "user@company.com",
    name: "Regular User",
    role: "user",
    roles: ["solebrew"],
    createdAt: "2024-01-01T00:00:00Z",
  },
]

// Mock apps database
export const MOCK_APPS: App[] = [
  {
    id: "1",
    name: "SoleBrew",
    slug: "solebrew",
    description: "Coffee shop management platform",
    color: "#f59e0b",
    status: "active",
  },
  {
    id: "2",
    name: "Chimpanion",
    slug: "chimpanion",
    description: "Security and intelligence platform",
    color: "#10b981",
    status: "active",
  },
]

export const authenticateUser = async (email: string): Promise<User | null> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = MOCK_USERS.find((u) => u.email === email)
  return user || null
}

export const getUserApps = (user: User): App[] => {
  return MOCK_APPS.filter((app) => user.roles.includes(app.slug))
}
