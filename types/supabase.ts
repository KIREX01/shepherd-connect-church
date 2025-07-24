export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          event_id: string
          id: string
          member_id: string
          timestamp: string
        }
        Insert: {
          event_id: string
          id?: string
          member_id: string
          timestamp?: string
        }
        Update: {
          event_id?: string
          id?: string
          member_id?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          date: string
          id: string
          member_id: string | null
          notes: string | null
          type: string
        }
        Insert: {
          amount: number
          date?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          type: string
        }
        Update: {
          amount?: number
          date?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          type?: string
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
      events: {
        Row: {
          date: string
          description: string | null
          id: string
          location: string
          name: string
          time: string
        }
        Insert: {
          date: string
          description?: string | null
          id?: string
          location: string
          name: string
          time: string
        }
        Update: {
          date?: string
          description?: string | null
          id?: string
          location?: string
          name?: string
          time?: string
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          role: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ministries: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      registrations: {
        Row: {
          event_id: string
          id: string
          member_id: string
          registration_date: string
        }
        Insert: {
          event_id: string
          id?: string
          member_id: string
          registration_date?: string
        }
        Update: {
          event_id?: string
          id?: string
          member_id?: string
          registration_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "registrations_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          date: string
          id: string
          speaker: string
          title: string
          url: string | null
        }
        Insert: {
          date?: string
          id?: string
          speaker: string
          title: string
          url?: string | null
        }
        Update: {
          date?: string
          id?: string
          speaker?: string
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          event_id: string
          id: string
          member_id: string
          role: string
        }
        Insert: {
          event_id: string
          id?: string
          member_id: string
          role: string
        }
        Update: {
          event_id?: string
          id?: string
          member_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "volunteers_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "volunteers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]] & {
      Tables: {
        [K in keyof (Database[PublicTableNameOrOptions["schema"]] &
          PublicSchema["Tables"])["Tables"]]: (Database[PublicTableNameOrOptions["schema"]] &
          PublicSchema["Tables"])["Tables"][K] extends {
          Row: infer R
        }
          ? R
          : never
      }
      Views: {
        [K in keyof (Database[PublicTableNameOrOptions["schema"]] &
          PublicSchema["Views"])["Views"]]: (Database[PublicTableNameOrOptions["schema"]] &
          PublicSchema["Views"])["Views"][K] extends {
          Row: infer R
        }
          ? R
          : never
      }
    })[keyof (Database[PublicTableNameOrOptions["schema"]] & PublicSchema["Tables"])]
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database }> =
  PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][Extract<
        keyof Database[PublicTableNameOrOptions["schema"]]["Tables"],
        PublicTableNameOrOptions["table"]
      >]["Insert"]
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions]["Insert"]
      : never

export type TablesUpdate<PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database }> =
  PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][Extract<
        keyof Database[PublicTableNameOrOptions["schema"]]["Tables"],
        PublicTableNameOrOptions["table"]
      >]["Update"]
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
      ? PublicSchema["Tables"][PublicTableNameOrOptions]["Update"]
      : never

export type Enums<PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database }> =
  PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][Extract<
        keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"],
        PublicEnumNameOrOptions["enum"]
      >]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
      ? PublicSchema["Enums"][PublicEnumNameOrOptions]
      : never
