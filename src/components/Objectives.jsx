import { useReveal } from '../hooks/useReveal'

const Objectives = () => {
  const sectionRef = useReveal()

  const objectives = [
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      title: 'Philosophy of Science',
      description: 'To critically explore the genealogy and conceptual foundations of scientific rationality, examining its societal function as embodying a particular dynamic of knowledge, power and reality.',
      color: 'indigo'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
        </svg>
      ),
      title: 'Interdisciplinary Method',
      description: 'To pave the way for interdisciplinary and transdisciplinary dialogue that ensures the sustenance of values in the further development of science and technology.',
      color: 'purple'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
        </svg>
      ),
      title: 'Politics of Science',
      description: 'To critically engage with the sociopolitical implications of science and technology, challenging the myth of their neutrality and highlighting their roles in reinforcing ideologies and systems of control.',
      color: 'emerald'
    },
    {
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
      ),
      title: 'Islamic Civilizational Imagination',
      description: 'To envision the possibility of engaging with science and technology from within an Islamic civilizational imagination, with the aim of fostering a just and prosperous world order.',
      color: 'amber'
    },
  ]

  const colorClasses = {
    indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  }

  return (
    <section id="about" className="py-20 px-6 max-w-7xl mx-auto relative">
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-purple-900/10 blur-[100px] rounded-full -z-10"></div>

      <div ref={sectionRef} className="text-center mb-20 reveal">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Objectives of Fest</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg">Exploring the intersection of Islamic thought and scientific innovation. Join us for a transformative journey through the rich legacy of Islamic science and its relevance to the contemporary world.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {objectives.map((obj, index) => (
          <ObjectiveCard key={index} objective={obj} colorClasses={colorClasses} />
        ))}
      </div>
    </section>
  )
}

const ObjectiveCard = ({ objective, colorClasses }) => {
  const ref = useReveal()

  return (
    <div ref={ref} className={`pro-card p-10 rounded-[2rem] reveal hover:bg-indigo-900/10 duration-300 group hover:scale-[1.02] transition-all`}>
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[objective.color]} flex items-center justify-center border mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
        {objective.icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white group-hover:text-indigo-200 transition-colors">{objective.title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors">{objective.description}</p>
    </div>
  )
}

export default Objectives

