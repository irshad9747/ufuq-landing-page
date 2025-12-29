import { memo } from 'react'
import { useReveal } from '../hooks/useReveal'

const Stats = () => {
  const ref = useReveal()

  const stats = [
    { value: '2,000+', label: 'Delegates' },
    { value: '50+', label: 'Guests' },
    { value: '20+', label: 'Sessions' },
    { value: '05+', label: 'Stages' },
  ]

  return (
    <section ref={ref} className="max-w-7xl mx-auto px-6 mb-32 reveal" aria-label="Event statistics">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {stats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>
    </section>
  )
}

const StatCard = memo(({ stat }) => (
  <div className="pro-card p-6 md:p-8 rounded-2xl text-center group hover:bg-white/5 transition-all duration-300">
    <p className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-white/60 mb-3 group-hover:scale-110 transition-transform duration-300" aria-label={stat.value}>
      {stat.value}
    </p>
    <p className="text-xs md:text-sm text-indigo-300/80 uppercase tracking-widest font-semibold group-hover:text-indigo-200 transition-colors">{stat.label}</p>
  </div>
))

StatCard.displayName = 'StatCard'

export default Stats

