import { redirect } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DashboardClient } from './DashboardClient';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile?.onboarding_done) {
    redirect('/onboarding');
  }

  // Fetch checklist items based on user status
  const { data: checklistItems } = await supabase
    .from('checklist_items')
    .select('*')
    .eq('status_type', profile.status)
    .order('order_index');

  // Fetch user progress
  const { data: userProgress } = await supabase
    .from('user_checklist_progress')
    .select('*')
    .eq('user_id', user.id);

  return (
    <DashboardClient
      profile={profile}
      checklistItems={checklistItems || []}
      userProgress={userProgress || []}
      locale={locale}
    />
  );
}
