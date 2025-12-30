import { useReveal } from '../hooks/useReveal'
import { getImagePath } from '../utils/imagePath'

const Hero = () => {
  const leftRef = useReveal()
  const middleRef = useReveal()

  return (
    <header id="home" className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center">
      <div className="w-full space-y-16">
        {/* Top Row: Left and Middle Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          <div ref={leftRef} className="reveal delay-[100ms]">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm text-xs font-medium text-indigo-300 mb-8 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300">
              <svg className="w-3.5 h-3.5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Kozhikode, Kerala &bull; 25-26 Jan 2026</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              {/* <span>
                <img src="/icons/ufuq.webp" alt="UFUQ Logo" className="h-[40px]" />
              </span> */}
              Science and <br/>
              <span className="gradient-text">Technology Fest</span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-10 max-w-lg leading-relaxed">
              Resisting both uncritical acceptance and blanket refusal of advances in science and technology, SIO seeks to critically engage with them -- questioning, redefining, and reshaping their course, while remaining grounded in the foundations of Islam.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="btn-primary px-8 py-4 rounded-xl font-semibold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a]" aria-label="Register for UFUQ 2026">Register Now</a>
              <button className="px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all text-sm font-medium text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#03030a]" aria-label="View event brochure">View Brochure</button>
            </div>
          </div>

          {/* New Section */}
          <div ref={middleRef} className="flex items-center justify-center reveal delay-[200ms]">
            <div className="relative w-full max-w-md">
              {/* Glow Background */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="cube-glow"></div>
              </div>
              
              {/* Floating Cube Image */}
              <div className="relative flex items-center justify-center">
                <img 
                  src={getImagePath('/icons/cube.png')} 
                  alt="Cube" 
                  className="cube-alive w-full h-auto max-w-xl md:max-w-2xl lg:max-w-3xl"
                  style={{ opacity: 0.85 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero

