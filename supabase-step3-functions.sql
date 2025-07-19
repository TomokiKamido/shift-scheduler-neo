-- 段階3: トリガー関数とサンプルデータ
-- 段階2完了後に実行してください

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
