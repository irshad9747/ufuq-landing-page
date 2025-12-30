import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stats from './components/Stats'

// Lazy load below-the-fold components for better initial load performance
const Objectives = lazy(() => import('./components/Objectives'))
const Events = lazy(() => import('./components/Events'))
const Speakers = lazy(() => import('./components/Speakers'))
const RecentActivity = lazy(() => import('./components/RecentActivity'))
const QuoteSection = lazy(() => import('./components/QuoteSection'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  return (
    <div className="App">
      <a href="#home" className="skip-to-content">
        Skip to main content
      </a>
      <div className="bg-glow" aria-hidden="true"></div>
      <Nav />
      <main id="main-content">
        <Hero />
        <Stats />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Objectives />
          <Events />
          <Speakers />
          <RecentActivity />
          <QuoteSection />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  )
}

export default App

