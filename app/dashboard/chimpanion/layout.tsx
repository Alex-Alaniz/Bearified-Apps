import type React from "react"

export default function ChimpanionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-purple-600 dark:text-purple-400">Chimpanion</h1>
        {children}
      </div>
    </div>
  )
}
