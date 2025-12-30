import { useState, useEffect, useCallback, useMemo } from 'react'
import { smoothScrollTo } from '../utils/smoothScroll'
import { getImagePath } from '../utils/imagePath'
import StaggeredMenu from './StaggeredMenu'
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
    { id: 'events', label: 'Event' },
    { id: 'speakers', label: 'Speaker' },
    { id: 'recent-activity', label: 'Past Events' },
    { id: 'contact', label: 'Contact' },
  ], [])

  const menuItems = useMemo(() => navLinks.map(link => ({
    label: link.label,
    ariaLabel: `Go to ${link.label} section`,
    link: `#${link.id}`,
    onClick: (e) => {
      e.preventDefault()
      handleNavClick(e, link.id)
    }
  })), [navLinks, handleNavClick])

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
      <nav className="hidden md:block fixed top-0 w-full z-[10000]" role="navigation" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo - Left */}
          <a 
            href="#home" 
            onClick={(e) => handleNavClick(e, 'home')} 
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
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
                className={`hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 ${
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
            href="#" 
            className="btn-primary px-6 py-2.5 rounded-full text-white font-semibold tracking-wide focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a]"
            aria-label="Register for UFUQ 2026"
          >
            Register Now
          </a>
        </div>
      </nav>

      {/* Mobile Staggered Menu */}
      <div className="md:hidden">
        <StaggeredMenu
          position="right"
          items={menuItems}
          displaySocials={false}
          displayItemNumbering={true}
          menuButtonColor="#fff"
          openMenuButtonColor="#fff"
          changeMenuColorOnOpen={true}
          colors={['#03030a', '#1a1a2e', '#16213e']}
          logoUrl={getImagePath('/icons/ufuq-logo.webp')}
          accentColor="#6C63FF"
          isFixed={true}
          closeOnClickAway={true}
          onMenuOpen={() => setIsMenuOpen(true)}
          onMenuClose={() => setIsMenuOpen(false)}
        />
      </div>
    </>
  )
}

export default Nav

