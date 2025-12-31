import { memo } from 'react'

const SpeakerCard = ({ speaker }) => {
  return (
    <div className="pro-card p-8 rounded-2xl group hover:scale-[1.02] active:scale-[0.98] touch-manipulation transition-all duration-300 flex flex-col items-center h-full select-none">
      {/* Image Container with Enhanced Styling */}
      <div className="relative mb-6">
        <div className="relative w-28 h-28 md:w-32 md:h-32">
          {/* Outer Glow Ring */}
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${speaker.gradient} opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-300`}></div>
          
          {/* Image Frame */}
          <div className="relative w-full h-full rounded-full p-1 bg-gradient-to-br from-indigo-500/50 via-purple-500/30 to-transparent group-hover:from-indigo-500/70 group-hover:via-purple-500/50 active:from-indigo-500/80 active:via-purple-500/60 transition-all duration-300">
            <img 
              src={speaker.image} 
              alt={speaker.name}
              className="w-full h-full rounded-full object-cover border-2 border-white/10 group-hover:border-indigo-400/50 transition-all duration-300 shadow-xl group-hover:shadow-2xl group-hover:shadow-indigo-500/20"
              loading="lazy"
              onError={(e) => {
                // Fallback to gradient circle if image fails to load
                const fallback = e.target.nextElementSibling
                if (fallback) {
                  e.target.style.display = 'none'
                  fallback.style.display = 'flex'
                }
              }}
            />
            <div 
              className={`absolute inset-0 w-full h-full rounded-full bg-gradient-to-br ${speaker.gradient} flex items-center justify-center text-2xl font-bold text-white shadow-xl hidden`}
            >
              {speaker.initials}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="text-center flex-1 flex flex-col">
        <h4 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
          {speaker.name}
        </h4>
        <p className="text-xs md:text-sm text-indigo-400 uppercase tracking-wide font-semibold mb-4 group-hover:text-indigo-300 transition-colors">
          {speaker.affiliation}
        </p>
        <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
          {speaker.description}
        </p>
      </div>
    </div>
  )
}

SpeakerCard.displayName = 'SpeakerCard'

export default memo(SpeakerCard)

