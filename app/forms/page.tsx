"use client"

import { useAuth } from "@/app/providers"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Forms() {
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
          <h1 className="text-3xl font-bold text-gray-900">Church Forms</h1>
          <p className="text-gray-600 mt-2">Access all church management forms in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Member Registration</CardTitle>
              <CardDescription>Register new church members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Add new members to the church directory.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Creation</CardTitle>
              <CardDescription>Create and schedule church events</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Plan and organize church activities and events.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Entry</CardTitle>
              <CardDescription>Record donations and offerings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track financial contributions to the church.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ministry Creation</CardTitle>
              <CardDescription>Create new ministry groups</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Organize and manage church ministries.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Volunteer Registration</CardTitle>
              <CardDescription>Sign up volunteers for activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Coordinate volunteer participation in church events.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Entry</CardTitle>
              <CardDescription>Record service attendance</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Track attendance for services and events.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
