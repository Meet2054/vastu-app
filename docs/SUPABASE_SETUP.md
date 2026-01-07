# Supabase Setup Guide for Vastu App

This guide will walk you through setting up Supabase for the Vastu App licensing system.

## 📋 Prerequisites

1. Create a Supabase account at https://supabase.com
2. Create a new project

## 🗄️ Database Setup

### Step 1: Create Tables

Go to **SQL Editor** in your Supabase dashboard and run these queries:

#### 1. Profiles Table

```sql
-- Create profiles table (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_active boolean default false,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can read own profile"
  on profiles
  for select
  using (auth.uid() = id);

-- Policy: Service role can do everything (for admin operations)
create policy "Service role full access"
  on profiles
  for all
  using (auth.jwt()->>'role' = 'service_role');
```

#### 2. Activation Keys Table

```sql
-- Create activation_keys table
create table activation_keys (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  is_used boolean default false,
  used_by uuid references auth.users(id),
  used_on_device text,
  used_at timestamp,
  created_at timestamp default now()
);

-- Enable Row Level Security
alter table activation_keys enable row level security;

-- Policy: No direct user access (only through Edge Functions)
create policy "No direct access"
  on activation_keys
  for all
  using (false);
```

#### 3. Devices Table

```sql
-- Create devices table
create table devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  device_fingerprint text unique not null,
  activated_at timestamp default now()
);

-- Enable Row Level Security
alter table devices enable row level security;

-- Policy: Users can read their own devices
create policy "Users can read own devices"
  on devices
  for select
  using (auth.uid() = user_id);
```

#### 4. Projects Table

```sql
-- Create projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  data jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable Row Level Security
alter table projects enable row level security;

-- Policy: Users can CRUD their own projects
create policy "Users can read own projects"
  on projects
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on projects
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects
  for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects
  for delete
  using (auth.uid() = user_id);
```

### Step 2: Create Triggers

```sql
-- Auto-create profile when user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, is_active)
  values (new.id, new.email, false);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update timestamp trigger for projects
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_project_updated
  before update on projects
  for each row execute procedure public.handle_updated_at();
```

## 🔑 Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: https://xxxxx.supabase.co)
   - **Anon (public) Key** (long string starting with "eyJ...")

3. Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 👥 Creating Users (Admin Task)

### Method 1: Using Supabase Dashboard

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password
4. The profile will be auto-created with `is_active = false`

### Method 2: Using SQL

```sql
-- This requires service_role key (NEVER expose this in client!)
-- Use this in a secure admin panel or backend script

-- Create user (you'll need to do this via Supabase Auth Admin API)
-- The profile will be auto-created by the trigger
```

## 🔐 Generating Activation Keys (Admin Task)

Run this SQL to generate activation keys:

```sql
-- Generate a single activation key
insert into activation_keys (key)
values (
  -- Generate a random key (format: XXXX-XXXX-XXXX-XXXX)
  upper(
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4)
  )
)
returning key;

-- Generate multiple keys at once
insert into activation_keys (key)
select 
  upper(
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4) || '-' ||
    substring(md5(random()::text) from 1 for 4)
  )
from generate_series(1, 10) -- Generate 10 keys
returning key;
```

## 🔄 Admin Queries

### Check activation key status

```sql
select 
  key,
  is_used,
  used_by,
  used_on_device,
  used_at,
  created_at
from activation_keys
order by created_at desc;
```

### Find unused keys

```sql
select key, created_at
from activation_keys
where is_used = false
order by created_at desc;
```

### View user devices

```sql
select 
  p.email,
  d.device_fingerprint,
  d.activated_at
from devices d
join profiles p on p.id = d.user_id
order by d.activated_at desc;
```

### Reset user (deactivate account)

```sql
-- WARNING: This will require user to get a new activation key!
update profiles
set is_active = false
where email = 'user@example.com';

-- Optionally delete their device registration
delete from devices
where user_id = (
  select id from profiles where email = 'user@example.com'
);
```

## 📊 Testing

1. Create a test user in Supabase Auth
2. Generate an activation key
3. Try logging in with the app
4. Enter the activation key
5. Verify the key is marked as used in the database

## 🔒 Security Notes

1. **NEVER expose your service_role key** in the client
2. All user operations go through Row Level Security (RLS)
3. Activation keys can only be used through Edge Functions
4. Device fingerprints prevent app sharing
5. Users cannot see other users' data

## 🚀 Next Steps

After completing this setup:
1. Set up the Edge Function (see EDGE_FUNCTION_SETUP.md)
2. Test the entire flow
3. Create your admin tool for managing users and keys
