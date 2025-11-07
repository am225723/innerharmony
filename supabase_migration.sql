-- =====================================================
-- Compassionate Path IFS Therapy Platform
-- Supabase PostgreSQL Migration Script
-- All tables prefixed with IFS_ for namespace isolation
-- =====================================================
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE ifs_user_role AS ENUM ('therapist', 'client');
CREATE TYPE ifs_session_status AS ENUM ('scheduled', 'active', 'completed', 'cancelled');
CREATE TYPE ifs_part_type AS ENUM ('manager', 'firefighter', 'exile');
CREATE TYPE ifs_protocol_type AS ENUM ('six_fs', 'witnessing', 'unburdening', 'letter', 'free');
CREATE TYPE ifs_activity_type AS ENUM ('parts_mapping', 'six_fs', 'meditation', 'witnessing', 'unburdening', 'letter_writing', 'body_mapping', 'creative_expression');
CREATE TYPE ifs_activity_status AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE ifs_media_type AS ENUM ('image', 'audio', 'video');
CREATE TYPE ifs_lesson_category AS ENUM ('introduction', 'understanding_parts', 'self_leadership', 'unburdening', 'advanced', 'protocols', 'healing', 'integration');
CREATE TYPE ifs_lesson_track AS ENUM ('foundations', 'deepening', 'therapeutic');
CREATE TYPE ifs_safety_level AS ENUM ('gentle', 'moderate', 'intensive');
CREATE TYPE ifs_lesson_activity_type AS ENUM ('reflection', 'journaling', 'parts_work', 'meditation', 'exercise', 'protocol', 'assessment', 'grounding');
CREATE TYPE ifs_protocol_step_type AS ENUM ('six_fs', 'unburdening', 'reparenting', 'grounding', 'self_assessment');
CREATE TYPE ifs_wound_type AS ENUM ('rejection', 'abandonment', 'injustice', 'betrayal', 'neglect');
CREATE TYPE ifs_healing_progress AS ENUM ('identified', 'exploring', 'healing', 'integrated');
CREATE TYPE ifs_assessment_type AS ENUM ('eight_cs', 'parts_check', 'safety_check', 'grounding_check');
CREATE TYPE ifs_author_role AS ENUM ('therapist', 'client');
CREATE TYPE ifs_message_type AS ENUM ('chat', 'prompt', 'reflection');
CREATE TYPE ifs_visibility_type AS ENUM ('shared', 'therapist_only');
CREATE TYPE ifs_protocol_walkthrough_type AS ENUM ('six_fs', 'witnessing', 'unburdening', 'letter');
CREATE TYPE ifs_walkthrough_status AS ENUM ('active', 'paused', 'completed');
CREATE TYPE ifs_participant_role AS ENUM ('therapist', 'client');
CREATE TYPE ifs_participant_status AS ENUM ('joined', 'left');
CREATE TYPE ifs_goal_category AS ENUM ('self_leadership', 'parts_work', 'unburdening', 'daily_practice', 'relationship', 'emotional_regulation', 'trauma_healing', 'other');
CREATE TYPE ifs_goal_status AS ENUM ('not_started', 'in_progress', 'achieved', 'revised');
CREATE TYPE ifs_priority_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE ifs_assignment_status AS ENUM ('assigned', 'in_progress', 'completed', 'overdue');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Users table
CREATE TABLE IFS_users (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role ifs_user_role NOT NULL DEFAULT 'client',
  display_name TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Sessions table
CREATE TABLE IFS_sessions (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id VARCHAR NOT NULL,
  client_id VARCHAR NOT NULL,
  title TEXT NOT NULL,
  status ifs_session_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Parts table (IFS internal parts - Manager, Firefighter, Exile)
CREATE TABLE IFS_parts (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  session_id VARCHAR,
  type ifs_part_type NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  emotions TEXT[],
  body_location TEXT,
  color TEXT,
  age TEXT,
  position_x TEXT,
  position_y TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Journal entries table
CREATE TABLE IFS_journal_entries (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  session_id VARCHAR,
  part_id VARCHAR,
  protocol ifs_protocol_type NOT NULL,
  step TEXT,
  content TEXT NOT NULL,
  responses JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Activities table
CREATE TABLE IFS_activities (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  session_id VARCHAR,
  type ifs_activity_type NOT NULL,
  title TEXT NOT NULL,
  status ifs_activity_status NOT NULL DEFAULT 'not_started',
  data JSONB,
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- AI insights table (Perplexity AI generated insights)
CREATE TABLE IFS_ai_insights (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  session_id VARCHAR,
  part_id VARCHAR,
  journal_entry_id VARCHAR,
  context TEXT NOT NULL,
  insight TEXT NOT NULL,
  citations TEXT[],
  saved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Media table (audio, video, images)
CREATE TABLE IFS_media (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  session_id VARCHAR,
  type ifs_media_type NOT NULL,
  url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- EDUCATIONAL CURRICULUM TABLES
-- =====================================================

-- Lessons table (10-module IFS curriculum)
CREATE TABLE IFS_lessons (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category ifs_lesson_category NOT NULL,
  track ifs_lesson_track NOT NULL DEFAULT 'foundations',
  "order" TEXT NOT NULL,
  content JSONB NOT NULL,
  estimated_minutes TEXT,
  safety_level ifs_safety_level DEFAULT 'gentle',
  trauma_warning BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lesson activities table
CREATE TABLE IFS_lesson_activities (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id VARCHAR NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type ifs_lesson_activity_type NOT NULL,
  "order" TEXT NOT NULL,
  content JSONB NOT NULL,
  is_protocol BOOLEAN DEFAULT FALSE,
  requires_safety_check BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Lesson progress table
CREATE TABLE IFS_lesson_progress (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  lesson_id VARCHAR NOT NULL,
  status ifs_activity_status NOT NULL DEFAULT 'not_started',
  activities_completed TEXT[] DEFAULT ARRAY[]::TEXT[],
  completed_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- THERAPEUTIC PROTOCOL TABLES
-- =====================================================

-- Protocol steps table (6 F's, Unburdening, etc.)
CREATE TABLE IFS_protocol_steps (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  activity_id VARCHAR NOT NULL,
  lesson_activity_id VARCHAR,
  protocol_type ifs_protocol_step_type NOT NULL,
  step_number TEXT NOT NULL,
  step_name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  response TEXT,
  safety_check_passed BOOLEAN,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Wound profiles table (5 childhood wounds)
CREATE TABLE IFS_wound_profiles (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  part_id VARCHAR,
  wound_type ifs_wound_type NOT NULL,
  description TEXT,
  origin_story TEXT,
  core_beliefs TEXT[],
  triggers TEXT[],
  protector_strategies TEXT[],
  healing_progress ifs_healing_progress DEFAULT 'identified',
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Self assessments table (8 C's assessments)
CREATE TABLE IFS_self_assessments (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  assessment_type ifs_assessment_type NOT NULL,
  scores JSONB NOT NULL,
  in_self BOOLEAN,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- COLLABORATIVE SESSION TABLES
-- =====================================================

-- Session notes table
CREATE TABLE IFS_session_notes (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  author_id VARCHAR NOT NULL,
  author_role ifs_author_role NOT NULL,
  content TEXT NOT NULL,
  visibility ifs_visibility_type NOT NULL DEFAULT 'shared',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Session messages table (WebSocket real-time chat)
CREATE TABLE IFS_session_messages (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  sender_id VARCHAR NOT NULL,
  sender_role ifs_author_role NOT NULL,
  message_type ifs_message_type NOT NULL DEFAULT 'chat',
  content TEXT NOT NULL,
  read_by TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Protocol walkthroughs table (collaborative protocols)
CREATE TABLE IFS_protocol_walkthroughs (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  protocol_type ifs_protocol_walkthrough_type NOT NULL,
  current_step TEXT NOT NULL,
  therapist_prompts JSONB,
  client_responses JSONB,
  status ifs_walkthrough_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Session participants table
CREATE TABLE IFS_session_participants (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id VARCHAR NOT NULL,
  user_id VARCHAR NOT NULL,
  role ifs_participant_role NOT NULL,
  status ifs_participant_status NOT NULL,
  joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
  left_at TIMESTAMP
);

-- =====================================================
-- ANXIETY-SPECIFIC TABLES
-- =====================================================

-- Daily anxiety check-ins table
CREATE TABLE IFS_daily_anxiety_checkins (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  checkin_date TIMESTAMP NOT NULL,
  anxiety_level INTEGER NOT NULL,
  triggered_parts TEXT[] DEFAULT ARRAY[]::TEXT[],
  grounding_techniques_used TEXT[] DEFAULT ARRAY[]::TEXT[],
  self_energy_moments TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Grounding technique progress table
CREATE TABLE IFS_grounding_technique_progress (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  technique_name TEXT NOT NULL,
  practiced BOOLEAN DEFAULT FALSE NOT NULL,
  times_completed INTEGER DEFAULT 0 NOT NULL,
  effectiveness INTEGER,
  notes TEXT,
  last_practiced_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Body sensations table
CREATE TABLE IFS_body_sensations (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  body_region TEXT NOT NULL,
  sensation TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  associated_parts TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Anxiety timeline table
CREATE TABLE IFS_anxiety_timeline (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR NOT NULL,
  event_date TIMESTAMP NOT NULL,
  anxiety_level INTEGER NOT NULL,
  situation TEXT NOT NULL,
  wounds_identified TEXT[] DEFAULT ARRAY[]::TEXT[],
  parts_involved TEXT[] DEFAULT ARRAY[]::TEXT[],
  triggers TEXT,
  body_response TEXT,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- THERAPIST-CLIENT MANAGEMENT TABLES
-- =====================================================

-- Therapist assignments table
CREATE TABLE IFS_therapist_assignments (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id VARCHAR NOT NULL,
  client_id VARCHAR NOT NULL,
  activity_type TEXT NOT NULL,
  activity_id VARCHAR,
  title TEXT NOT NULL,
  description TEXT,
  priority ifs_priority_level NOT NULL DEFAULT 'medium',
  due_date TIMESTAMP,
  status ifs_assignment_status NOT NULL DEFAULT 'assigned',
  completed_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Session goals table (NEW - therapist sets goals, client tracks progress)
CREATE TABLE IFS_session_goals (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id VARCHAR NOT NULL,
  client_id VARCHAR NOT NULL,
  goal_text TEXT NOT NULL,
  category ifs_goal_category NOT NULL DEFAULT 'other',
  target_date TIMESTAMP,
  status ifs_goal_status NOT NULL DEFAULT 'not_started',
  progress INTEGER NOT NULL DEFAULT 0,
  client_notes TEXT,
  therapist_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Therapist notes table (NEW - private session documentation)
CREATE TABLE IFS_therapist_notes (
  id VARCHAR PRIMARY KEY DEFAULT uuid_generate_v4(),
  therapist_id VARCHAR NOT NULL,
  client_id VARCHAR,
  session_id VARCHAR,
  session_date TIMESTAMP NOT NULL,
  note_content TEXT NOT NULL,
  tagged_part_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  is_private BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User indexes
CREATE INDEX idx_ifs_users_username ON IFS_users(username);
CREATE INDEX idx_ifs_users_role ON IFS_users(role);

-- Session indexes
CREATE INDEX idx_ifs_sessions_therapist ON IFS_sessions(therapist_id);
CREATE INDEX idx_ifs_sessions_client ON IFS_sessions(client_id);
CREATE INDEX idx_ifs_sessions_status ON IFS_sessions(status);

-- Parts indexes
CREATE INDEX idx_ifs_parts_user ON IFS_parts(user_id);
CREATE INDEX idx_ifs_parts_session ON IFS_parts(session_id);
CREATE INDEX idx_ifs_parts_type ON IFS_parts(type);

-- Journal entries indexes
CREATE INDEX idx_ifs_journal_user ON IFS_journal_entries(user_id);
CREATE INDEX idx_ifs_journal_session ON IFS_journal_entries(session_id);
CREATE INDEX idx_ifs_journal_part ON IFS_journal_entries(part_id);

-- Activities indexes
CREATE INDEX idx_ifs_activities_user ON IFS_activities(user_id);
CREATE INDEX idx_ifs_activities_session ON IFS_activities(session_id);
CREATE INDEX idx_ifs_activities_status ON IFS_activities(status);

-- AI insights indexes
CREATE INDEX idx_ifs_ai_insights_user ON IFS_ai_insights(user_id);
CREATE INDEX idx_ifs_ai_insights_saved ON IFS_ai_insights(saved);

-- Media indexes
CREATE INDEX idx_ifs_media_user ON IFS_media(user_id);
CREATE INDEX idx_ifs_media_type ON IFS_media(type);

-- Lesson progress indexes
CREATE INDEX idx_ifs_lesson_progress_user ON IFS_lesson_progress(user_id);
CREATE INDEX idx_ifs_lesson_progress_lesson ON IFS_lesson_progress(lesson_id);

-- Protocol steps indexes
CREATE INDEX idx_ifs_protocol_steps_user ON IFS_protocol_steps(user_id);
CREATE INDEX idx_ifs_protocol_steps_activity ON IFS_protocol_steps(activity_id);

-- Wound profiles indexes
CREATE INDEX idx_ifs_wound_profiles_user ON IFS_wound_profiles(user_id);
CREATE INDEX idx_ifs_wound_profiles_type ON IFS_wound_profiles(wound_type);

-- Session messages indexes
CREATE INDEX idx_ifs_session_messages_session ON IFS_session_messages(session_id);
CREATE INDEX idx_ifs_session_messages_sender ON IFS_session_messages(sender_id);

-- Session goals indexes
CREATE INDEX idx_ifs_session_goals_therapist ON IFS_session_goals(therapist_id);
CREATE INDEX idx_ifs_session_goals_client ON IFS_session_goals(client_id);
CREATE INDEX idx_ifs_session_goals_status ON IFS_session_goals(status);

-- Therapist notes indexes
CREATE INDEX idx_ifs_therapist_notes_therapist ON IFS_therapist_notes(therapist_id);
CREATE INDEX idx_ifs_therapist_notes_client ON IFS_therapist_notes(client_id);
CREATE INDEX idx_ifs_therapist_notes_session ON IFS_therapist_notes(session_id);
CREATE INDEX idx_ifs_therapist_notes_date ON IFS_therapist_notes(session_date);

-- Anxiety check-ins indexes
CREATE INDEX idx_ifs_anxiety_checkins_user ON IFS_daily_anxiety_checkins(user_id);
CREATE INDEX idx_ifs_anxiety_checkins_date ON IFS_daily_anxiety_checkins(checkin_date);

-- =====================================================
-- FOREIGN KEY CONSTRAINTS
-- =====================================================

-- Sessions foreign keys
ALTER TABLE IFS_sessions ADD CONSTRAINT fk_sessions_therapist FOREIGN KEY (therapist_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_sessions ADD CONSTRAINT fk_sessions_client FOREIGN KEY (client_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Parts foreign keys
ALTER TABLE IFS_parts ADD CONSTRAINT fk_parts_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_parts ADD CONSTRAINT fk_parts_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;

-- Journal entries foreign keys
ALTER TABLE IFS_journal_entries ADD CONSTRAINT fk_journal_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_journal_entries ADD CONSTRAINT fk_journal_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;
ALTER TABLE IFS_journal_entries ADD CONSTRAINT fk_journal_part FOREIGN KEY (part_id) REFERENCES IFS_parts(id) ON DELETE CASCADE;

-- Activities foreign keys
ALTER TABLE IFS_activities ADD CONSTRAINT fk_activities_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_activities ADD CONSTRAINT fk_activities_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;

-- AI insights foreign keys
ALTER TABLE IFS_ai_insights ADD CONSTRAINT fk_ai_insights_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_ai_insights ADD CONSTRAINT fk_ai_insights_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;
ALTER TABLE IFS_ai_insights ADD CONSTRAINT fk_ai_insights_part FOREIGN KEY (part_id) REFERENCES IFS_parts(id) ON DELETE CASCADE;
ALTER TABLE IFS_ai_insights ADD CONSTRAINT fk_ai_insights_journal FOREIGN KEY (journal_entry_id) REFERENCES IFS_journal_entries(id) ON DELETE CASCADE;

-- Media foreign keys
ALTER TABLE IFS_media ADD CONSTRAINT fk_media_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_media ADD CONSTRAINT fk_media_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;

-- Lesson activities foreign keys
ALTER TABLE IFS_lesson_activities ADD CONSTRAINT fk_lesson_activities_lesson FOREIGN KEY (lesson_id) REFERENCES IFS_lessons(id) ON DELETE CASCADE;

-- Lesson progress foreign keys
ALTER TABLE IFS_lesson_progress ADD CONSTRAINT fk_lesson_progress_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_lesson_progress ADD CONSTRAINT fk_lesson_progress_lesson FOREIGN KEY (lesson_id) REFERENCES IFS_lessons(id) ON DELETE CASCADE;

-- Protocol steps foreign keys
ALTER TABLE IFS_protocol_steps ADD CONSTRAINT fk_protocol_steps_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_protocol_steps ADD CONSTRAINT fk_protocol_steps_activity FOREIGN KEY (activity_id) REFERENCES IFS_activities(id) ON DELETE CASCADE;
ALTER TABLE IFS_protocol_steps ADD CONSTRAINT fk_protocol_steps_lesson_activity FOREIGN KEY (lesson_activity_id) REFERENCES IFS_lesson_activities(id) ON DELETE CASCADE;

-- Wound profiles foreign keys
ALTER TABLE IFS_wound_profiles ADD CONSTRAINT fk_wound_profiles_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_wound_profiles ADD CONSTRAINT fk_wound_profiles_part FOREIGN KEY (part_id) REFERENCES IFS_parts(id) ON DELETE CASCADE;

-- Self assessments foreign keys
ALTER TABLE IFS_self_assessments ADD CONSTRAINT fk_self_assessments_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Session notes foreign keys
ALTER TABLE IFS_session_notes ADD CONSTRAINT fk_session_notes_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;
ALTER TABLE IFS_session_notes ADD CONSTRAINT fk_session_notes_author FOREIGN KEY (author_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Session messages foreign keys
ALTER TABLE IFS_session_messages ADD CONSTRAINT fk_session_messages_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;
ALTER TABLE IFS_session_messages ADD CONSTRAINT fk_session_messages_sender FOREIGN KEY (sender_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Protocol walkthroughs foreign keys
ALTER TABLE IFS_protocol_walkthroughs ADD CONSTRAINT fk_protocol_walkthroughs_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;

-- Session participants foreign keys
ALTER TABLE IFS_session_participants ADD CONSTRAINT fk_session_participants_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;
ALTER TABLE IFS_session_participants ADD CONSTRAINT fk_session_participants_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Daily anxiety check-ins foreign keys
ALTER TABLE IFS_daily_anxiety_checkins ADD CONSTRAINT fk_daily_anxiety_checkins_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Grounding technique progress foreign keys
ALTER TABLE IFS_grounding_technique_progress ADD CONSTRAINT fk_grounding_technique_progress_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Body sensations foreign keys
ALTER TABLE IFS_body_sensations ADD CONSTRAINT fk_body_sensations_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Anxiety timeline foreign keys
ALTER TABLE IFS_anxiety_timeline ADD CONSTRAINT fk_anxiety_timeline_user FOREIGN KEY (user_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Therapist assignments foreign keys
ALTER TABLE IFS_therapist_assignments ADD CONSTRAINT fk_therapist_assignments_therapist FOREIGN KEY (therapist_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_therapist_assignments ADD CONSTRAINT fk_therapist_assignments_client FOREIGN KEY (client_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Session goals foreign keys
ALTER TABLE IFS_session_goals ADD CONSTRAINT fk_session_goals_therapist FOREIGN KEY (therapist_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_session_goals ADD CONSTRAINT fk_session_goals_client FOREIGN KEY (client_id) REFERENCES IFS_users(id) ON DELETE CASCADE;

-- Therapist notes foreign keys
ALTER TABLE IFS_therapist_notes ADD CONSTRAINT fk_therapist_notes_therapist FOREIGN KEY (therapist_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_therapist_notes ADD CONSTRAINT fk_therapist_notes_client FOREIGN KEY (client_id) REFERENCES IFS_users(id) ON DELETE CASCADE;
ALTER TABLE IFS_therapist_notes ADD CONSTRAINT fk_therapist_notes_session FOREIGN KEY (session_id) REFERENCES IFS_sessions(id) ON DELETE CASCADE;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE IFS_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_lesson_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_protocol_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_wound_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_self_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_session_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_session_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_protocol_walkthroughs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_daily_anxiety_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_grounding_technique_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_body_sensations ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_anxiety_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_therapist_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_session_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IFS_therapist_notes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES (Note: Application uses localStorage auth)
-- These policies need to be adjusted based on your Supabase auth implementation
-- =====================================================

-- Public read access to lessons (educational content)
CREATE POLICY "Lessons are publicly readable" ON IFS_lessons FOR SELECT USING (true);
CREATE POLICY "Lesson activities are publicly readable" ON IFS_lesson_activities FOR SELECT USING (true);

-- Users can only read their own user record
CREATE POLICY "Users can read own data" ON IFS_users FOR SELECT USING (auth.uid()::text = id);
CREATE POLICY "Users can update own data" ON IFS_users FOR UPDATE USING (auth.uid()::text = id);

-- Parts: Users can manage their own parts
CREATE POLICY "Users can read own parts" ON IFS_parts FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own parts" ON IFS_parts FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own parts" ON IFS_parts FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own parts" ON IFS_parts FOR DELETE USING (auth.uid()::text = user_id);

-- Journal entries: Users can manage their own entries
CREATE POLICY "Users can read own journal entries" ON IFS_journal_entries FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own journal entries" ON IFS_journal_entries FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own journal entries" ON IFS_journal_entries FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own journal entries" ON IFS_journal_entries FOR DELETE USING (auth.uid()::text = user_id);

-- Activities: Users can manage their own activities
CREATE POLICY "Users can read own activities" ON IFS_activities FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own activities" ON IFS_activities FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own activities" ON IFS_activities FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own activities" ON IFS_activities FOR DELETE USING (auth.uid()::text = user_id);

-- AI insights: Users can manage their own insights
CREATE POLICY "Users can read own AI insights" ON IFS_ai_insights FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own AI insights" ON IFS_ai_insights FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own AI insights" ON IFS_ai_insights FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own AI insights" ON IFS_ai_insights FOR DELETE USING (auth.uid()::text = user_id);

-- Media: Users can manage their own media
CREATE POLICY "Users can read own media" ON IFS_media FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own media" ON IFS_media FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own media" ON IFS_media FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own media" ON IFS_media FOR DELETE USING (auth.uid()::text = user_id);

-- Sessions: Therapists and clients can read their sessions
CREATE POLICY "Users can read their sessions" ON IFS_sessions FOR SELECT 
  USING (auth.uid()::text = therapist_id OR auth.uid()::text = client_id);
CREATE POLICY "Therapists can create sessions" ON IFS_sessions FOR INSERT 
  WITH CHECK (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists can update sessions" ON IFS_sessions FOR UPDATE 
  USING (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists can delete sessions" ON IFS_sessions FOR DELETE 
  USING (auth.uid()::text = therapist_id);

-- Session goals: Therapists can CRUD, clients can read and update progress
CREATE POLICY "Therapists and clients can read goals" ON IFS_session_goals FOR SELECT 
  USING (auth.uid()::text = therapist_id OR auth.uid()::text = client_id);
CREATE POLICY "Therapists can create goals" ON IFS_session_goals FOR INSERT 
  WITH CHECK (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists and clients can update goals" ON IFS_session_goals FOR UPDATE 
  USING (auth.uid()::text = therapist_id OR auth.uid()::text = client_id);
CREATE POLICY "Therapists can delete goals" ON IFS_session_goals FOR DELETE 
  USING (auth.uid()::text = therapist_id);

-- Therapist notes: Therapist-only access
CREATE POLICY "Therapists can read own notes" ON IFS_therapist_notes FOR SELECT 
  USING (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists can create notes" ON IFS_therapist_notes FOR INSERT 
  WITH CHECK (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists can update own notes" ON IFS_therapist_notes FOR UPDATE 
  USING (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists can delete own notes" ON IFS_therapist_notes FOR DELETE 
  USING (auth.uid()::text = therapist_id);

-- Lesson progress: Users can manage their own progress
CREATE POLICY "Users can read own lesson progress" ON IFS_lesson_progress FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own lesson progress" ON IFS_lesson_progress FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own lesson progress" ON IFS_lesson_progress FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Protocol steps: Users can manage their own protocol progress
CREATE POLICY "Users can read own protocol steps" ON IFS_protocol_steps FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own protocol steps" ON IFS_protocol_steps FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own protocol steps" ON IFS_protocol_steps FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Wound profiles: Users can manage their own wound profiles
CREATE POLICY "Users can read own wound profiles" ON IFS_wound_profiles FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own wound profiles" ON IFS_wound_profiles FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own wound profiles" ON IFS_wound_profiles FOR UPDATE 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own wound profiles" ON IFS_wound_profiles FOR DELETE 
  USING (auth.uid()::text = user_id);

-- Self assessments: Users can manage their own assessments
CREATE POLICY "Users can read own assessments" ON IFS_self_assessments FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own assessments" ON IFS_self_assessments FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own assessments" ON IFS_self_assessments FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Session notes: Participants can read/write based on visibility
CREATE POLICY "Participants can read session notes" ON IFS_session_notes FOR SELECT 
  USING (
    EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text))
    AND (visibility = 'shared' OR (visibility = 'therapist_only' AND author_role = 'therapist' AND author_id = auth.uid()::text))
  );
CREATE POLICY "Participants can create session notes" ON IFS_session_notes FOR INSERT 
  WITH CHECK (auth.uid()::text = author_id);
CREATE POLICY "Authors can update own session notes" ON IFS_session_notes FOR UPDATE 
  USING (auth.uid()::text = author_id);

-- Session messages: Participants can read/send messages
CREATE POLICY "Participants can read session messages" ON IFS_session_messages FOR SELECT 
  USING (EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text)));
CREATE POLICY "Participants can send session messages" ON IFS_session_messages FOR INSERT 
  WITH CHECK (auth.uid()::text = sender_id);

-- Protocol walkthroughs: Participants can access
CREATE POLICY "Participants can read protocol walkthroughs" ON IFS_protocol_walkthroughs FOR SELECT 
  USING (EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text)));
CREATE POLICY "Participants can create protocol walkthroughs" ON IFS_protocol_walkthroughs FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text)));
CREATE POLICY "Participants can update protocol walkthroughs" ON IFS_protocol_walkthroughs FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text)));

-- Session participants: Auto-managed
CREATE POLICY "Participants can read session participant list" ON IFS_session_participants FOR SELECT 
  USING (EXISTS (SELECT 1 FROM IFS_sessions WHERE id = session_id AND (therapist_id = auth.uid()::text OR client_id = auth.uid()::text)));
CREATE POLICY "Participants can join sessions" ON IFS_session_participants FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Participants can update own participation" ON IFS_session_participants FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Anxiety tracking: Users can manage their own data
CREATE POLICY "Users can read own anxiety checkins" ON IFS_daily_anxiety_checkins FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own anxiety checkins" ON IFS_daily_anxiety_checkins FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own anxiety checkins" ON IFS_daily_anxiety_checkins FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Grounding technique progress: Users can manage their own progress
CREATE POLICY "Users can read own grounding progress" ON IFS_grounding_technique_progress FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own grounding progress" ON IFS_grounding_technique_progress FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own grounding progress" ON IFS_grounding_technique_progress FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Body sensations: Users can manage their own data
CREATE POLICY "Users can read own body sensations" ON IFS_body_sensations FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own body sensations" ON IFS_body_sensations FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own body sensations" ON IFS_body_sensations FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Anxiety timeline: Users can manage their own timeline
CREATE POLICY "Users can read own anxiety timeline" ON IFS_anxiety_timeline FOR SELECT 
  USING (auth.uid()::text = user_id);
CREATE POLICY "Users can create own anxiety timeline" ON IFS_anxiety_timeline FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own anxiety timeline" ON IFS_anxiety_timeline FOR UPDATE 
  USING (auth.uid()::text = user_id);

-- Therapist assignments: Therapists can CRUD, clients can read and update
CREATE POLICY "Therapists and clients can read assignments" ON IFS_therapist_assignments FOR SELECT 
  USING (auth.uid()::text = therapist_id OR auth.uid()::text = client_id);
CREATE POLICY "Therapists can create assignments" ON IFS_therapist_assignments FOR INSERT 
  WITH CHECK (auth.uid()::text = therapist_id);
CREATE POLICY "Therapists and clients can update assignments" ON IFS_therapist_assignments FOR UPDATE 
  USING (auth.uid()::text = therapist_id OR auth.uid()::text = client_id);
CREATE POLICY "Therapists can delete assignments" ON IFS_therapist_assignments FOR DELETE 
  USING (auth.uid()::text = therapist_id);

-- =====================================================
-- MIGRATION COMPLETE
-- Total: 24 tables with IFS_ prefix
-- All enum types, indexes, and RLS enabled
-- Ready for Supabase deployment
-- =====================================================
