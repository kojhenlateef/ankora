'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { createClient } from '@/lib/supabase/client';
import { locales } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LogOut,
  User,
  MapPin,
  GraduationCap,
  Home,
  CheckSquare,
  CreditCard,
  Ticket,
  Edit,
  Plus,
  ExternalLink,
  Globe,
  MessageCircle,
  Phone,
  Mail
} from 'lucide-react';

type Profile = {
  id: string;
  email: string;
  language: string;
  status: string;
  city_plz: string | null;
  goal: string | null;
};

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

export function NewDashboardClient({
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const isCompleted = (itemId: number) => {
    return userProgress.some((p) => p.item_id === itemId && p.completed);
  };

  const completedCount = checklistItems.filter((item) => isCompleted(item.id)).length;
  const totalCount = checklistItems.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getStatusLabel = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'asylum': t('onboarding.status.asylum'),
      'eu_citizen': t('onboarding.status.euCitizen'),
      'skilled_worker': t('onboarding.status.skilledWorker'),
      'student': t('onboarding.status.student'),
    };
    return statusMap[status] || status;
  };

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  const handleLanguageChange = (newLocale: string) => {
    router.push('/dashboard', { locale: newLocale as any });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">⚓</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Ankora</h1>
                <p className="text-sm text-gray-500">{t('dashboard.welcome')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <div className="flex items-center gap-2">
                      {'flagImage' in currentLocale && currentLocale.flagImage ? (
                        <img
                          src={currentLocale.flagImage}
                          alt={currentLocale.name}
                          className="h-4 w-auto object-contain"
                        />
                      ) : (
                        <span className="text-base">{currentLocale.flag}</span>
                      )}
                      <Globe className="w-4 h-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {locales.map((loc) => (
                    <DropdownMenuItem
                      key={loc.code}
                      onClick={() => handleLanguageChange(loc.code)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-full">
                        {'flagImage' in loc && loc.flagImage ? (
                          <img
                            src={loc.flagImage}
                            alt={loc.name}
                            className="h-4 w-auto object-contain"
                          />
                        ) : (
                          <span className="text-lg">{loc.flag}</span>
                        )}
                        <span>{loc.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t('auth.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Profile Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <User className="w-4 h-4 inline mr-2" />
                Profil
              </CardTitle>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.email.split('@')[0]}</div>
              <p className="text-sm text-gray-500 mt-1">{getStatusLabel(profile.status)}</p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <MapPin className="w-4 h-4 inline mr-2" />
                Standort
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profile.city_plz || 'Nicht angegeben'}</div>
              <p className="text-sm text-gray-500 mt-1">Deine Stadt</p>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                <CheckSquare className="w-4 h-4 inline mr-2" />
                Fortschritt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="h-2 mt-2" />
              <p className="text-sm text-gray-500 mt-1">
                {completedCount} von {totalCount} erledigt
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Deutschkurs Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <GraduationCap className="w-5 h-5 mr-2 text-primary" />
                Deutschkurs finden
              </CardTitle>
              <CardDescription>Lerne Deutsch und verbessere deine Sprachkenntnisse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://www.bamf.de/DE/Themen/Integration/TraegerLehrkriterien/Integrationskurse/integrationskurse-node.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">BAMF Integrationskurse</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://www.vhs.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Volkshochschule (VHS)</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://www.dw.com/de/deutsch-lernen/s-2055"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Deutsche Welle - Kostenlos lernen</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </CardContent>
          </Card>

          {/* Wohnungssuche Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2 text-primary" />
                Wohnungssuche
              </CardTitle>
              <CardDescription>Finde eine Wohnung in deiner Stadt</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="https://www.immobilienscout24.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">ImmobilienScout24</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://www.wg-gesucht.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">WG-gesucht.de</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/c203"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">eBay Kleinanzeigen</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </CardContent>
          </Card>

          {/* Fahrkarten Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Ticket className="w-5 h-5 mr-2 text-primary" />
                Fahrkarten & ÖPNV
              </CardTitle>
              <CardDescription>Informationen zu öffentlichen Verkehrsmitteln</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Deutschland-Ticket</h4>
                <p className="text-sm text-blue-800">
                  Für 49€/Monat in ganz Deutschland fahren (Bus, Bahn, Regional)
                </p>
              </div>
              <a
                href="https://www.bahn.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Deutsche Bahn</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium">Google Maps - Fahrpläne</span>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </a>
            </CardContent>
          </Card>

          {/* Banken Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-primary" />
                  Meine Banken
                </CardTitle>
                <CardDescription>Verwalte deine Bankkonten</CardDescription>
              </div>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Hinzufügen
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Noch keine Bankkonten hinzugefügt</p>
                <p className="text-xs mt-1">Klicke auf "Hinzufügen" um ein Konto zu speichern</p>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-primary" />
                Support & Hilfe
              </CardTitle>
              <CardDescription>
                Sprich mit echten Menschen - wir helfen dir bei deinen Fragen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone Support */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-blue-900">Telefonische Beratung</h4>
                  </div>
                  <p className="text-sm text-blue-800 mb-3">
                    Montag - Freitag: 9:00 - 18:00 Uhr
                  </p>
                  <a
                    href="tel:+491234567890"
                    className="text-blue-600 font-medium hover:underline"
                  >
                    +49 123 456 7890
                  </a>
                </div>

                {/* Email Support */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-green-900">E-Mail Support</h4>
                  </div>
                  <p className="text-sm text-green-800 mb-3">
                    Antwort innerhalb von 24 Stunden
                  </p>
                  <a
                    href="mailto:support@ankora.de"
                    className="text-green-600 font-medium hover:underline"
                  >
                    support@ankora.de
                  </a>
                </div>

                {/* Chat Support */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <MessageCircle className="w-5 h-5 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-purple-900">Live Chat</h4>
                  </div>
                  <p className="text-sm text-purple-800 mb-3">
                    Sofortige Hilfe von unserem Team
                  </p>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700">
                    Chat starten
                  </Button>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold mb-3">Häufig gestellte Fragen</h4>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm">Wie beantrage ich eine Aufenthaltserlaubnis?</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm">Wo finde ich Deutschkurse in meiner Nähe?</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm">Wie eröffne ich ein Bankkonto?</span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Behörden Checklist - Full Width */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckSquare className="w-5 h-5 mr-2 text-primary" />
              {t('checklist.title')}
            </CardTitle>
            <CardDescription>
              {getStatusLabel(profile.status)} - {completedCount}/{totalCount} erledigt
            </CardDescription>
          </CardHeader>
          <CardContent>
            {checklistItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('dashboard.noItems')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {checklistItems.map((item) => {
                  const completed = isCompleted(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all ${
                        completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={completed}
                          readOnly
                          className="mt-1 w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                        />
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              completed ? 'text-green-900 line-through' : 'text-gray-900'
                            }`}
                          >
                            {item.order_index}. {item.title_de}
                          </h4>
                          {item.description_de && (
                            <p className="text-sm text-gray-600 mt-1">{item.description_de}</p>
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
