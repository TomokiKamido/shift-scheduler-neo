-- 段階2: RLS (Row Level Security) ポリシーの設定
-- 段階1完了後に実行してください

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
