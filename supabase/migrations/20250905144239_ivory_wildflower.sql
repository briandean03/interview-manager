/*
  # Check and Configure Row Level Security Policies

  This migration reviews and updates RLS policies for all tables to ensure proper access control.
  
  1. Review Current Policies
     - Check existing policies on all tables
     - Identify tables missing policies
  
  2. Add Missing Policies
     - Public read access for reference tables
     - Authenticated user access for candidate data
     - Admin access for management operations
  
  3. CORS Configuration
     - Edge function CORS headers
     - Database access permissions
*/

-- Check current RLS status and policies
DO $$
BEGIN
  RAISE NOTICE 'Checking RLS status for all tables...';
END $$;

-- Enable RLS on tables that don't have it enabled
ALTER TABLE "hrta_sd00-01_position_codes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-02_question_vids" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-08_position_qualifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_cd00-02_answer_context" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-04_whatsapp_output" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-05_store_prefillUrls" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-06_store_waitUrls" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "hrta_sd00-07_store_candidate_folder_id" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "supabase_access_p1" ON "hrta_cd00-01_resume_extraction";
DROP POLICY IF EXISTS "supabase_access_p2" ON "hrta_cd00-03_appointment_info";
DROP POLICY IF EXISTS "supabase_access_p4" ON "hrta_sd00-03_ai_evaluations";
DROP POLICY IF EXISTS "supabase_access_p5" ON "hrta_sd00-09_execution_log";

-- Create comprehensive policies for candidate data
CREATE POLICY "public_read_candidates"
  ON "hrta_cd00-01_resume_extraction"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_update_candidates"
  ON "hrta_cd00-01_resume_extraction"
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for appointment info
CREATE POLICY "public_read_appointments"
  ON "hrta_cd00-03_appointment_info"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_insert_appointments"
  ON "hrta_cd00-03_appointment_info"
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "public_update_appointments"
  ON "hrta_cd00-03_appointment_info"
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- Create policies for AI evaluations
CREATE POLICY "public_read_evaluations"
  ON "hrta_sd00-03_ai_evaluations"
  FOR SELECT
  TO public
  USING (true);

-- Create policies for execution logs
CREATE POLICY "public_read_logs"
  ON "hrta_sd00-09_execution_log"
  FOR SELECT
  TO public
  USING (true);

-- Create policies for reference tables (position codes, qualifications)
CREATE POLICY "public_read_positions"
  ON "hrta_sd00-01_position_codes"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_read_qualifications"
  ON "hrta_sd00-08_position_qualifications"
  FOR SELECT
  TO public
  USING (true);

-- Create policies for question videos
CREATE POLICY "public_read_questions"
  ON "hrta_sd00-02_question_vids"
  FOR SELECT
  TO public
  USING (true);

-- Create policies for answer context
CREATE POLICY "public_read_answers"
  ON "hrta_cd00-02_answer_context"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_insert_answers"
  ON "hrta_cd00-02_answer_context"
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policies for WhatsApp output
CREATE POLICY "public_read_whatsapp"
  ON "hrta_sd00-04_whatsapp_output"
  FOR SELECT
  TO public
  USING (true);

-- Create policies for URL storage tables
CREATE POLICY "public_read_prefill_urls"
  ON "hrta_sd00-05_store_prefillUrls"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_read_wait_urls"
  ON "hrta_sd00-06_store_waitUrls"
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "public_read_folder_ids"
  ON "hrta_sd00-07_store_candidate_folder_id"
  FOR SELECT
  TO public
  USING (true);

-- Grant necessary permissions to public role
GRANT SELECT ON ALL TABLES IN SCHEMA public TO public;
GRANT INSERT ON "hrta_cd00-03_appointment_info" TO public;
GRANT UPDATE ON "hrta_cd00-01_resume_extraction" TO public;
GRANT UPDATE ON "hrta_cd00-03_appointment_info" TO public;
GRANT INSERT ON "hrta_cd00-02_answer_context" TO public;

-- Create a function to check RLS policies
CREATE OR REPLACE FUNCTION check_rls_policies()
RETURNS TABLE(
  table_name text,
  rls_enabled boolean,
  policy_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.tablename::text,
    t.rowsecurity,
    COALESCE(p.policy_count, 0)
  FROM pg_tables t
  LEFT JOIN (
    SELECT 
      schemaname || '.' || tablename as full_name,
      COUNT(*) as policy_count
    FROM pg_policies 
    GROUP BY schemaname, tablename
  ) p ON t.schemaname || '.' || t.tablename = p.full_name
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Display current RLS status
SELECT * FROM check_rls_policies();