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
      blog_images: {
        Row: {
          alt_text: string | null
          blog_id: string
          created_at: string
          id: string
          image_type: string | null
          image_url: string
          prompt: string | null
        }
        Insert: {
          alt_text?: string | null
          blog_id: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url: string
          prompt?: string | null
        }
        Update: {
          alt_text?: string | null
          blog_id?: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string
          prompt?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_images_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          blog_type: Database["public"]["Enums"]["blog_type"]
          brand_voice_score: number | null
          content: string | null
          created_at: string
          domain_id: string
          hero_image_url: string | null
          id: string
          keyword_score: number | null
          meta_description: string | null
          outline: Json | null
          parent_blog_id: string | null
          primary_keyword: string | null
          published_at: string | null
          readability_score: number | null
          reading_time: number | null
          sanity_document_id: string | null
          scheduled_at: string | null
          secondary_keywords: string[] | null
          seo_score: number | null
          slug: string | null
          status: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          blog_type?: Database["public"]["Enums"]["blog_type"]
          brand_voice_score?: number | null
          content?: string | null
          created_at?: string
          domain_id: string
          hero_image_url?: string | null
          id?: string
          keyword_score?: number | null
          meta_description?: string | null
          outline?: Json | null
          parent_blog_id?: string | null
          primary_keyword?: string | null
          published_at?: string | null
          readability_score?: number | null
          reading_time?: number | null
          sanity_document_id?: string | null
          scheduled_at?: string | null
          secondary_keywords?: string[] | null
          seo_score?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["blog_status"]
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          blog_type?: Database["public"]["Enums"]["blog_type"]
          brand_voice_score?: number | null
          content?: string | null
          created_at?: string
          domain_id?: string
          hero_image_url?: string | null
          id?: string
          keyword_score?: number | null
          meta_description?: string | null
          outline?: Json | null
          parent_blog_id?: string | null
          primary_keyword?: string | null
          published_at?: string | null
          readability_score?: number | null
          reading_time?: number | null
          sanity_document_id?: string | null
          scheduled_at?: string | null
          secondary_keywords?: string[] | null
          seo_score?: number | null
          slug?: string | null
          status?: Database["public"]["Enums"]["blog_status"]
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_parent_blog_id_fkey"
            columns: ["parent_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      domains: {
        Row: {
          brand_voice: string | null
          created_at: string
          default_cta_style: string | null
          forbidden_words: string[] | null
          id: string
          name: string
          sanity_api_token: string | null
          sanity_dataset: string | null
          sanity_project_id: string | null
          style: string | null
          target_audience: string | null
          tone: string | null
          updated_at: string
          url: string | null
          user_id: string
        }
        Insert: {
          brand_voice?: string | null
          created_at?: string
          default_cta_style?: string | null
          forbidden_words?: string[] | null
          id?: string
          name: string
          sanity_api_token?: string | null
          sanity_dataset?: string | null
          sanity_project_id?: string | null
          style?: string | null
          target_audience?: string | null
          tone?: string | null
          updated_at?: string
          url?: string | null
          user_id: string
        }
        Update: {
          brand_voice?: string | null
          created_at?: string
          default_cta_style?: string | null
          forbidden_words?: string[] | null
          id?: string
          name?: string
          sanity_api_token?: string | null
          sanity_dataset?: string | null
          sanity_project_id?: string | null
          style?: string | null
          target_audience?: string | null
          tone?: string | null
          updated_at?: string
          url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      generation_sessions: {
        Row: {
          blog_type: Database["public"]["Enums"]["blog_type"] | null
          content: string | null
          created_at: string
          current_step: number
          domain_id: string
          id: string
          image_urls: string[] | null
          keywords: Json | null
          outline: Json | null
          selected_keyword: string | null
          selected_title: string | null
          seo_scores: Json | null
          status: string
          titles: Json | null
          topic: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          blog_type?: Database["public"]["Enums"]["blog_type"] | null
          content?: string | null
          created_at?: string
          current_step?: number
          domain_id: string
          id?: string
          image_urls?: string[] | null
          keywords?: Json | null
          outline?: Json | null
          selected_keyword?: string | null
          selected_title?: string | null
          seo_scores?: Json | null
          status?: string
          titles?: Json | null
          topic?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          blog_type?: Database["public"]["Enums"]["blog_type"] | null
          content?: string | null
          created_at?: string
          current_step?: number
          domain_id?: string
          id?: string
          image_urls?: string[] | null
          keywords?: Json | null
          outline?: Json | null
          selected_keyword?: string | null
          selected_title?: string | null
          seo_scores?: Json | null
          status?: string
          titles?: Json | null
          topic?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "generation_sessions_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      keywords: {
        Row: {
          created_at: string
          difficulty: number | null
          domain_id: string
          id: string
          intent: string | null
          keyword: string
          related_keywords: string[] | null
          search_volume: number | null
          source: string | null
        }
        Insert: {
          created_at?: string
          difficulty?: number | null
          domain_id: string
          id?: string
          intent?: string | null
          keyword: string
          related_keywords?: string[] | null
          search_volume?: number | null
          source?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: number | null
          domain_id?: string
          id?: string
          intent?: string | null
          keyword?: string
          related_keywords?: string[] | null
          search_volume?: number | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "keywords_domain_id_fkey"
            columns: ["domain_id"]
            isOneToOne: false
            referencedRelation: "domains"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      social_content: {
        Row: {
          blog_id: string
          content: string
          created_at: string
          hashtags: string[] | null
          id: string
          platform: string
        }
        Insert: {
          blog_id: string
          content: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          platform: string
        }
        Update: {
          blog_id?: string
          content?: string
          created_at?: string
          hashtags?: string[] | null
          id?: string
          platform?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_content_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
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
      blog_status: "draft" | "scheduled" | "published" | "archived"
      blog_type: "pillar" | "cluster"
      user_role: "admin" | "editor" | "writer" | "viewer"
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
      blog_status: ["draft", "scheduled", "published", "archived"],
      blog_type: ["pillar", "cluster"],
      user_role: ["admin", "editor", "writer", "viewer"],
    },
  },
} as const
