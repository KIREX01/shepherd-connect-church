export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      attendance: {
        Row: {
          attended: boolean
          event_id: string
          id: string
          recorded_at: string
          recorded_by: string
          user_id: string
        }
        Insert: {
          attended?: boolean
          event_id: string
          id?: string
          recorded_at?: string
          recorded_by: string
          user_id: string
        }
        Update: {
          attended?: boolean
          event_id?: string
          id?: string
          recorded_at?: string
          recorded_by?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      contributions: {
        Row: {
          amount: number
          contribution_date: string
          contribution_type: string
          created_at: string
          id: string
          notes: string | null
          recorded_by: string
          user_id: string
        }
        Insert: {
          amount: number
          contribution_date?: string
          contribution_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by: string
          user_id: string
        }
        Update: {
          amount?: number
          contribution_date?: string
          contribution_type?: string
          created_at?: string
          id?: string
          notes?: string | null
          recorded_by?: string
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_date: string
          end_date: string | null
          location: string | null
          ministry_id: string | null
          created_by: string
          registration_required: boolean | null
          registration_fee: number | null
          max_attendees: number | null
          is_public: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_date: string
          end_date?: string | null
          location?: string | null
          ministry_id?: string | null
          created_by: string
          registration_required?: boolean | null
          registration_fee?: number | null
          max_attendees?: number | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          event_date?: string
          end_date?: string | null
          location?: string | null
          ministry_id?: string | null
          created_by?: string
          registration_required?: boolean | null
          registration_fee?: number | null
          max_attendees?: number | null
          is_public?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
      member_registrations: {
        Row: {
          address: string
          city: string
          created_at: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          first_name: string
          id: string
          last_name: string
          membership_type: string
          notes: string | null
          phone: string
          recorded_by: string | null
          state: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          address: string
          city: string
          created_at?: string
          date_of_birth: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          first_name: string
          id?: string
          last_name: string
          membership_type: string
          notes?: string | null
          phone: string
          recorded_by?: string | null
          state: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          address?: string
          city?: string
          created_at?: string
          date_of_birth?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          first_name?: string
          id?: string
          last_name?: string
          membership_type?: string
          notes?: string | null
          phone?: string
          recorded_by?: string | null
          state?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          id: string
          profile_id: string | null
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          date_of_birth: string | null
          join_date: string | null
          baptism_date: string | null
          membership_status: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id?: string | null
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          date_of_birth?: string | null
          join_date?: string | null
          baptism_date?: string | null
          membership_status?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string | null
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          date_of_birth?: string | null
          join_date?: string | null
          baptism_date?: string | null
          membership_status?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ministries: {
        Row: {
          id: string
          name: string
          description: string | null
          long_description: string | null
          category: string | null
          leader_id: string | null
          meeting_day: string | null
          meeting_time: string | null
          location: string | null
          contact_email: string | null
          contact_phone: string | null
          website_url: string | null
          image_url: string | null
          social_media: Json | null
          is_active: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          long_description?: string | null
          category?: string | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          location?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website_url?: string | null
          image_url?: string | null
          social_media?: Json | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          long_description?: string | null
          category?: string | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          location?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          website_url?: string | null
          image_url?: string | null
          social_media?: Json | null
          is_active?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministries_leader_id_fkey"
            columns: ["leader_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address: string | null
          created_at: string
          date_of_birth: string | null
          first_name: string | null
          id: string
          last_name: string | null
          membership_date: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          membership_date?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          date_of_birth?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          membership_date?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      communication_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          id: string
          member_id: string
          amount: number
          donation_date: string
          donation_type: string | null
          fund_designation: string | null
          check_number: string | null
          stripe_payment_intent_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          amount: number
          donation_date?: string
          donation_type?: string | null
          fund_designation?: string | null
          check_number?: string | null
          stripe_payment_intent_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          amount?: number
          donation_date?: string
          donation_type?: string | null
          fund_designation?: string | null
          check_number?: string | null
          stripe_payment_intent_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          id: string
          event_id: string
          member_id: string
          registration_date: string
          attended: boolean | null
          payment_status: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          event_id: string
          member_id: string
          registration_date?: string
          attended?: boolean | null
          payment_status?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          event_id?: string
          member_id?: string
          registration_date?: string
          attended?: boolean | null
          payment_status?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relationships: {
        Row: {
          id: string
          member_id: string
          related_member_id: string
          relationship_type: string
          created_at: string
        }
        Insert: {
          id?: string
          member_id: string
          related_member_id: string
          relationship_type: string
          created_at?: string
        }
        Update: {
          id?: string
          member_id?: string
          related_member_id?: string
          relationship_type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_related_member_id_fkey"
            columns: ["related_member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          member_id: string
          joined_date: string
        }
        Insert: {
          id?: string
          group_id: string
          member_id: string
          joined_date?: string
        }
        Update: {
          id?: string
          group_id?: string
          member_id?: string
          joined_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "communication_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          id: string
          title: string
          description: string | null
          speaker: string | null
          sermon_date: string | null
          scripture_reference: string | null
          series_name: string | null
          audio_url: string | null
          video_url: string | null
          tags: string[] | null
          is_published: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          speaker?: string | null
          sermon_date?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          audio_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_published?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          speaker?: string | null
          sermon_date?: string | null
          scripture_reference?: string | null
          series_name?: string | null
          audio_url?: string | null
          video_url?: string | null
          tags?: string[] | null
          is_published?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      volunteer_assignments: {
        Row: {
          id: string
          member_id: string
          role_id: string
          event_id: string | null
          status: string | null
          assigned_date: string
          notes: string | null
        }
        Insert: {
          id?: string
          member_id: string
          role_id: string
          event_id?: string | null
          status?: string | null
          assigned_date?: string
          notes?: string | null
        }
        Update: {
          id?: string
          member_id?: string
          role_id?: string
          event_id?: string | null
          status?: string | null
          assigned_date?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_assignments_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_assignments_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "volunteer_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_assignments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_roles: {
        Row: {
          id: string
          name: string
          description: string | null
          ministry_id: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          ministry_id?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          ministry_id?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_roles_ministry_id_fkey"
            columns: ["ministry_id"]
            isOneToOne: false
            referencedRelation: "ministries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "pastor" | "member"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "pastor", "member"],
    },
  },
} as const
