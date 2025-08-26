import { Building } from "lucide-react"

export default function RomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center space-x-2">
        <Building className="h-6 w-6 text-red-600" />
        <h2 className="text-3xl font-bold tracking-tight">Rome Crypto Streaming Platform</h2>
      </div>
      {children}
    </div>
  )
}