-- 段階1: 基本テーブルの作成
-- Supabase SQL Editor で実行してください

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
