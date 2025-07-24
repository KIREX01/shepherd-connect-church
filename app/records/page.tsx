import { Navbar } from "@/components/Navbar"
import { RecordsManager } from "@/components/RecordsManager"

export default function RecordsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <RecordsManager />
    </div>
  )
}
