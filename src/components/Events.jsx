import { useState, memo, useMemo } from 'react'
import { useReveal } from '../hooks/useReveal'
import EventCarousel from './EventCarousel'

const EVENTS = [
    {
      type: 'Pre Event',
      level: 'All Level',
      title: 'Exploring Intersections of Science, Technology, Society & Theology - Summer School',
      speakers: ['Dr. Abdussalam Ahmad', 'Dr. Arun Ashokan', 'Dr. Sunandan KN', 'Dr. Sadiq Mampad', 'Dr. Badeeuzzaman', 'Wafa Razak', 'TP Muhammad Shameem'],
      date: '27, 28, 29 May 2025',
      location: 'Al Jamia Al Islamia Santhapuram',
      duration: '03 Days'
    },
    {
      type: 'Pre Event',
      level: 'All Level',
      title: 'Workshop on Aqeeda, Philosophy and Science: Navigating Technology in the Modern Era',
      speakers: ['Thafasal Ijyas', 'Shuhaib C', 'Shameer Ali Hudawi'],
      date: '03 August 2025',
      location: 'Unity Centre, Kannur',
      duration: '01 Day'
    },
    {
      type: 'Pre Event',
      level: 'All Level',
      title: 'Science and Technology Fest Declaration Ceremony',
      speakers: ['Dr. Syed Mustafa Ali', 'Dr. Nahas Mala', 'Shameer Ali Hudawi', 'T Ismail', 'Adv. Abdul Vahid', 'Sahel Bas'],
      date: '17 August 2025',
      location: 'Ernakulam Town Hall',
      duration: null
    },
    {
      type: 'Pre Event',
      level: 'All Level',
      title: "Let's Ai It! AI Orientation Workshop",
      speakers: ['Amjad Ali EM', 'Ameen Ahsan'],
      date: '24 August 2025',
      location: 'Kozhikode',
      duration: null
    },
    {
      type: 'Pre Event',
      level: 'All Level',
      title: 'Workshop on Thinking Technology: Exploring Heideggerian Idea of Technology',
      speakers: ['Dr. Muhammed Shareef', 'Dr. Salih Malol'],
      date: '27 September 2025',
      location: 'Vidyarthi Bhavanam Hall, Kozhikode',
      duration: '01 Day'
    },
    {
      type: 'Pre Event',
      level: 'All Level',
      title: 'Hackathon for Social Good',
      speakers: [],
      date: 'September 29 - November 02, 2025',
      location: 'Online',
      duration: '04 Days'
    },
  ]

const FILTERS = ['All Event', 'Pre Event', 'Panel Discussion', 'Keynote']

const Events = () => {
  const headerRef = useReveal()
  const [activeFilter, setActiveFilter] = useState('All Event')

  const filteredEvents = useMemo(() => 
    activeFilter === 'All Event' 
      ? EVENTS 
      : EVENTS.filter(event => event.type === activeFilter),
    [activeFilter]
  )

  return (
    <section id="events" className="py-20 px-6 max-w-7xl mx-auto">
      <div ref={headerRef} className="mb-16 reveal">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Events</h2>
        <p className="text-gray-400 max-w-3xl text-lg leading-relaxed">
          Engage with thought-provoking discussions, workshops, and exhibitions that explore the intersection of Islamic thought and scientific inquiry, challenging conventional paradigms and inspiring ethical innovation.
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-10">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a] ${
              activeFilter === filter
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/40 scale-105'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:scale-105 border border-white/10 backdrop-blur-sm'
            }`}
            aria-pressed={activeFilter === filter}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="block md:hidden">
        <EventCarousel events={filteredEvents} activeFilter={activeFilter} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <EventCard key={`${event.title}-${event.date}`} event={event} index={index} />
        ))}
      </div>
    </section>
  )
}

export const EventCard = memo(({ event, index }) => {
  const ref = useReveal()
  const uniqueId = `event-${index}`

  return (
    <div ref={ref} className="pro-card rounded-2xl overflow-hidden reveal group hover:border-indigo-500/40 h-full flex flex-col">
      {/* Header with Gradient */}
      <div className="event-card-header relative px-6 py-6 bg-gradient-to-br from-indigo-600/25 via-purple-600/20 to-transparent border-b border-white/10">
        {/* Wavy Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`wave1-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.1" />
              </linearGradient>
              <linearGradient id={`wave2-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path d="M0,60 Q50,30 100,60 T200,60 T300,60 T400,60 L400,0 L0,0 Z" fill={`url(#wave1-${uniqueId})`}/>
            <path d="M0,90 Q80,70 160,90 T320,90 T400,90 L400,150 L0,150 Z" fill={`url(#wave2-${uniqueId})`}/>
            <path d="M0,40 Q120,10 240,40 T400,40 L400,0 L0,0 Z" fill={`url(#wave1-${uniqueId})`} opacity="0.4"/>
          </svg>
        </div>
        
        {/* Badges */}
        <div className="relative flex justify-between items-start mb-4">
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 backdrop-blur-sm">
            {event.type}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 text-gray-300 text-xs font-bold border border-white/10 backdrop-blur-sm">
            {event.level}
          </span>
        </div>

        {/* Title */}
        <h3 className="relative text-base md:text-lg font-bold text-white leading-snug">
          {event.title}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 py-6 flex-1 flex flex-col">
        {/* Speakers */}
        {event.speakers.length > 0 && (
          <div className="mb-6 flex-1">
            {event.speakers.map((speaker, idx) => (
              <p key={idx} className="text-gray-300 font-medium text-sm mb-2 group-hover:text-gray-200 transition-colors">
                {speaker}
              </p>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4"></div>

        {/* Date and Location */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <time dateTime={event.date} className="text-sm font-medium">{event.date}</time>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span className="text-sm font-medium">{event.location}</span>
          </div>
        </div>

        {/* Duration */}
        {event.duration && (
          <>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-3"></div>
            <p className="text-indigo-300 font-bold text-sm">{event.duration}</p>
          </>
        )}
      </div>
    </div>
  )
})

EventCard.displayName = 'EventCard'

export default Events

