-- ============================================================
-- Taylor's Collision — Database Setup
-- Run in Supabase SQL Editor
-- ============================================================

-- Job Applications table
-- Matches the careers page form (src/app/careers/page.tsx)
CREATE TABLE IF NOT EXISTS job_applications (
  id                  BIGSERIAL PRIMARY KEY,
  first_name          TEXT NOT NULL,
  last_name           TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT NOT NULL,
  address             TEXT NOT NULL DEFAULT '',
  city                TEXT NOT NULL DEFAULT '',
  state               TEXT NOT NULL DEFAULT '',
  zip                 TEXT NOT NULL DEFAULT '',
  position            TEXT NOT NULL,
  start_date          DATE,
  experience          TEXT NOT NULL DEFAULT '0',
  resume_url          TEXT,
  status              TEXT NOT NULL DEFAULT 'new',  -- new, reviewed, interviewed, hired, rejected
  notes               TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Contact Messages table
-- Matches the contact page form (src/app/contact/page.tsx)
CREATE TABLE IF NOT EXISTS contact_messages (
  id                  BIGSERIAL PRIMARY KEY,
  name                TEXT NOT NULL,
  email               TEXT NOT NULL,
  phone               TEXT,
  message             TEXT NOT NULL,
  service             TEXT NOT NULL DEFAULT 'General Inquiry',
  status              TEXT NOT NULL DEFAULT 'new',  -- new, read, responded
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anon (public) to insert (form submissions from the website)
CREATE POLICY "Allow public insert" ON job_applications
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public insert" ON contact_messages
  FOR INSERT TO anon WITH CHECK (true);

-- Only authenticated users / service role can read
CREATE POLICY "Allow service role read" ON job_applications
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role read" ON contact_messages
  FOR SELECT USING (auth.role() = 'service_role');

-- Resumes storage bucket (for job application resume uploads)
-- Run this only once:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Allow anon to upload to resumes bucket
-- CREATE POLICY "Allow public upload" ON storage.objects
--   FOR INSERT TO anon WITH CHECK (bucket_id = 'resumes');

-- ============================================================
-- Appointment requests (custom BookingCalendar component).
-- Email via /api/notify is the source of truth; this table is
-- a best-effort log so the shop can review requests in Supabase.
-- ============================================================
CREATE TABLE IF NOT EXISTS appointment_requests (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at     timestamptz NOT NULL DEFAULT now(),
  name           text NOT NULL,
  email          text,
  phone          text NOT NULL,
  vehicle        text,
  notes          text,
  preferred_date text,
  preferred_time text
);

ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON appointment_requests
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow service role read" ON appointment_requests
  FOR SELECT USING (auth.role() = 'service_role');
