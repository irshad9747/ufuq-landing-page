import { useReveal } from '../hooks/useReveal'
import { getImagePath } from '../utils/imagePath'

const RecentActivity = () => {
  const ref = useReveal()

  const activities = [
    { 
      month: 'May 2025', 
      title: 'Exploring Intersections of Science, Technology, Society & Theology - Summer School', 
      date: '27, 28, 29 May 2025',
      location: 'Al Jamia Al Islamiya, Santhapuram',
      image: getImagePath('/images/events/jamia-summer-school.webp')
    },
    { 
      month: 'Aug 2025', 
      title: 'Workshop on Aqeeda, Philosophy and Science: Navigating Technology in the Modern Era', 
      date: '03 August 2025',
      location: 'Unity Center, Kannur',
      image: getImagePath('/images/events/unity-center-workshop.webp')
    },
    { 
      month: 'Aug 2025', 
      title: 'Science and Technology Fest Declaration Ceremony', 
      date: '17 August 2025',
      location: 'Ernakulam Town Hall',
      image: getImagePath('/images/events/ern-declaration-ceremony.webp')
    },
    { 
      month: 'Aug 2025', 
      title: "Let's Ai It! AI Orientation Workshop", 
      date: '24 August 2025',
      location: 'Hira Centre Auditorium, Kozhikode',
      image: getImagePath('/images/events/hira-clct-ai-workshop.webp')
    },
  ]

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div ref={ref} className="reveal mb-10">
        <h2 className="text-2xl font-bold mb-6 border-l-4 border-indigo-500 pl-4">What we've been up to lately</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {activities.map((activity, index) => (
            <div key={index} className="pro-card rounded-xl overflow-hidden group hover:scale-[1.02] transition-all duration-300">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#03030a]/80 via-transparent to-transparent"></div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h4 className="font-semibold text-white mb-3 group-hover:text-indigo-200 transition-colors text-sm leading-tight">
                  {activity.title}
                </h4>
                
                {/* Date */}
                {activity.date && (
                  <div className="flex items-center gap-2 text-gray-300 mb-2">
                    <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <time dateTime={activity.date} className="text-xs font-medium">{activity.date}</time>
                  </div>
                )}
                
                {/* Location */}
                <div className="flex items-start gap-2 text-gray-400">
                  <svg className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <p className="text-xs leading-relaxed">{activity.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecentActivity

