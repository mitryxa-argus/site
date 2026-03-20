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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      admin_lead_status: {
        Row: {
          created_at: string | null
          final_category: string | null
          final_price: number | null
          final_timeline: string | null
          id: string
          notes: string | null
          session_id: string
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          final_category?: string | null
          final_price?: number | null
          final_timeline?: string | null
          id?: string
          notes?: string | null
          session_id: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          final_category?: string | null
          final_price?: number | null
          final_timeline?: string | null
          id?: string
          notes?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_lead_status_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "discovery_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_usage: {
        Row: {
          client_ip: string
          created_at: string | null
          fingerprint: string | null
          id: string
        }
        Insert: {
          client_ip: string
          created_at?: string | null
          fingerprint?: string | null
          id?: string
        }
        Update: {
          client_ip?: string
          created_at?: string | null
          fingerprint?: string | null
          id?: string
        }
        Relationships: []
      }
      bypass_tokens: {
        Row: {
          created_at: string | null
          id: string
          token: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          token: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          token?: string
          used?: boolean | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean
          code: string
          created_at: string | null
          discount_percent: number
          id: string
          max_uses: number | null
          tool_type: string | null
          uses: number
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string | null
          discount_percent?: number
          id?: string
          max_uses?: number | null
          tool_type?: string | null
          uses?: number
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string | null
          discount_percent?: number
          id?: string
          max_uses?: number | null
          tool_type?: string | null
          uses?: number
        }
        Relationships: []
      }
      discovery_sessions: {
        Row: {
          conversation: Json
          created_at: string
          id: string
          lead_email: string | null
          lead_name: string | null
          phase: string
          pricing_result: Json | null
          report_id: string | null
          research_snapshot: Json | null
          selections: Json
          session_key: string
          updated_at: string
        }
        Insert: {
          conversation?: Json
          created_at?: string
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          phase?: string
          pricing_result?: Json | null
          report_id?: string | null
          research_snapshot?: Json | null
          selections?: Json
          session_key: string
          updated_at?: string
        }
        Update: {
          conversation?: Json
          created_at?: string
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          phase?: string
          pricing_result?: Json | null
          report_id?: string | null
          research_snapshot?: Json | null
          selections?: Json
          session_key?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "discovery_sessions_report_id_fkey"
            columns: ["report_id"]
            isOneToOne: false
            referencedRelation: "tool_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_config: {
        Row: {
          active: boolean
          config_key: string
          config_type: string
          config_value: Json
          id: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean
          config_key: string
          config_type: string
          config_value: Json
          id?: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean
          config_key?: string
          config_type?: string
          config_value?: Json
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      proposals: {
        Row: {
          business_name: string | null
          client_name: string
          created_at: string | null
          expires_at: string | null
          id: string
          proposal_data: Json
          slug: string
          status: Database["public"]["Enums"]["proposal_status"]
          subject: string
        }
        Insert: {
          business_name?: string | null
          client_name: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          proposal_data?: Json
          slug: string
          status?: Database["public"]["Enums"]["proposal_status"]
          subject: string
        }
        Update: {
          business_name?: string | null
          client_name?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          proposal_data?: Json
          slug?: string
          status?: Database["public"]["Enums"]["proposal_status"]
          subject?: string
        }
        Relationships: []
      }
      tool_reports: {
        Row: {
          created_at: string | null
          id: string
          lead_email: string | null
          lead_name: string | null
          metadata: Json | null
          report_markdown: string
          tool_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          metadata?: Json | null
          report_markdown: string
          tool_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_email?: string | null
          lead_name?: string | null
          metadata?: Json | null
          report_markdown?: string
          tool_type?: string
        }
        Relationships: []
      }
      tool_tokens: {
        Row: {
          created_at: string | null
          id: string
          token: string
          tool_type: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          token: string
          tool_type: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          token?: string
          tool_type?: string
          used?: boolean | null
        }
        Relationships: []
      }
      tool_usage: {
        Row: {
          client_ip: string
          created_at: string | null
          fingerprint: string | null
          id: string
          tool_type: string
        }
        Insert: {
          client_ip: string
          created_at?: string | null
          fingerprint?: string | null
          id?: string
          tool_type: string
        }
        Update: {
          client_ip?: string
          created_at?: string | null
          fingerprint?: string | null
          id?: string
          tool_type?: string
        }
        Relationships: []
      }
      used_audit_sessions: {
        Row: {
          created_at: string | null
          id: string
          stripe_session_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_session_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_session_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      lead_status: "new" | "contacted" | "proposal_sent" | "won" | "lost"
      proposal_status: "draft" | "sent" | "accepted" | "declined"
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
      app_role: ["admin", "moderator", "user"],
      lead_status: ["new", "contacted", "proposal_sent", "won", "lost"],
      proposal_status: ["draft", "sent", "accepted", "declined"],
    },
  },
} as const
