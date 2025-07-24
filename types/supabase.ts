export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          member_id: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
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
          amount: number | null
          created_at: string
          id: string
          member_id: string | null
          notes: string | null
          type: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          type?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          member_id?: string | null
          notes?: string | null
          type?: string | null
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
          created_at: string
          date: string | null
          description: string | null
          id: string
          location: string | null
          name: string | null
          time: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string | null
          time?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          description?: string | null
          id?: string
          location?: string | null
          name?: string | null
          time?: string | null
        }
        Relationships: []
      }
      members: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          role?: string | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          member_id: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          member_id?: string | null
          role?: string | null
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

export type Tables<TableName extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][TableName]["Row"]

export type Enums<EnumName extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][EnumName]
