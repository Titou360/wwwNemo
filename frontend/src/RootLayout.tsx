import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import CookieConsentInit from './components/ui/CookieConsent'

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
      else setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
  }, [pathname, hash])
  return null
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <CookieConsentInit />
      <ScrollToTop />
      <Header />
      <Outlet />
      <Footer />
    </ThemeProvider>
  )
}
