import { Search, LineChart, Target, ShieldCheck, Zap } from 'lucide-react'
import { SearchBar } from './SearchBar'

export function HeroSection() {
  const features = [
    { label: "MONITORING", icon: <LineChart className="w-4 h-4" />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "BENCHMARKING", icon: <Target className="w-4 h-4" />, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "VEILLE CONCURRENTIELLE", icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "PRÉDICTION", icon: <Zap className="w-4 h-4" />, color: "text-teal-600", bg: "bg-teal-50" }
  ];

  return (
    <div className="relative min-h-[80vh] bg-white overflow-hidden flex flex-col items-center justify-center pt-16 pb-10 sm:pt-24 sm:pb-16">
      
      {/* Premium Background Glow - Keeping only subtle blue */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-50 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-5xl px-4 sm:px-6 text-center space-y-10 sm:space-y-14">
        
        {/* Logo Section - Slightly smaller */}
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="relative inline-block">
            <img
              src="/images/Logo 1111.svg"
              alt="1111.tn Logo"
              className="relative w-32 h-32 sm:w-40 sm:h-40 animate-float hover:scale-105 transition-transform duration-700 cursor-pointer drop-shadow-xl"
            />
          </div>
        </div>

        {/* Headline & Subtitle - Slightly smaller */}
        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Comparateur de prix <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">intelligent</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl font-bold text-slate-700 leading-relaxed">
              Les prix, en toute transparence et claireté.
            </p>
          </div>

          {/* Feature Capsules - Original Labels */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 px-4 overflow-x-auto sm:overflow-visible pb-2 no-scrollbar">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl ${feature.bg} ${feature.color} border border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:scale-105 hover:shadow-md transition-all duration-300 cursor-default whitespace-nowrap`}
              >
                {feature.icon}
                <span className="text-xs sm:text-sm font-black tracking-widest uppercase">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Functional Search Bar Wrapper */}
        <div className="max-w-3xl mx-auto space-y-6 pt-4">
          <SearchBar 
            variant="premium" 
            searchBoth={true}
            placeholder="Cherchez un produit, une marque, ou un prix..."
          />
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-slate-800">
              <p className="text-sm sm:text-lg font-bold">
                On compare les vrais prix. On dévoile tout les mensonges.
              </p>
              <p className="text-base sm:text-xl font-black bg-purple-50 text-purple-600 px-6 py-2 rounded-full border border-purple-100 shadow-sm">
                Gratuitement, pour toi.
              </p>
            </div>
            <p className="text-sm sm:text-base text-slate-400 font-medium max-w-2xl mx-auto">
              Comparez instantanément les prix, analysez les stratégies concurrentes, et trouvez les meilleures offres
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroSection;
