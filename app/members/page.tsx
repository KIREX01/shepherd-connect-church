import { Navbar } from "@/components/Navbar"
import { MembersTable } from "@/components/MembersTable"

export default function MembersPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <MembersTable />
    </div>
  )
}
