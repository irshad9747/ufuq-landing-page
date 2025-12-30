import Nav from './components/Nav'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Objectives from './components/Objectives'
import Events from './components/Events'
import Speakers from './components/Speakers'
import RecentActivity from './components/RecentActivity'
import QuoteSection from './components/QuoteSection'
import Footer from './components/Footer'

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
        <Objectives />
        <Events />
        <Speakers />
        <RecentActivity />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  )
}

export default App

