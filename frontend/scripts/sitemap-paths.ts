import { SERVICES_LOCAL } from '../src/data/localPages'
import { CITIES } from '../src/data/cities'

const STATIC_PATHS = [
  '/',
  '/contactez-nous',
  '/faq',
  '/prendre-rdv',
  '/mentions-legales',
  '/politique-de-confidentialite',
  '/pages-locales',
]

export function getPublicPaths(): string[] {
  const local = SERVICES_LOCAL.flatMap((s) =>
    CITIES.map((c) => `/pages-locales/${s.slug}/${c.slug}`),
  )
  return [...STATIC_PATHS, ...local]
}
