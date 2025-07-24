"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { usePathname, useRouter } from "next/navigation"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error(error.message)
    } else {
      toast.success("Signed out successfully!")
      router.push("/auth")
    }
  }

  const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/members", label: "Members" },
    { href: "/forms", label: "Forms" },
    { href: "/records", label: "Records" },
  ]

  return (
    <nav className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">
        Shepherd Connect
      </Link>
      <div className="flex items-center space-x-4">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline ${pathname === link.href ? "font-semibold" : ""}`}
          >
            {link.label}
          </Link>
        ))}
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user.user_metadata.avatar_url || "/placeholder.svg?height=32&width=32&query=user avatar"}
                    alt={user.email || "User"}
                  />
                  <AvatarFallback>{user.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="text-sm font-medium">{user.email}</div>
                <div className="text-xs text-muted-foreground">{user.user_metadata.full_name || "User"}</div>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/auth">
            <Button variant="secondary">Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
