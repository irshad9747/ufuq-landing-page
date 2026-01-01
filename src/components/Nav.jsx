import { useState, useEffect, useCallback, useMemo } from 'react'
import { smoothScrollTo } from '../utils/smoothScroll'
import { getImagePath } from '../utils/imagePath'
import GradualBlur from './GradualBlur'

const SECTIONS = ['home', 'about', 'events', 'speakers', 'recent-activity', 'contact']
const SCROLL_OFFSET = 100

const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const handleNavClick = useCallback((e, sectionId) => {
    e.preventDefault()
    setIsMenuOpen(false)
    smoothScrollTo(sectionId, 80)
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + SCROLL_OFFSET

      for (const section of SECTIONS) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return

    const handleClickOutside = (e) => {
      if (!e.target.closest('nav')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  const navLinks = useMemo(() => [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'events', label: 'Events' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'recent-activity', label: 'Past Events' },
    { id: 'contact', label: 'Contact' },
  ], [])

  return (
    <>
      {/* Gradual Blur at Top */}
      <GradualBlur
        target="page"
        position="top"
        height="8rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      {/* Desktop Navigation */}
      <nav className="hidden min-[935px]:block fixed top-0 w-full z-[10000]" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo - Left */}
          <a 
            href="#home" 
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Go to home section"
          >
            <img src={getImagePath('/icons/ufuq-logo.webp')} alt="UFUQ Logo" className="h-[50px]" />
          </a>
          
          {/* Navigation Links - Center */}
          <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 items-center text-sm font-medium text-gray-400">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`hover:text-white transition-colors focus:outline-none px-2 ${
                  activeSection === link.id ? 'text-white' : ''
                }`}
                aria-current={activeSection === link.id ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
          
          {/* Register Button - Right */}
          <a 
            href="https://ufuqstfsiokerala.eventhex.ai/#tickets"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-6 py-2.5 rounded-full text-white font-semibold tracking-wide focus:outline-none"
            aria-label="Register for UFUQ 2026"
          >
            Register Now
          </a>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="max-[934px]:block min-[935px]:hidden fixed top-0 w-full z-[10000]" role="navigation" aria-label="Mobile navigation">
        <div className="px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#home" 
            className="flex items-center gap-2 focus:outline-none"
            aria-label="Go to home section"
          >
            <img src={getImagePath('/icons/ufuq-logo.webp')} alt="UFUQ Logo" className="h-[50px]" />
          </a>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`burger relative z-[10001] focus:outline-none ${isMenuOpen ? 'active' : ''}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div 
          className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 z-[9999] ${
            isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />

        {/* Mobile Menu Slide Panel */}
        <div 
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-gradient-to-b from-[rgba(15,15,25,0.98)] to-[rgba(10,10,20,0.98)] backdrop-blur-xl border-l border-[rgba(108,99,255,0.2)] shadow-2xl z-[10000] transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="px-6 py-8 flex flex-col gap-4 h-full overflow-y-auto">
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleNavClick(e, link.id)}
                className={`text-lg font-semibold transition-colors focus:outline-none py-2 ${
                  activeSection === link.id ? 'text-white' : 'text-gray-400 hover:text-white'
                }`}
                aria-current={activeSection === link.id ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
            <a 
              href="https://ufuqstfsiokerala.eventhex.ai/#tickets"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-6 py-2.5 rounded-full text-white font-semibold tracking-wide focus:outline-none text-center mt-4"
              aria-label="Register for UFUQ 2026"
            >
              Register Now
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Nav

