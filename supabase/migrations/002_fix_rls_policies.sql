-- Fix RLS policies and add automatic profile creation trigger

-- Drop the existing restrictive insert policy
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create a better policy that works with the trigger
CREATE POLICY "Enable insert for authenticated users only"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create a function to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, language, onboarding_done)
  VALUES (new.id, new.email, 'de', false);
  RETURN new;
END;
$$;

-- Create a trigger that calls the function when a new user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
