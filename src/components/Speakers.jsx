import { useReveal } from '../hooks/useReveal'
import SpeakerCarousel from './SpeakerCarousel'
import SpeakerCard from './SpeakerCard'

const Speakers = () => {
  const headerRef = useReveal()

  const speakers = [
    {
      initials: 'SK',
      name: 'Sunandan K N',
      affiliation: 'Azim Premji University',
      description: 'Researches the history and sociology of caste, knowledge production, and science; holds advanced degrees in sociology and science policy.',
      gradient: 'from-indigo-500 to-purple-600',
      image: '/images/speakers/sunandan-k-n.webp'
    },
    {
      initials: 'SM',
      name: 'Dr. Salih M',
      affiliation: 'Govt. Arts & Science College',
      description: 'Completed his MPhil and PhD at Jawaharlal Nehru University, Delhi. His research interests focus on the relationship between technology and art.',
      gradient: 'from-purple-500 to-pink-600',
      image: '/images/speakers/dr-salih-m.webp'
    },
    {
      initials: 'WR',
      name: 'Wafa Razak',
      affiliation: 'PhD Candidate, JNU',
      description: 'Explores how biomedical knowledge is created and practiced in everyday settings, focusing on the interplay between science and society.',
      gradient: 'from-emerald-500 to-teal-600',
      image: '/images/speakers/wafa-razak.webp'
    },
    {
      initials: 'AA',
      name: 'Dr. Arun Ashokan',
      affiliation: 'ETH Zurich (Former)',
      description: 'Works on the history of vernacular mathematics in medieval South India. Completed postdoctoral research at ETH Zurich.',
      gradient: 'from-blue-500 to-indigo-600',
      image: '/images/speakers/dr-arun-ashokan.webp'
    },
    {
      initials: 'SH',
      name: 'Shameerali Hudawi',
      affiliation: 'Darul Huda Islamic University',
      description: 'Former Head of the Department of Civilizational Studies. He has expertise in philosophy of science and civilizational studies.',
      gradient: 'from-orange-500 to-red-600',
      image: '/images/speakers/shameerali-hudawi.webp'
    },
    {
      initials: 'MS',
      name: 'Dr. Muhammed Shareef',
      affiliation: 'IIT Palakkad (Former)',
      description: 'Holds a Master\'s degree in Philosophy from the University of Hyderabad. Research interests lie in the field of philosophy.',
      gradient: 'from-cyan-500 to-blue-600',
      image: '/images/speakers/dr-muhammed-shareef.webp'
    },
  ]

  return (
    <section id="speakers" className="py-20 px-6 max-w-7xl mx-auto bg-white/[0.02] relative">
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-indigo-900/10 blur-[100px] rounded-full -z-10"></div>
      
      <div ref={headerRef} className="text-center mb-16 reveal">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Speakers</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Learn from industry leaders and renowned researchers shaping the future of science.</p>
      </div>

      {/* Mobile Carousel */}
      <div className="block md:hidden">
        <SpeakerCarousel speakers={speakers} />
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {speakers.map((speaker, index) => (
          <SpeakerCard key={`${speaker.name}-${speaker.initials}`} speaker={speaker} />
        ))}
      </div>
    </section>
  )
}


export default Speakers

