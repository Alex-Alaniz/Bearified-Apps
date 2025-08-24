import type React from "react"

export default function GolfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Golf App Development</h1>
        {children}
      </div>
    </div>
  )
}