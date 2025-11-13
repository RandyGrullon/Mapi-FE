-- ============================================
-- MAPI AI - Complete Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TRIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  destination TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'planned', 'ongoing', 'completed', 'cancelled')),
  budget DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_dates ON public.trips(start_date, end_date);

-- ============================================
-- TRIP MEMBERS TABLE (for collaboration)
-- ============================================
CREATE TABLE IF NOT EXISTS public.trip_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  status TEXT NOT NULL DEFAULT 'accepted' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

CREATE INDEX idx_trip_members_trip_id ON public.trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON public.trip_members(user_id);

-- ============================================
-- ACCOMMODATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.accommodations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  address TEXT,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  nights INTEGER,
  cost DECIMAL(10,2),
  booking_reference TEXT,
  confirmation_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accommodations_trip_id ON public.accommodations(trip_id);

-- ============================================
-- TRANSPORTATION TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.transportation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('flight', 'car', 'train', 'bus', 'boat', 'other')),
  provider TEXT,
  departure_location TEXT,
  arrival_location TEXT,
  departure_time TIMESTAMPTZ,
  arrival_time TIMESTAMPTZ,
  booking_reference TEXT,
  confirmation_number TEXT,
  cost DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transportation_trip_id ON public.transportation(trip_id);
CREATE INDEX idx_transportation_type ON public.transportation(type);

-- ============================================
-- ACTIVITIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  cost DECIMAL(10,2),
  booking_reference TEXT,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activities_trip_id ON public.activities(trip_id);
CREATE INDEX idx_activities_start_time ON public.activities(start_time);

-- ============================================
-- BUDGET ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.budget_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid BOOLEAN DEFAULT FALSE,
  paid_by UUID REFERENCES public.users(id),
  paid_date TIMESTAMPTZ,
  split_method TEXT DEFAULT 'equal' CHECK (split_method IN ('equal', 'percentage', 'fixed', 'none')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_budget_items_trip_id ON public.budget_items(trip_id);
CREATE INDEX idx_budget_items_category ON public.budget_items(category);

-- ============================================
-- DRAFTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content JSONB NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('trip', 'itinerary', 'other')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drafts_user_id ON public.drafts(user_id);
CREATE INDEX idx_drafts_type ON public.drafts(type);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('trip_invite', 'trip_update', 'join_request', 'system', 'other')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  related_trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  related_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  action_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trip_members_updated_at BEFORE UPDATE ON public.trip_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_accommodations_updated_at BEFORE UPDATE ON public.accommodations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transportation_updated_at BEFORE UPDATE ON public.transportation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budget_items_updated_at BEFORE UPDATE ON public.budget_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drafts_updated_at BEFORE UPDATE ON public.drafts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Trips policies
CREATE POLICY "Users can view trips they own or are members of" ON public.trips
  FOR SELECT USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.status = 'accepted'
    )
  );

CREATE POLICY "Users can create their own trips" ON public.trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update trips they own or edit" ON public.trips
  FOR UPDATE USING (
    auth.uid() = user_id OR
    EXISTS (
      SELECT 1 FROM public.trip_members
      WHERE trip_members.trip_id = trips.id
      AND trip_members.user_id = auth.uid()
      AND trip_members.role IN ('owner', 'editor')
      AND trip_members.status = 'accepted'
    )
  );

CREATE POLICY "Users can delete trips they own" ON public.trips
  FOR DELETE USING (auth.uid() = user_id);

-- Trip members policies
CREATE POLICY "Users can view members of trips they belong to" ON public.trip_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_members.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members tm2
                   WHERE tm2.trip_id = trips.id
                   AND tm2.user_id = auth.uid()
                   AND tm2.status = 'accepted'))
    )
  );

CREATE POLICY "Trip owners can manage members" ON public.trip_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = trip_members.trip_id
      AND trips.user_id = auth.uid()
    )
  );

-- Accommodations policies
CREATE POLICY "Users can view accommodations for their trips" ON public.accommodations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = accommodations.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.status = 'accepted'))
    )
  );

CREATE POLICY "Users can manage accommodations for trips they can edit" ON public.accommodations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = accommodations.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.role IN ('owner', 'editor')
                   AND trip_members.status = 'accepted'))
    )
  );

-- Transportation policies (same pattern as accommodations)
CREATE POLICY "Users can view transportation for their trips" ON public.transportation
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = transportation.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.status = 'accepted'))
    )
  );

CREATE POLICY "Users can manage transportation for trips they can edit" ON public.transportation
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = transportation.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.role IN ('owner', 'editor')
                   AND trip_members.status = 'accepted'))
    )
  );

-- Activities policies (same pattern)
CREATE POLICY "Users can view activities for their trips" ON public.activities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = activities.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.status = 'accepted'))
    )
  );

CREATE POLICY "Users can manage activities for trips they can edit" ON public.activities
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = activities.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.role IN ('owner', 'editor')
                   AND trip_members.status = 'accepted'))
    )
  );

-- Budget items policies
CREATE POLICY "Users can view budget items for their trips" ON public.budget_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = budget_items.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.status = 'accepted'))
    )
  );

CREATE POLICY "Users can manage budget items for trips they can edit" ON public.budget_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips
      WHERE trips.id = budget_items.trip_id
      AND (trips.user_id = auth.uid() OR
           EXISTS (SELECT 1 FROM public.trip_members
                   WHERE trip_members.trip_id = trips.id
                   AND trip_members.user_id = auth.uid()
                   AND trip_members.role IN ('owner', 'editor')
                   AND trip_members.status = 'accepted'))
    )
  );

-- Drafts policies
CREATE POLICY "Users can view their own drafts" ON public.drafts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own drafts" ON public.drafts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own drafts" ON public.drafts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own drafts" ON public.drafts
  FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
  FOR DELETE USING (auth.uid() = user_id);

-- System can create notifications
CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to create a user profile when they sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_trips_user_status ON public.trips(user_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_accommodations_dates ON public.accommodations(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_transportation_times ON public.transportation(departure_time, arrival_time);

-- ============================================
-- COMPLETED
-- ============================================
-- Schema migration complete!