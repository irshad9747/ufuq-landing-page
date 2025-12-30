import { useReveal } from '../hooks/useReveal'

const QuoteSection = () => {
  const ref = useReveal()

  return (
    <section className="pb-20 px-6 max-w-7xl mx-auto">
      <div ref={ref} className="relative reveal flex justify-center">
        <div className="relative w-full max-w-2xl">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-600/20 blur-[100px] rounded-full pointer-events-none animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-purple-600/10 blur-[60px] rounded-full pointer-events-none"></div>
          
          <div className="pro-card p-8 md:p-10 rounded-tr-3xl rounded-br-3xl rounded-bl-3xl relative z-10 hover:scale-[1.02] transition-transform duration-500">
            <div className="font-amiri text-2xl md:text-3xl text-right text-indigo-100 mb-4 leading-loose opacity-90" dir="rtl">
              "سَنُرِيهِمْ آيَاتِنَا فِي الْآفَاقِ وَفِي أَنفُسِهِمْ حَتَّى يَتَبَيَّنَ لَهُمْ أَنَّهُ الْحَقُّ"
            </div>
            <p className="text-sm text-gray-400 italic mb-8 leading-relaxed border-l-2 border-indigo-500/30 pl-4">
              "We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the Truth" (41:53)
            </p>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6"></div>

            <p className="text-sm text-gray-300 leading-relaxed">
              This verse embodies the idea that every pursuit of knowledge, whether through the vast horizons of the universe or the depths of the human self, is ultimately a journey towards recognizing the ultimate reality: Allah.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default QuoteSection
