"use client"

import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient<Database>()
  const { toast } = useToast()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.unsubscribe()
    }
  }, [supabase.auth])

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast({
        title: "Sign Out Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Signed Out",
        description: "You have successfully signed out.",
      })
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
                  <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
                  <AvatarFallback>{user.email ? user.email[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.email}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
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
