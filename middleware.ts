import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/types/supabase"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Define public paths that don't require authentication
  const publicPaths = ["/auth"]

  // If there is no session and the path is not public, redirect to auth
  if (!session && !publicPaths.includes(req.nextUrl.pathname)) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/auth"
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If there is a session and the path is auth, redirect to dashboard
  if (session && req.nextUrl.pathname === "/auth") {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/"
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ["/", "/members", "/forms", "/records", "/auth"],
}
