-- Supabase Database Setup Script for Shift Management System
-- Run these commands in your Supabase SQL Editor

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('admin', 'manager', 'staff')) DEFAULT 'staff',
  department TEXT NOT NULL,
  employee_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create departments table
CREATE TABLE public.departments (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  work_system TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create shifts table
CREATE TABLE public.shifts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  department TEXT NOT NULL,
  shift_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create requests table
CREATE TABLE public.requests (
  id SERIAL PRIMARY KEY,
  type TEXT CHECK (type IN ('vacation', 'substitute')) NOT NULL,
  staff_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  department TEXT NOT NULL,
  date DATE NOT NULL,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Set up Row Level Security (RLS) policies

-- Profiles policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Managers can view department profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles manager
      WHERE manager.id = auth.uid() 
      AND manager.role = 'manager'
      AND manager.department = profiles.department
    )
  );

-- Departments policies
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view departments" ON public.departments
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage departments" ON public.departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Shifts policies
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own shifts" ON public.shifts
  FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Managers can view department shifts" ON public.shifts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('manager', 'admin')
      AND (profiles.role = 'admin' OR profiles.department = shifts.department)
    )
  );

CREATE POLICY "Managers can manage department shifts" ON public.shifts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('manager', 'admin')
      AND (profiles.role = 'admin' OR profiles.department = shifts.department)
    )
  );

-- Requests policies
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can view own requests" ON public.requests
  FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Staff can create own requests" ON public.requests
  FOR INSERT WITH CHECK (auth.uid() = staff_id);

CREATE POLICY "Managers can view department requests" ON public.requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('manager', 'admin')
      AND (profiles.role = 'admin' OR profiles.department = requests.department)
    )
  );

CREATE POLICY "Managers can update department requests" ON public.requests
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('manager', 'admin')
      AND (profiles.role = 'admin' OR profiles.department = requests.department)
    )
  );

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, employee_id, department, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'New User'),
    COALESCE(NEW.raw_user_meta_data->>'employee_id', 'EMP000'),
    COALESCE(NEW.raw_user_meta_data->>'department', '未設定'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'staff')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
-- Note: This trigger may need to be created with admin privileges
-- If you get permission errors, you can create profiles manually through the signup process
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample departments
INSERT INTO public.departments (name, work_system, member_count) VALUES
  ('内科', '2交代', 12),
  ('外科', '3交代', 15),
  ('小児科', '2交代', 8),
  ('救急科', '3交代', 20),
  ('ICU', '3交代', 10);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON public.departments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON public.shifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_requests_updated_at BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_shifts_staff_id ON public.shifts(staff_id);
CREATE INDEX idx_shifts_department ON public.shifts(department);
CREATE INDEX idx_shifts_date ON public.shifts(date);
CREATE INDEX idx_requests_staff_id ON public.requests(staff_id);
CREATE INDEX idx_requests_department ON public.requests(department);
CREATE INDEX idx_requests_status ON public.requests(status);
CREATE INDEX idx_profiles_department ON public.profiles(department);
CREATE INDEX idx_profiles_role ON public.profiles(role);
