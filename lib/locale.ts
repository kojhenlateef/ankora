export const locales = [
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'ku-sorani', name: 'کوردی (سۆرانی)', flag: '🏳️', flagImage: '/flags/kurdistan.png', dir: 'rtl' },
  { code: 'ku-kurmanji', name: 'Kurdî (Kurmancî)', flag: '🏳️', flagImage: '/flags/kurdistan.png', dir: 'ltr' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', dir: 'rtl' },
] as const;

export type LocaleCode = typeof locales[number]['code'];

export function getLocaleDirection(locale: string): 'rtl' | 'ltr' {
  const rtlLocales = ['ar', 'ku-sorani', 'fa'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}
