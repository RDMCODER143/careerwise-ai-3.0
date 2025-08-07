export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      candidates: {
        Row: {
          applied_at: string
          cover_letter: string | null
          email: string
          experience_years: number | null
          full_name: string
          id: string
          job_posting_id: string
          job_seeker_id: string
          location: string | null
          match_score: number | null
          phone: string | null
          resume_url: string | null
          skills: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          applied_at?: string
          cover_letter?: string | null
          email: string
          experience_years?: number | null
          full_name: string
          id?: string
          job_posting_id: string
          job_seeker_id: string
          location?: string | null
          match_score?: number | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          applied_at?: string
          cover_letter?: string | null
          email?: string
          experience_years?: number | null
          full_name?: string
          id?: string
          job_posting_id?: string
          job_seeker_id?: string
          location?: string | null
          match_score?: number | null
          phone?: string | null
          resume_url?: string | null
          skills?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidates_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      career_suggestions: {
        Row: {
          career_title: string
          created_at: string
          growth_rate: string | null
          id: string
          is_primary: boolean | null
          justification: string
          match_score: number
          required_skills: string[] | null
          salary_range: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          career_title: string
          created_at?: string
          growth_rate?: string | null
          id?: string
          is_primary?: boolean | null
          justification: string
          match_score: number
          required_skills?: string[] | null
          salary_range?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          career_title?: string
          created_at?: string
          growth_rate?: string | null
          id?: string
          is_primary?: boolean | null
          justification?: string
          match_score?: number
          required_skills?: string[] | null
          salary_range?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employerparsedtable: {
        Row: {
          cert_1: string | null
          cert_2: string | null
          cert_3: string | null
          created_at: string | null
          criteria_education: string | null
          criteria_experience: string | null
          criteria_skills: string | null
          criteria_summary: string | null
          criteria_tools: string | null
          edu_1_degree: string | null
          edu_1_end: string | null
          edu_1_school: string | null
          edu_1_start: string | null
          edu_2_degree: string | null
          edu_2_end: string | null
          edu_2_school: string | null
          edu_2_start: string | null
          edu_3_degree: string | null
          edu_3_end: string | null
          edu_3_school: string | null
          edu_3_start: string | null
          edu_4_degree: string | null
          edu_4_end: string | null
          edu_4_school: string | null
          edu_4_start: string | null
          email: string | null
          exp_1_company: string | null
          exp_1_description: string | null
          exp_1_end: string | null
          exp_1_location: string | null
          exp_1_start: string | null
          exp_1_title: string | null
          exp_2_company: string | null
          exp_2_description: string | null
          exp_2_end: string | null
          exp_2_location: string | null
          exp_2_start: string | null
          exp_2_title: string | null
          exp_3_company: string | null
          exp_3_description: string | null
          exp_3_end: string | null
          exp_3_location: string | null
          exp_3_start: string | null
          exp_3_title: string | null
          exp_4_company: string | null
          exp_4_description: string | null
          exp_4_end: string | null
          exp_4_location: string | null
          exp_4_start: string | null
          exp_4_title: string | null
          exp_5_company: string | null
          exp_5_description: string | null
          exp_5_end: string | null
          exp_5_location: string | null
          exp_5_start: string | null
          exp_5_title: string | null
          full_name: string | null
          id: string
          job_title: string | null
          lang_1: string | null
          lang_2: string | null
          lang_3: string | null
          lang_4: string | null
          linkedin: string | null
          location: string | null
          match_score: string | null
          phone: string | null
          portfolio_1: string | null
          portfolio_2: string | null
          portfolio_3: string | null
          skill_1: string | null
          skill_10: string | null
          skill_2: string | null
          skill_3: string | null
          skill_4: string | null
          skill_5: string | null
          skill_6: string | null
          skill_7: string | null
          skill_8: string | null
          skill_9: string | null
          summary: string | null
        }
        Insert: {
          cert_1?: string | null
          cert_2?: string | null
          cert_3?: string | null
          created_at?: string | null
          criteria_education?: string | null
          criteria_experience?: string | null
          criteria_skills?: string | null
          criteria_summary?: string | null
          criteria_tools?: string | null
          edu_1_degree?: string | null
          edu_1_end?: string | null
          edu_1_school?: string | null
          edu_1_start?: string | null
          edu_2_degree?: string | null
          edu_2_end?: string | null
          edu_2_school?: string | null
          edu_2_start?: string | null
          edu_3_degree?: string | null
          edu_3_end?: string | null
          edu_3_school?: string | null
          edu_3_start?: string | null
          edu_4_degree?: string | null
          edu_4_end?: string | null
          edu_4_school?: string | null
          edu_4_start?: string | null
          email?: string | null
          exp_1_company?: string | null
          exp_1_description?: string | null
          exp_1_end?: string | null
          exp_1_location?: string | null
          exp_1_start?: string | null
          exp_1_title?: string | null
          exp_2_company?: string | null
          exp_2_description?: string | null
          exp_2_end?: string | null
          exp_2_location?: string | null
          exp_2_start?: string | null
          exp_2_title?: string | null
          exp_3_company?: string | null
          exp_3_description?: string | null
          exp_3_end?: string | null
          exp_3_location?: string | null
          exp_3_start?: string | null
          exp_3_title?: string | null
          exp_4_company?: string | null
          exp_4_description?: string | null
          exp_4_end?: string | null
          exp_4_location?: string | null
          exp_4_start?: string | null
          exp_4_title?: string | null
          exp_5_company?: string | null
          exp_5_description?: string | null
          exp_5_end?: string | null
          exp_5_location?: string | null
          exp_5_start?: string | null
          exp_5_title?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          lang_1?: string | null
          lang_2?: string | null
          lang_3?: string | null
          lang_4?: string | null
          linkedin?: string | null
          location?: string | null
          match_score?: string | null
          phone?: string | null
          portfolio_1?: string | null
          portfolio_2?: string | null
          portfolio_3?: string | null
          skill_1?: string | null
          skill_10?: string | null
          skill_2?: string | null
          skill_3?: string | null
          skill_4?: string | null
          skill_5?: string | null
          skill_6?: string | null
          skill_7?: string | null
          skill_8?: string | null
          skill_9?: string | null
          summary?: string | null
        }
        Update: {
          cert_1?: string | null
          cert_2?: string | null
          cert_3?: string | null
          created_at?: string | null
          criteria_education?: string | null
          criteria_experience?: string | null
          criteria_skills?: string | null
          criteria_summary?: string | null
          criteria_tools?: string | null
          edu_1_degree?: string | null
          edu_1_end?: string | null
          edu_1_school?: string | null
          edu_1_start?: string | null
          edu_2_degree?: string | null
          edu_2_end?: string | null
          edu_2_school?: string | null
          edu_2_start?: string | null
          edu_3_degree?: string | null
          edu_3_end?: string | null
          edu_3_school?: string | null
          edu_3_start?: string | null
          edu_4_degree?: string | null
          edu_4_end?: string | null
          edu_4_school?: string | null
          edu_4_start?: string | null
          email?: string | null
          exp_1_company?: string | null
          exp_1_description?: string | null
          exp_1_end?: string | null
          exp_1_location?: string | null
          exp_1_start?: string | null
          exp_1_title?: string | null
          exp_2_company?: string | null
          exp_2_description?: string | null
          exp_2_end?: string | null
          exp_2_location?: string | null
          exp_2_start?: string | null
          exp_2_title?: string | null
          exp_3_company?: string | null
          exp_3_description?: string | null
          exp_3_end?: string | null
          exp_3_location?: string | null
          exp_3_start?: string | null
          exp_3_title?: string | null
          exp_4_company?: string | null
          exp_4_description?: string | null
          exp_4_end?: string | null
          exp_4_location?: string | null
          exp_4_start?: string | null
          exp_4_title?: string | null
          exp_5_company?: string | null
          exp_5_description?: string | null
          exp_5_end?: string | null
          exp_5_location?: string | null
          exp_5_start?: string | null
          exp_5_title?: string | null
          full_name?: string | null
          id?: string
          job_title?: string | null
          lang_1?: string | null
          lang_2?: string | null
          lang_3?: string | null
          lang_4?: string | null
          linkedin?: string | null
          location?: string | null
          match_score?: string | null
          phone?: string | null
          portfolio_1?: string | null
          portfolio_2?: string | null
          portfolio_3?: string | null
          skill_1?: string | null
          skill_10?: string | null
          skill_2?: string | null
          skill_3?: string | null
          skill_4?: string | null
          skill_5?: string | null
          skill_6?: string | null
          skill_7?: string | null
          skill_8?: string | null
          skill_9?: string | null
          summary?: string | null
        }
        Relationships: []
      }
      interviews: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          interview_type: string
          job_posting_id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          interview_type?: string
          job_posting_id: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          interview_type?: string
          job_posting_id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          application_date: string
          company: string
          created_at: string
          id: string
          job_description: string | null
          job_title: string
          job_type: string
          location: string
          match_score: number | null
          salary_range: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_date?: string
          company: string
          created_at?: string
          id?: string
          job_description?: string | null
          job_title: string
          job_type?: string
          location: string
          match_score?: number | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_date?: string
          company?: string
          created_at?: string
          id?: string
          job_description?: string | null
          job_title?: string
          job_type?: string
          location?: string
          match_score?: number | null
          salary_range?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_postings: {
        Row: {
          benefits: string[] | null
          created_at: string
          department: string
          description: string | null
          employer_id: string
          expires_at: string | null
          id: string
          job_type: string
          location: string
          requirements: string[] | null
          salary_max: number | null
          salary_min: number | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string
          department: string
          description?: string | null
          employer_id: string
          expires_at?: string | null
          id?: string
          job_type?: string
          location: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          benefits?: string[] | null
          created_at?: string
          department?: string
          description?: string | null
          employer_id?: string
          expires_at?: string | null
          id?: string
          job_type?: string
          location?: string
          requirements?: string[] | null
          salary_max?: number | null
          salary_min?: number | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          app_role: string | null
          banned_at: string | null
          banned_reason: string | null
          bio: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          current_company: string | null
          current_title: string | null
          degree: string | null
          expected_salary: string | null
          experience: string | null
          full_name: string
          graduation_year: string | null
          id: string
          is_banned: boolean | null
          major: string | null
          phone: string | null
          profile_photo_url: string | null
          role: string
          school: string | null
          skills: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          app_role?: string | null
          banned_at?: string | null
          banned_reason?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          degree?: string | null
          expected_salary?: string | null
          experience?: string | null
          full_name: string
          graduation_year?: string | null
          id?: string
          is_banned?: boolean | null
          major?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          role: string
          school?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          app_role?: string | null
          banned_at?: string | null
          banned_reason?: string | null
          bio?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          current_company?: string | null
          current_title?: string | null
          degree?: string | null
          expected_salary?: string | null
          experience?: string | null
          full_name?: string
          graduation_year?: string | null
          id?: string
          is_banned?: boolean | null
          major?: string | null
          phone?: string | null
          profile_photo_url?: string | null
          role?: string
          school?: string | null
          skills?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_analysis: {
        Row: {
          created_at: string
          feedback: string
          id: string
          keywords_missing: string[] | null
          resume_id: string | null
          score: number
          strengths: string[] | null
          updated_at: string
          user_id: string
          weaknesses: string[] | null
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          keywords_missing?: string[] | null
          resume_id?: string | null
          score: number
          strengths?: string[] | null
          updated_at?: string
          user_id: string
          weaknesses?: string[] | null
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          keywords_missing?: string[] | null
          resume_id?: string | null
          score?: number
          strengths?: string[] | null
          updated_at?: string
          user_id?: string
          weaknesses?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "resume_analysis_resume_id_fkey"
            columns: ["resume_id"]
            isOneToOne: false
            referencedRelation: "resumes"
            referencedColumns: ["id"]
          },
        ]
      }
      resumes: {
        Row: {
          ai_feedback: Json | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id: string
          parsed_at: string | null
          parsed_data: Json | null
          uploaded_at: string
          user_id: string
        }
        Insert: {
          ai_feedback?: Json | null
          file_path: string
          file_size: number
          file_type: string
          filename: string
          id?: string
          parsed_at?: string | null
          parsed_data?: Json | null
          uploaded_at?: string
          user_id: string
        }
        Update: {
          ai_feedback?: Json | null
          file_path?: string
          file_size?: number
          file_type?: string
          filename?: string
          id?: string
          parsed_at?: string | null
          parsed_data?: Json | null
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resuming: {
        Row: {
          cert_1: string | null
          cert_2: string | null
          cert_3: string | null
          created_at: string | null
          edu_1_degree: string | null
          edu_1_end: string | null
          edu_1_school: string | null
          edu_1_start: string | null
          edu_2_degree: string | null
          edu_2_end: string | null
          edu_2_school: string | null
          edu_2_start: string | null
          edu_3_degree: string | null
          edu_3_end: string | null
          edu_3_school: string | null
          edu_3_start: string | null
          edu_4_degree: string | null
          edu_4_end: string | null
          edu_4_school: string | null
          edu_4_start: string | null
          email: string | null
          exp_1_company: string | null
          exp_1_description: string | null
          exp_1_end: string | null
          exp_1_location: string | null
          exp_1_start: string | null
          exp_1_title: string | null
          exp_2_company: string | null
          exp_2_description: string | null
          exp_2_end: string | null
          exp_2_location: string | null
          exp_2_start: string | null
          exp_2_title: string | null
          exp_3_company: string | null
          exp_3_description: string | null
          exp_3_end: string | null
          exp_3_location: string | null
          exp_3_start: string | null
          exp_3_title: string | null
          exp_4_company: string | null
          exp_4_description: string | null
          exp_4_end: string | null
          exp_4_location: string | null
          exp_4_start: string | null
          exp_4_title: string | null
          exp_5_company: string | null
          exp_5_description: string | null
          exp_5_end: string | null
          exp_5_location: string | null
          exp_5_start: string | null
          exp_5_title: string | null
          full_name: string | null
          id: string
          lang_1: string | null
          lang_2: string | null
          lang_3: string | null
          lang_4: string | null
          linkedin: string | null
          location: string | null
          phone: string | null
          portfolio_1: string | null
          portfolio_2: string | null
          portfolio_3: string | null
          skill_1: string | null
          skill_10: string | null
          skill_2: string | null
          skill_3: string | null
          skill_4: string | null
          skill_5: string | null
          skill_6: string | null
          skill_7: string | null
          skill_8: string | null
          skill_9: string | null
          summary: string | null
        }
        Insert: {
          cert_1?: string | null
          cert_2?: string | null
          cert_3?: string | null
          created_at?: string | null
          edu_1_degree?: string | null
          edu_1_end?: string | null
          edu_1_school?: string | null
          edu_1_start?: string | null
          edu_2_degree?: string | null
          edu_2_end?: string | null
          edu_2_school?: string | null
          edu_2_start?: string | null
          edu_3_degree?: string | null
          edu_3_end?: string | null
          edu_3_school?: string | null
          edu_3_start?: string | null
          edu_4_degree?: string | null
          edu_4_end?: string | null
          edu_4_school?: string | null
          edu_4_start?: string | null
          email?: string | null
          exp_1_company?: string | null
          exp_1_description?: string | null
          exp_1_end?: string | null
          exp_1_location?: string | null
          exp_1_start?: string | null
          exp_1_title?: string | null
          exp_2_company?: string | null
          exp_2_description?: string | null
          exp_2_end?: string | null
          exp_2_location?: string | null
          exp_2_start?: string | null
          exp_2_title?: string | null
          exp_3_company?: string | null
          exp_3_description?: string | null
          exp_3_end?: string | null
          exp_3_location?: string | null
          exp_3_start?: string | null
          exp_3_title?: string | null
          exp_4_company?: string | null
          exp_4_description?: string | null
          exp_4_end?: string | null
          exp_4_location?: string | null
          exp_4_start?: string | null
          exp_4_title?: string | null
          exp_5_company?: string | null
          exp_5_description?: string | null
          exp_5_end?: string | null
          exp_5_location?: string | null
          exp_5_start?: string | null
          exp_5_title?: string | null
          full_name?: string | null
          id?: string
          lang_1?: string | null
          lang_2?: string | null
          lang_3?: string | null
          lang_4?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          portfolio_1?: string | null
          portfolio_2?: string | null
          portfolio_3?: string | null
          skill_1?: string | null
          skill_10?: string | null
          skill_2?: string | null
          skill_3?: string | null
          skill_4?: string | null
          skill_5?: string | null
          skill_6?: string | null
          skill_7?: string | null
          skill_8?: string | null
          skill_9?: string | null
          summary?: string | null
        }
        Update: {
          cert_1?: string | null
          cert_2?: string | null
          cert_3?: string | null
          created_at?: string | null
          edu_1_degree?: string | null
          edu_1_end?: string | null
          edu_1_school?: string | null
          edu_1_start?: string | null
          edu_2_degree?: string | null
          edu_2_end?: string | null
          edu_2_school?: string | null
          edu_2_start?: string | null
          edu_3_degree?: string | null
          edu_3_end?: string | null
          edu_3_school?: string | null
          edu_3_start?: string | null
          edu_4_degree?: string | null
          edu_4_end?: string | null
          edu_4_school?: string | null
          edu_4_start?: string | null
          email?: string | null
          exp_1_company?: string | null
          exp_1_description?: string | null
          exp_1_end?: string | null
          exp_1_location?: string | null
          exp_1_start?: string | null
          exp_1_title?: string | null
          exp_2_company?: string | null
          exp_2_description?: string | null
          exp_2_end?: string | null
          exp_2_location?: string | null
          exp_2_start?: string | null
          exp_2_title?: string | null
          exp_3_company?: string | null
          exp_3_description?: string | null
          exp_3_end?: string | null
          exp_3_location?: string | null
          exp_3_start?: string | null
          exp_3_title?: string | null
          exp_4_company?: string | null
          exp_4_description?: string | null
          exp_4_end?: string | null
          exp_4_location?: string | null
          exp_4_start?: string | null
          exp_4_title?: string | null
          exp_5_company?: string | null
          exp_5_description?: string | null
          exp_5_end?: string | null
          exp_5_location?: string | null
          exp_5_start?: string | null
          exp_5_title?: string | null
          full_name?: string | null
          id?: string
          lang_1?: string | null
          lang_2?: string | null
          lang_3?: string | null
          lang_4?: string | null
          linkedin?: string | null
          location?: string | null
          phone?: string | null
          portfolio_1?: string | null
          portfolio_2?: string | null
          portfolio_3?: string | null
          skill_1?: string | null
          skill_10?: string | null
          skill_2?: string | null
          skill_3?: string | null
          skill_4?: string | null
          skill_5?: string | null
          skill_6?: string | null
          skill_7?: string | null
          skill_8?: string | null
          skill_9?: string | null
          summary?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_user_ban: {
        Args: { target_user_id: string; ban_reason?: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
