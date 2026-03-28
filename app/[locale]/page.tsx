import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { locales } from '@/lib/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export default function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const t = useTranslations('landing');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-4xl w-full space-y-8 text-center">
        {/* Logo */}
        <div className="text-6xl mb-4">⚓</div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          {t('title')}
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>

        {/* Language Selection */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            {t('selectLanguage')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {locales.map((locale) => (
              <Link key={locale.code} href="/" locale={locale.code as any}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-6 text-center">
                    <div className="mb-2 flex items-center justify-center h-12">
                      {'flagImage' in locale && locale.flagImage ? (
                        <Image
                          src={locale.flagImage}
                          alt={locale.name}
                          width={48}
                          height={32}
                          className="object-contain"
                        />
                      ) : (
                        <div className="text-4xl">{locale.flag}</div>
                      )}
                    </div>
                    <div className="font-medium text-gray-900">
                      {locale.name}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Link href="/login">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              {t('login')}
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              {t('getStarted')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
