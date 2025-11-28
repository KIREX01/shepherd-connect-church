export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      announcements: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_pinned: boolean
          priority: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          priority?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_pinned?: boolean
          priority?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      attendance_records: {
        Row: {
          adult_count: number
          child_count: number
          created_at: string
          first_time_visitors: number
          id: string
          recorded_by: string
          service_date: string
          service_type: string
          special_notes: string | null
          total_attendance: number
          updated_at: string
          visitor_count: number
        }
        Insert: {
          adult_count?: number
          child_count?: number
          created_at?: string
          first_time_visitors?: number
          id?: string
          recorded_by: string
          service_date: string
          service_type: string
          special_notes?: string | null
          total_attendance: number
          updated_at?: string
          visitor_count?: number
        }
        Update: {
          adult_count?: number
          child_count?: number
          created_at?: string
          first_time_visitors?: number
          id?: string
          recorded_by?: string
          service_date?: string
          service_type?: string
          special_notes?: string | null
          total_attendance?: number
          updated_at?: string
          visitor_count?: number
        }
        Relationships: []
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
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: []
      }
      donation_records: {
        Row: {
          amount: number
          category: string
          check_number: string | null
          created_at: string
          donation_date: string
          donor_email: string | null
          donor_name: string | null
          donor_phone: string | null
          id: string
          is_anonymous: boolean
          is_recurring: boolean
          notes: string | null
          payment_method: string
          recorded_by: string
          tax_deductible: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          check_number?: string | null
          created_at?: string
          donation_date: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          is_recurring?: boolean
          notes?: string | null
          payment_method: string
          recorded_by: string
          tax_deductible?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          check_number?: string | null
          created_at?: string
          donation_date?: string
          donor_email?: string | null
          donor_name?: string | null
          donor_phone?: string | null
          id?: string
          is_anonymous?: boolean
          is_recurring?: boolean
          notes?: string | null
          payment_method?: string
          recorded_by?: string
          tax_deductible?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          event_id: string
          id: string
          notes: string | null
          registration_date: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          notes?: string | null
          registration_date?: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          notes?: string | null
          registration_date?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event_registrations_event"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          category: string
          contact_email: string | null
          contact_person: string | null
          contact_phone: string | null
          cost: number | null
          created_at: string
          created_by: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          is_public: boolean
          location: string | null
          max_attendees: number | null
          notes: string | null
          registration_required: boolean
          requires_childcare: boolean
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          cost?: number | null
          created_at?: string
          created_by: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          is_public?: boolean
          location?: string | null
          max_attendees?: number | null
          notes?: string | null
          registration_required?: boolean
          requires_childcare?: boolean
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          contact_email?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          cost?: number | null
          created_at?: string
          created_by?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          is_public?: boolean
          location?: string | null
          max_attendees?: number | null
          notes?: string | null
          registration_required?: boolean
          requires_childcare?: boolean
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
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
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          is_anonymous: boolean
          is_private: boolean
          is_urgent: boolean
          requester_email: string | null
          requester_name: string | null
          requester_phone: string | null
          status: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          id?: string
          is_anonymous?: boolean
          is_private?: boolean
          is_urgent?: boolean
          requester_email?: string | null
          requester_name?: string | null
          requester_phone?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          is_anonymous?: boolean
          is_private?: boolean
          is_urgent?: boolean
          requester_email?: string | null
          requester_name?: string | null
          requester_phone?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      prayer_responses: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          prayer_request_id: string
          response_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          prayer_request_id: string
          response_type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          prayer_request_id?: string
          response_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_prayer_responses_prayer_request"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
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
      role_audit_log: {
        Row: {
          changed_at: string
          changed_by: string
          id: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role: Database["public"]["Enums"]["app_role"] | null
          reason: string | null
          user_id: string
        }
        Insert: {
          changed_at?: string
          changed_by: string
          id?: string
          new_role: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          id?: string
          new_role?: Database["public"]["Enums"]["app_role"]
          old_role?: Database["public"]["Enums"]["app_role"] | null
          reason?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: number
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
      volunteer_registrations: {
        Row: {
          additional_notes: string | null
          availability: string[]
          background_check_consent: boolean
          created_at: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          experience: string | null
          first_name: string
          id: string
          last_name: string
          ministry_areas: string[]
          phone: string
          skills: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          availability?: string[]
          background_check_consent?: boolean
          created_at?: string
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          experience?: string | null
          first_name: string
          id?: string
          last_name: string
          ministry_areas?: string[]
          phone: string
          skills?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          availability?: string[]
          background_check_consent?: boolean
          created_at?: string
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          experience?: string | null
          first_name?: string
          id?: string
          last_name?: string
          ministry_areas?: string[]
          phone?: string
          skills?: string | null
          updated_at?: string
        }
        Relationships: []
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
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
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
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
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
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
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
