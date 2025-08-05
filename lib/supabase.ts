import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "super_admin"
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface App {
  id: string
  name: string
  slug: string
  description?: string
  icon?: string
  color?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  app_id: string
  role: "user" | "admin" | "owner"
  created_at: string
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return data
}

export async function createUser(userData: {
  email: string
  name: string
  role: "user" | "admin" | "super_admin"
  avatar_url?: string
}): Promise<User | null> {
  const { data, error } = await supabase.from("users").insert([userData]).select().single()

  if (error) {
    console.error("Error creating user:", error)
    return null
  }

  return data
}

export async function getUserRoles(userId: string): Promise<UserRole[]> {
  const { data, error } = await supabase.from("user_roles").select("*").eq("user_id", userId)

  if (error) {
    console.error("Error fetching user roles:", error)
    return []
  }

  return data || []
}

export async function getApps(): Promise<App[]> {
  const { data, error } = await supabase.from("apps").select("*").eq("is_active", true).order("name")

  if (error) {
    console.error("Error fetching apps:", error)
    return []
  }

  return data || []
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

export async function updateUserRole(userId: string, appId: string, role: string): Promise<boolean> {
  const { error } = await supabase.from("user_roles").upsert([{ user_id: userId, app_id: appId, role }])

  if (error) {
    console.error("Error updating user role:", error)
    return false
  }

  return true
}

export async function removeUserRole(userId: string, appId: string): Promise<boolean> {
  const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("app_id", appId)

  if (error) {
    console.error("Error removing user role:", error)
    return false
  }

  return true
}
