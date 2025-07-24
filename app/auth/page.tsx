"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import type { Database } from "@/types/supabase"

export default function AuthPage() {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        toast({
          title: "Authentication Successful",
          description: "You have been logged in.",
        })
        router.push("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, toast])

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome to Shepherd Connect</h2>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google", "github"]}
          redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email address",
                password_label: "Your Password",
                email_input_placeholder: "Enter your email address",
                password_input_placeholder: "Enter your password",
                button_label: "Sign In",
                social_provider_text: "Sign in with {{provider}}",
                link_text: "Already have an account? Sign In",
              },
              sign_up: {
                email_label: "Email address",
                password_label: "Create a Password",
                email_input_placeholder: "Enter your email address",
                password_input_placeholder: "Create a password",
                button_label: "Sign Up",
                social_provider_text: "Sign up with {{provider}}",
                link_text: "Don't have an account? Sign Up",
              },
              forgotten_password: {
                email_label: "Email address",
                password_label: "Your Password",
                email_input_placeholder: "Enter your email address",
                button_label: "Send reset password instructions",
                link_text: "Forgot your password?",
              },
              update_password: {
                password_label: "New Password",
                password_input_placeholder: "Enter your new password",
                button_label: "Update Password",
              },
            },
          }}
        />
      </div>
    </div>
  )
}
