export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          language: string
          status: string | null
          city_plz: string | null
          goal: string | null
          onboarding_done: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          language: string
          status?: string | null
          city_plz?: string | null
          goal?: string | null
          onboarding_done?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          language?: string
          status?: string | null
          city_plz?: string | null
          goal?: string | null
          onboarding_done?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      checklist_items: {
        Row: {
          id: number
          status_type: string
          order_index: number
          title_de: string
          title_en: string
          title_tr: string
          title_ar: string
          title_ku_sorani: string
          title_ku_kurmanji: string
          title_fa: string
          description_de: string | null
          description_en: string | null
          description_tr: string | null
          description_ar: string | null
          description_ku_sorani: string | null
          description_ku_kurmanji: string | null
          description_fa: string | null
          created_at: string
        }
        Insert: {
          id?: number
          status_type: string
          order_index: number
          title_de: string
          title_en: string
          title_tr: string
          title_ar: string
          title_ku_sorani: string
          title_ku_kurmanji: string
          title_fa: string
          description_de?: string | null
          description_en?: string | null
          description_tr?: string | null
          description_ar?: string | null
          description_ku_sorani?: string | null
          description_ku_kurmanji?: string | null
          description_fa?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          status_type?: string
          order_index?: number
          title_de?: string
          title_en?: string
          title_tr?: string
          title_ar?: string
          title_ku_sorani?: string
          title_ku_kurmanji?: string
          title_fa?: string
          description_de?: string | null
          description_en?: string | null
          description_tr?: string | null
          description_ar?: string | null
          description_ku_sorani?: string | null
          description_ku_kurmanji?: string | null
          description_fa?: string | null
          created_at?: string
        }
      }
      user_checklist_progress: {
        Row: {
          id: number
          user_id: string
          item_id: number
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          item_id: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          item_id?: number
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
