import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['de', 'en', 'tr', 'ar', 'ku-sorani', 'ku-kurmanji', 'fa'],
  defaultLocale: 'de',
  localePrefix: 'always'
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
