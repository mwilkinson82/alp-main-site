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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      advisory_applications: {
        Row: {
          already_tried: string
          annual_revenue: string
          biggest_challenge: string
          company_name: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          service_applying_for: string
        }
        Insert: {
          already_tried: string
          annual_revenue: string
          biggest_challenge: string
          company_name: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone?: string | null
          service_applying_for: string
        }
        Update: {
          already_tried?: string
          annual_revenue?: string
          biggest_challenge?: string
          company_name?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          service_applying_for?: string
        }
        Relationships: []
      }
      ask_marshall_submissions: {
        Row: {
          context: string | null
          created_at: string
          customer_email: string
          customer_name: string
          file_urls: string[] | null
          id: string
          question: string
          status: string
          stripe_session_id: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string
          customer_email: string
          customer_name: string
          file_urls?: string[] | null
          id?: string
          question: string
          status?: string
          stripe_session_id?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          file_urls?: string[] | null
          id?: string
          question?: string
          status?: string
          stripe_session_id?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published: boolean
          published_at: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published?: boolean
          published_at?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          status: Database["public"]["Enums"]["profile_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          status?: Database["public"]["Enums"]["profile_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      purchase_log: {
        Row: {
          amount_cents: number | null
          created_at: string
          customer_email: string
          customer_name: string
          error_message: string | null
          id: string
          kajabi_provisioned: boolean | null
          product_name: string | null
          stripe_session_id: string
          welcome_email_sent: boolean | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string
          customer_email: string
          customer_name: string
          error_message?: string | null
          id?: string
          kajabi_provisioned?: boolean | null
          product_name?: string | null
          stripe_session_id: string
          welcome_email_sent?: boolean | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string
          customer_email?: string
          customer_name?: string
          error_message?: string | null
          id?: string
          kajabi_provisioned?: boolean | null
          product_name?: string | null
          stripe_session_id?: string
          welcome_email_sent?: boolean | null
        }
        Relationships: []
      }
      recordings: {
        Row: {
          class_type: Database["public"]["Enums"]["class_type"]
          cloudflare_video_id: string
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          recording_date: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_ref: string | null
          video_source: Database["public"]["Enums"]["video_source"]
        }
        Insert: {
          class_type: Database["public"]["Enums"]["class_type"]
          cloudflare_video_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          recording_date: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_ref?: string | null
          video_source?: Database["public"]["Enums"]["video_source"]
        }
        Update: {
          class_type?: Database["public"]["Enums"]["class_type"]
          cloudflare_video_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          recording_date?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_ref?: string | null
          video_source?: Database["public"]["Enums"]["video_source"]
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      is_active_client: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user" | "client"
      class_type: "power_hour" | "contractor_school" | "sales_marketing_school"
      profile_status: "active" | "inactive"
      video_source: "cloudflare" | "zoom_clip"
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
      app_role: ["admin", "user", "client"],
      class_type: ["power_hour", "contractor_school", "sales_marketing_school"],
      profile_status: ["active", "inactive"],
      video_source: ["cloudflare", "zoom_clip"],
    },
  },
} as const
