export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      communication_groups: {
        Row: {
          created_at: string
          description: string | null
          group_type: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_type?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_type?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donation_date: string
          donation_type: string | null
          fund_designation: string | null
          id: string
          member_id: string | null
          notes: string | null
          payment_method: string | null
          receipt_number: string | null
          tax_deductible: boolean | null
        }
        Insert: {
          amount: number
          created_at?: string
          donation_date: string
          donation_type?: string | null
          fund_designation?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          tax_deductible?: boolean | null
        }
        Update: {
          amount?: number
          created_at?: string
          donation_date?: string
          donation_type?: string | null
          fund_designation?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_method?: string | null
          receipt_number?: string | null
          tax_deductible?: boolean | null
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
          attended: boolean | null
          created_at: string
          event_id: string | null
          id: string
          member_id: string | null
          notes: string | null
          payment_amount: number | null
          payment_status: string | null
          registration_date: string
        }
        Insert: {
          attended?: boolean | null
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          registration_date: string
        }
        Update: {
          attended?: boolean | null
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          notes?: string | null
          payment_amount?: number | null
          payment_status?: string | null
          registration_date?: string
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
      events: {
        Row: {
          created_at: string
          description: string | null
          end_time: string | null
          event_date: string
          id: string
          location: string | null
          max_attendees: number | null
          ministry_id: string | null
          registration_deadline: string | null
          registration_required: boolean | null
          start_time: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          ministry_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: string
          location?: string | null
          max_attendees?: number | null
          ministry_id?: string | null
          registration_deadline?: string | null
          registration_required?: boolean | null
          start_time?: string | null
          title?: string
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
      family_relationships: {
        Row: {
          created_at: string
          id: string
          member_id: string | null
          related_member_id: string | null
          relationship_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          member_id?: string | null
          related_member_id?: string | null
          relationship_type: string
        }
        Update: {
          created_at?: string
          id?: string
          member_id?: string | null
          related_member_id?: string | null
          relationship_type?: string
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
          created_at: string
          group_id: string | null
          id: string
          joined_date: string | null
          member_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          joined_date?: string | null
          member_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          joined_date?: string | null
          member_id?: string | null
          role?: string | null
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
      members: {
        Row: {
          address: string | null
          baptism_date: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          email: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          join_date: string | null
          last_name: string
          marital_status: string | null
          membership_status: string | null
          notes: string | null
          phone: string | null
          state: string | null
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          baptism_date?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id?: string
          join_date?: string | null
          last_name: string
          marital_status?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          baptism_date?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          join_date?: string | null
          last_name?: string
          marital_status?: string | null
          membership_status?: string | null
          notes?: string | null
          phone?: string | null
          state?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          leader_id: string | null
          meeting_day: string | null
          meeting_location: string | null
          meeting_time: string | null
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          leader_id?: string | null
          meeting_day?: string | null
          meeting_location?: string | null
          meeting_time?: string | null
          name?: string
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
          user_id?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          id: string
          is_published: boolean | null
          notes: string | null
          scripture_references: string | null
          series_name: string | null
          sermon_date: string | null
          speaker: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          notes?: string | null
          scripture_references?: string | null
          series_name?: string | null
          sermon_date?: string | null
          speaker?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean | null
          notes?: string | null
          scripture_references?: string | null
          series_name?: string | null
          sermon_date?: string | null
          speaker?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      volunteer_assignments: {
        Row: {
          assignment_date: string
          created_at: string
          end_date: string | null
          id: string
          notes: string | null
          start_date: string | null
          status: string | null
          volunteer_id: string | null
          volunteer_role_id: string | null
        }
        Insert: {
          assignment_date: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          volunteer_id?: string | null
          volunteer_role_id?: string | null
        }
        Update: {
          assignment_date?: string
          created_at?: string
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string | null
          status?: string | null
          volunteer_id?: string | null
          volunteer_role_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_assignments_volunteer_id_fkey"
            columns: ["volunteer_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteer_assignments_volunteer_role_id_fkey"
            columns: ["volunteer_role_id"]
            isOneToOne: false
            referencedRelation: "volunteer_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          requirements: string | null
          role_name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          requirements?: string | null
          role_name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          requirements?: string | null
          role_name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
