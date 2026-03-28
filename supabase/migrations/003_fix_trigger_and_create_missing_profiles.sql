-- Fix trigger and create missing profiles for existing users

-- First, check if trigger exists and drop it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Recreate the function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, language, onboarding_done)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    'de',
    false
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create profiles for any existing users that don't have one
INSERT INTO public.profiles (id, email, language, onboarding_done)
SELECT
  au.id,
  COALESCE(au.email, ''),
  'de',
  false
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- Show results
SELECT 'Profiles created/verified' as status, COUNT(*) as count FROM profiles;
