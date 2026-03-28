'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LogOut } from 'lucide-react';

type ChecklistItem = {
  id: number;
  status_type: string;
  order_index: number;
  title_de: string;
  title_en: string;
  title_tr: string;
  title_ar: string;
  title_ku_sorani: string;
  title_ku_kurmanji: string;
  title_fa: string;
  description_de: string | null;
  description_en: string | null;
  description_tr: string | null;
  description_ar: string | null;
  description_ku_sorani: string | null;
  description_ku_kurmanji: string | null;
  description_fa: string | null;
};

type UserProgress = {
  id: number;
  user_id: string;
  item_id: number;
  completed: boolean;
};

type Profile = {
  id: string;
  email: string;
  language: string;
  status: string;
  city_plz: string | null;
  goal: string | null;
};

export function DashboardClient({
  profile,
  checklistItems,
  userProgress: initialProgress,
  locale,
}: {
  profile: Profile;
  checklistItems: ChecklistItem[];
  userProgress: UserProgress[];
  locale: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const supabase = createClient();
  const [userProgress, setUserProgress] = useState(initialProgress);
  const [loading, setLoading] = useState<number | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getItemTitle = (item: ChecklistItem) => {
    const localeKey = locale.replace('-', '_');
    const titleKey = `title_${localeKey}` as keyof ChecklistItem;
    return (item[titleKey] as string) || item.title_en;
  };

  const getItemDescription = (item: ChecklistItem) => {
    const localeKey = locale.replace('-', '_');
    const descKey = `description_${localeKey}` as keyof ChecklistItem;
    return (item[descKey] as string) || item.description_en;
  };

  const isCompleted = (itemId: number) => {
    return userProgress.some((p) => p.item_id === itemId && p.completed);
  };

  const toggleItem = async (itemId: number) => {
    setLoading(itemId);
    const currentStatus = isCompleted(itemId);
    const progressItem = userProgress.find((p) => p.item_id === itemId);

    try {
      if (progressItem) {
        // Update existing
        const { error } = await supabase
          .from('user_checklist_progress')
          .update({ completed: !currentStatus })
          .eq('id', progressItem.id);

        if (error) throw error;

        setUserProgress(
          userProgress.map((p) =>
            p.id === progressItem.id ? { ...p, completed: !currentStatus } : p
          )
        );
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('user_checklist_progress')
          .insert({
            user_id: profile.id,
            item_id: itemId,
            completed: true,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setUserProgress([...userProgress, data]);
        }
      }
    } catch (error) {
      console.error('Error toggling item:', error);
    } finally {
      setLoading(null);
    }
  };

  const completedCount = checklistItems.filter((item) =>
    isCompleted(item.id)
  ).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">⚓</span>
            <h1 className="text-2xl font-bold text-gray-900">Ankora</h1>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('auth.logout')}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('dashboard.welcome')}, {profile.email.split('@')[0]}!
          </h2>
          {profile.city_plz && (
            <p className="text-gray-600">
              {profile.city_plz}
            </p>
          )}
          {profile.goal && (
            <p className="text-gray-600 mt-1">
              🎯 {profile.goal}
            </p>
          )}
        </div>

        {/* Progress Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('dashboard.yourProgress')}</CardTitle>
            <CardDescription>
              {completedCount} {t('checklist.of')} {totalCount} {t('checklist.completed')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {Math.round(progressPercentage)}% {t('checklist.progress')}
            </p>
          </CardContent>
        </Card>

        {/* Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>{t('checklist.title')}</CardTitle>
            <CardDescription>
              {t('dashboard.checklist')} - {t(`onboarding.status.${profile.status}`)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checklistItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {t('dashboard.noItems')}
              </p>
            ) : (
              <div className="space-y-4">
                {checklistItems.map((item) => {
                  const completed = isCompleted(item.id);
                  const isLoading = loading === item.id;

                  return (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all ${
                        completed
                          ? 'bg-green-50 border-green-200'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="pt-1">
                          <input
                            type="checkbox"
                            checked={completed}
                            onChange={() => toggleItem(item.id)}
                            disabled={isLoading}
                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              completed
                                ? 'text-green-900 line-through'
                                : 'text-gray-900'
                            }`}
                          >
                            {item.order_index}. {getItemTitle(item)}
                          </h4>
                          {getItemDescription(item) && (
                            <p className="text-sm text-gray-600 mt-1">
                              {getItemDescription(item)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
