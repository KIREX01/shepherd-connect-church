"use client"

import { useAuth } from "@/app/providers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Members() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Members Directory</h1>
          <p className="text-gray-600 mt-2">Manage your church members and their information.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>View and manage all church members</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Member management functionality coming soon...</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
