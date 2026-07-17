import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idnjwreqywswlflckmrm.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_WQRQ9bWISu_1OR-QFtD-5A_cTeyHqKh';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type Database = {
  public: {
    Tables: {
      captures: {
        Row: {
          id: string;
          url: string;
          world: 'ATMOSPHERE' | 'TRANSFORMATION' | 'AUTHORITY' | 'PEOPLE';
          pillar: 'SKIN' | 'MIND' | 'SOUL';
          type: 'photo' | 'video' | 'testimonial';
          video_length?: string;
          status: 'draft' | 'approved';
          date: string;
          notes: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['captures']['Row'], 'id' | 'created_at'>;
      };
      prompts: {
        Row: {
          id: string;
          world: 'ATMOSPHERE' | 'TRANSFORMATION' | 'AUTHORITY' | 'PEOPLE';
          pillar: 'SKIN' | 'MIND' | 'SOUL';
          title: string;
          description: string;
          example: string;
          week_number: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['prompts']['Row'], 'id' | 'created_at'>;
      };
      comments: {
        Row: {
          id: string;
          capture_id: string;
          author: string;
          text: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['comments']['Row'], 'id' | 'created_at'>;
      };
      monthly_targets: {
        Row: {
          id: string;
          month: string;
          world: 'ATMOSPHERE' | 'TRANSFORMATION' | 'AUTHORITY' | 'PEOPLE';
          target: number;
        };
        Insert: Omit<Database['public']['Tables']['monthly_targets']['Row'], 'id'>;
      };
    };
  };
};
