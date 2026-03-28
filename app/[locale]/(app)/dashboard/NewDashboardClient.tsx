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

  // Get local transport authority based on city
  const getTransportAuthority = () => {
    const city = profile.city_plz?.toLowerCase() || '';

    // Major German transport authorities
    if (city.includes('berlin')) {
      return { name: 'BVG', fullName: 'Berliner Verkehrsbetriebe', url: 'https://www.bvg.de', color: 'from-yellow-400 to-yellow-600' };
    } else if (city.includes('hamburg')) {
      return { name: 'HVV', fullName: 'Hamburger Verkehrsverbund', url: 'https://www.hvv.de', color: 'from-red-400 to-red-600' };
    } else if (city.includes('münchen') || city.includes('munich')) {
      return { name: 'MVG', fullName: 'Münchner Verkehrsgesellschaft', url: 'https://www.mvg.de', color: 'from-blue-400 to-blue-600' };
    } else if (city.includes('köln') || city.includes('cologne')) {
      return { name: 'KVB', fullName: 'Kölner Verkehrs-Betriebe', url: 'https://www.kvb.koeln', color: 'from-red-500 to-pink-600' };
    } else if (city.includes('frankfurt')) {
      return { name: 'RMV', fullName: 'Rhein-Main-Verkehrsverbund', url: 'https://www.rmv.de', color: 'from-blue-500 to-indigo-600' };
    } else if (city.includes('stuttgart')) {
      return { name: 'VVS', fullName: 'Verkehrs- und Tarifverbund Stuttgart', url: 'https://www.vvs.de', color: 'from-green-500 to-emerald-600' };
    } else if (city.includes('düsseldorf') || city.includes('dusseldorf')) {
      return { name: 'VRR', fullName: 'Verkehrsverbund Rhein-Ruhr', url: 'https://www.vrr.de', color: 'from-blue-600 to-purple-600' };
    } else if (city.includes('hannover')) {
      return { name: 'GVH', fullName: 'Großraum-Verkehr Hannover', url: 'https://www.gvh.de', color: 'from-orange-400 to-red-500' };
    } else if (city.includes('bremen')) {
      return { name: 'VBN', fullName: 'Verkehrsverbund Bremen/Niedersachsen', url: 'https://www.vbn.de', color: 'from-green-400 to-teal-600' };
    } else if (city.includes('nürnberg') || city.includes('nuremberg')) {
      return { name: 'VGN', fullName: 'Verkehrsverbund Großraum Nürnberg', url: 'https://www.vgn.de', color: 'from-red-400 to-orange-600' };
    } else if (city.includes('leipzig')) {
      return { name: 'MDV', fullName: 'Mitteldeutscher Verkehrsverbund', url: 'https://www.mdv.de', color: 'from-yellow-500 to-orange-600' };
    } else if (city.includes('dresden')) {
      return { name: 'VVO', fullName: 'Verkehrsverbund Oberelbe', url: 'https://www.vvo-online.de', color: 'from-blue-400 to-cyan-600' };
    } else {
      return { name: 'DB', fullName: 'Deutsche Bahn', url: 'https://www.bahn.de', color: 'from-red-600 to-gray-700' };
    }
  };

  const transportAuthority = getTransportAuthority();

  const currentLocale = locales.find(l => l.code === locale) || locales[0];

  const handleLanguageChange = (newLocale: string) => {
    router.push('/dashboard', { locale: newLocale as any });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-xl shadow-lg">
                <span className="text-2xl">⚓</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Ankora</h1>
                <p className="text-sm text-gray-600">{t('dashboard.welcome')}</p>
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
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-purple-50 to-white shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                {t('dashboard.profile')}
              </CardTitle>
              <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                <Edit className="w-4 h-4 text-purple-600" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">{profile.email.split('@')[0]}</div>
              <p className="text-sm text-purple-600 mt-1">{getStatusLabel(profile.status)}</p>
            </CardContent>
          </Card>

          {/* Location Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-blue-50 to-white shadow-lg hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                {t('dashboard.location')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">{profile.city_plz || t('dashboard.notProvided')}</div>
              <p className="text-sm text-blue-600 mt-1">{t('dashboard.yourCity')}</p>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-green-50 to-white shadow-lg hover:scale-105">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckSquare className="w-4 h-4 text-green-600" />
                </div>
                {t('dashboard.progress')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">{Math.round(progressPercentage)}%</div>
              <Progress value={progressPercentage} className="h-3 mt-2" />
              <p className="text-sm text-green-600 mt-1">
                {completedCount} {t('dashboard.completedOf', { total: totalCount })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Deutschkurs Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-orange-600" />
                </div>
                <span className="bg-gradient-to-r from-orange-700 to-amber-700 bg-clip-text text-transparent">
                  {t('dashboard.germanCourses.title')}
                </span>
              </CardTitle>
              <CardDescription className="text-orange-700">{t('dashboard.germanCourses.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <a
                href="https://www.bamf.de/DE/Themen/Integration/TraegerLehrkriterien/Integrationskurse/integrationskurse-node.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all border border-orange-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-orange-700">{t('dashboard.germanCourses.bamf')}</span>
                <ExternalLink className="w-4 h-4 text-orange-400 group-hover:text-orange-600" />
              </a>
              <a
                href="https://www.vhs.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all border border-orange-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-orange-700">{t('dashboard.germanCourses.vhs')}</span>
                <ExternalLink className="w-4 h-4 text-orange-400 group-hover:text-orange-600" />
              </a>
              <a
                href="https://www.dw.com/de/deutsch-lernen/s-2055"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all border border-orange-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-orange-700">{t('dashboard.germanCourses.dw')}</span>
                <ExternalLink className="w-4 h-4 text-orange-400 group-hover:text-orange-600" />
              </a>
            </CardContent>
          </Card>

          {/* Wohnungssuche Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Home className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                  {t('dashboard.housing.title')}
                </span>
              </CardTitle>
              <CardDescription className="text-emerald-700">{t('dashboard.housing.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              <a
                href="https://www.immobilienscout24.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-700">ImmobilienScout24</span>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" />
              </a>
              <a
                href="https://www.wg-gesucht.de/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-700">WG-gesucht.de</span>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" />
              </a>
              <a
                href="https://www.ebay-kleinanzeigen.de/s-wohnung-mieten/c203"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl hover:from-emerald-100 hover:to-teal-100 transition-all border border-emerald-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-emerald-700">eBay Kleinanzeigen</span>
                <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" />
              </a>
            </CardContent>
          </Card>

          {/* Fahrkarten Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <Ticket className="w-5 h-5 text-sky-600" />
                </div>
                <span className="bg-gradient-to-r from-sky-700 to-blue-700 bg-clip-text text-transparent">
                  {t('dashboard.transport.title')}
                </span>
              </CardTitle>
              <CardDescription className="text-sky-700">{t('dashboard.transport.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {/* Local Transport Authority - Dynamic based on city */}
              <a
                href={transportAuthority.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <div className={`p-4 bg-gradient-to-r ${transportAuthority.color} rounded-xl border-2 border-white shadow-lg hover:shadow-xl transition-all group`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-white text-xl">{transportAuthority.name}</h4>
                    <ExternalLink className="w-5 h-5 text-white/80 group-hover:text-white" />
                  </div>
                  <p className="text-sm text-white/90">
                    {transportAuthority.fullName}
                  </p>
                </div>
              </a>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">{t('dashboard.transport.deutschlandTicket')}</h4>
                <p className="text-sm text-blue-800">
                  {t('dashboard.transport.deutschlandTicketDesc')}
                </p>
              </div>

              <a
                href="https://www.google.com/maps"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl hover:from-sky-100 hover:to-blue-100 transition-all border border-sky-100 group"
              >
                <span className="font-medium text-gray-700 group-hover:text-sky-700">{t('dashboard.transport.maps')}</span>
                <ExternalLink className="w-4 h-4 text-sky-400 group-hover:text-sky-600" />
              </a>
            </CardContent>
          </Card>

          {/* Banken Section */}
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-lg">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                    {t('dashboard.banks.title')}
                  </span>
                </CardTitle>
                <CardDescription className="text-indigo-700">{t('dashboard.banks.description')}</CardDescription>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white border-0 shadow-md">
                <Plus className="w-4 h-4 mr-1" />
                {t('dashboard.banks.add')}
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <CreditCard className="w-10 h-10 text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-gray-700">{t('dashboard.banks.noBanks')}</p>
                <p className="text-xs mt-1 text-gray-500">{t('dashboard.banks.addBank')}</p>
              </div>
            </CardContent>
          </Card>

          {/* Support Section */}
          <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-rose-600" />
                </div>
                <span className="bg-gradient-to-r from-rose-700 to-pink-700 bg-clip-text text-transparent">
                  {t('dashboard.support.title')}
                </span>
              </CardTitle>
              <CardDescription className="text-rose-700">
                {t('dashboard.support.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Phone Support */}
                <div className="p-5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg">{t('dashboard.support.phone.title')}</h4>
                  </div>
                  <p className="text-sm text-blue-100 mb-3">
                    {t('dashboard.support.phone.hours')}
                  </p>
                  <a
                    href="tel:+491234567890"
                    className="text-white font-bold hover:underline block text-lg"
                  >
                    +49 123 456 7890
                  </a>
                </div>

                {/* Email Support */}
                <div className="p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Mail className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg">{t('dashboard.support.email.title')}</h4>
                  </div>
                  <p className="text-sm text-green-100 mb-3">
                    {t('dashboard.support.email.response')}
                  </p>
                  <a
                    href="mailto:support@ankora.de"
                    className="text-white font-bold hover:underline block"
                  >
                    support@ankora.de
                  </a>
                </div>

                {/* Chat Support */}
                <div className="p-5 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg">{t('dashboard.support.chat.title')}</h4>
                  </div>
                  <p className="text-sm text-purple-100 mb-4">
                    {t('dashboard.support.chat.description')}
                  </p>
                  <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm font-semibold">
                    {t('dashboard.support.chat.start')}
                  </Button>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-6 pt-6 border-t border-rose-100">
                <h4 className="font-bold text-gray-800 mb-4 text-lg">{t('dashboard.support.faq.title')}</h4>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all border border-rose-100 group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-rose-700">{t('dashboard.support.faq.residence')}</span>
                    <ExternalLink className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all border border-rose-100 group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-rose-700">{t('dashboard.support.faq.courses')}</span>
                    <ExternalLink className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
                  </a>
                  <a
                    href="#"
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl hover:from-rose-100 hover:to-pink-100 transition-all border border-rose-100 group"
                  >
                    <span className="text-sm font-medium text-gray-700 group-hover:text-rose-700">{t('dashboard.support.faq.bank')}</span>
                    <ExternalLink className="w-4 h-4 text-rose-400 group-hover:text-rose-600" />
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Behörden Checklist - Full Width */}
        <Card className="mt-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-violet-100 rounded-lg">
                <CheckSquare className="w-5 h-5 text-violet-600" />
              </div>
              <span className="bg-gradient-to-r from-violet-700 to-purple-700 bg-clip-text text-transparent">
                {t('checklist.title')}
              </span>
            </CardTitle>
            <CardDescription className="text-violet-700">
              {getStatusLabel(profile.status)} - {completedCount}/{totalCount} {t('checklist.completed').toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {checklistItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('dashboard.noItems')}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {checklistItems.map((item) => {
                  const completed = isCompleted(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-5 rounded-xl transition-all border-2 ${
                        completed
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-sm'
                          : 'bg-white border-gray-200 hover:border-violet-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`mt-1 p-1 rounded-lg ${completed ? 'bg-green-200' : 'bg-gray-100'}`}>
                          <input
                            type="checkbox"
                            checked={completed}
                            readOnly
                            className="w-5 h-5 text-green-600 bg-transparent border-0 rounded focus:ring-green-500 cursor-pointer"
                          />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-semibold text-base ${
                              completed ? 'text-green-800 line-through' : 'text-gray-900'
                            }`}
                          >
                            {item.order_index}. {item.title_de}
                          </h4>
                          {item.description_de && (
                            <p className={`text-sm mt-2 ${completed ? 'text-green-700' : 'text-gray-600'}`}>
                              {item.description_de}
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
