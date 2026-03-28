'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { locales } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const STATUS_OPTIONS = ['asylum', 'euCitizen', 'skilledWorker', 'student'] as const;

export default function OnboardingPage() {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Form data
  const [language, setLanguage] = useState('de');
  const [status, setStatus] = useState('');
  const [cityPlz, setCityPlz] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Load existing profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setLanguage(profile.language || 'de');
          if (profile.onboarding_done) {
            router.push('/dashboard');
          }
        }
      } else {
        router.push('/login');
      }
    };

    getUser();
  }, [router, supabase]);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          language,
          status: status === 'euCitizen' ? 'eu_citizen' : status === 'skilledWorker' ? 'skilled_worker' : status,
          city_plz: cityPlz,
          goal,
          onboarding_done: true,
        })
        .eq('id', userId);

      if (error) throw error;

      // Force a hard refresh to dashboard
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Error updating profile:', error);
      alert(error.message || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return language !== '';
      case 2:
        return status !== '';
      case 3:
        return cityPlz !== '';
      case 4:
        return goal !== '';
      default:
        return false;
    }
  };

  const progress = (step / 4) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader className="text-center">
            <div className="text-4xl mb-2">⚓</div>
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
            <CardDescription>
              {t('step')} {step} {t('of')} 4
            </CardDescription>
            <div className="mt-4">
              <Progress value={progress} />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Language */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('language.title')}
                  </h3>
                  <p className="text-gray-600">{t('language.description')}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {locales.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => setLanguage(loc.code)}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        language === loc.code
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="mb-1 flex items-center justify-center h-10">
                        {'flagImage' in loc && loc.flagImage ? (
                          <img
                            src={loc.flagImage}
                            alt={loc.name}
                            className="h-5 w-auto object-contain"
                          />
                        ) : (
                          <div className="text-3xl">{loc.flag}</div>
                        )}
                      </div>
                      <div className="text-sm font-medium">{loc.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Status */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('status.title')}
                  </h3>
                  <p className="text-gray-600">{t('status.description')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STATUS_OPTIONS.map((statusOption) => (
                    <button
                      key={statusOption}
                      onClick={() => setStatus(statusOption)}
                      className={`p-6 border-2 rounded-lg text-left transition-all ${
                        status === statusOption
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-semibold text-lg">
                        {t(`status.${statusOption}`)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('location.title')}
                  </h3>
                  <p className="text-gray-600">{t('location.description')}</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Label htmlFor="cityPlz">{t('location.cityPlz')}</Label>
                  <Input
                    id="cityPlz"
                    value={cityPlz}
                    onChange={(e) => setCityPlz(e.target.value)}
                    placeholder="Berlin 10115"
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    {t('goal.title')}
                  </h3>
                  <p className="text-gray-600">{t('goal.description')}</p>
                </div>
                <div className="max-w-md mx-auto">
                  <Label htmlFor="goal">{t('goal.title')}</Label>
                  <Input
                    id="goal"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder={t('goal.placeholder')}
                    className="mt-2"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                {t('back')}
              </Button>
              {step < 4 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  {t('next')}
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!canProceed() || loading}
                >
                  {loading ? t('common.loading') : t('finish')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
