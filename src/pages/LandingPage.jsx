import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Card3D from '../components/Card3D'
export default function LandingPage() {
  const navigate = useNavigate()
  const [showCards, setShowCards] = useState(false)
  
  useEffect(() => {
    // Delay card animation slightly after page load
    setTimeout(() => setShowCards(true), 300)
  }, [])
  
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      
      {/* Top label - fade in */}
      <div className="text-muted text-xs uppercase tracking-widest mb-4 font-medium animate-fade-in">
        Survival Toolkit for Students
      </div>
      
      {/* Hero Title - typewriter effect via CSS */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-3 tracking-tight overflow-hidden">
  <span className="text-accent inline-block animate-slide-in-left">Campus</span>
  <span className="text-accent2 inline-block animate-slide-in-right">Chaos</span>
</h1>
      
      {/* Subtitle - fade in with delay */}
      <p className="text-muted text-base md:text-lg text-center mb-12 max-w-md px-4">
  Track attendance, assignments, exams, and your slowly declining sanity.
</p>
      
      {/* Sticky Note Cards - NOW 3D */}
      <div className={`flex flex-wrap justify-center gap-4 md:gap-6 mb-12 max-w-3xl px-4 transition-all duration-700 ${
  showCards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
}`}>
  
  {/* Card 1: Attendance */}
  <Card3D className="w-44 rotate-2">
    <div className="bg-warning p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(255,230,109,0.4)]">
      <div className="text-3xl mb-2 animate-float">📊</div>
      <h3 className="text-txt font-semibold text-lg">Attendance</h3>
      <p className="text-txt/70 text-sm mt-1">Never miss (too many) classes</p>
    </div>
  </Card3D>
  
  {/* Card 2: Assignments */}
  <Card3D className="w-44 -rotate-1">
    <div className="bg-success p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(149,225,211,0.4)]">
      <div className="text-3xl mb-2 animate-float" style={{ animationDelay: '0.3s' }}>📝</div>
      <h3 className="text-txt font-semibold text-lg">Assignments</h3>
      <p className="text-txt/70 text-sm mt-1">Track deadlines before they track you</p>
    </div>
  </Card3D>
  
  {/* Card 3: Exams */}
  <Card3D className="w-44 rotate-3">
    <div className="bg-purple p-6 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_60px_rgba(168,218,220,0.4)]">
      <div className="text-3xl mb-2 animate-float" style={{ animationDelay: '0.6s' }}>📚</div>
      <h3 className="text-txt font-semibold text-lg">Exams</h3>
      <p className="text-txt/70 text-sm mt-1">Countdown to academic reckoning</p>
    </div>
  </Card3D>
  
</div>
      
      {/* CTA Button - bounce in */}
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-accent text-white font-semibold px-8 py-4 rounded-full hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-base animate-bounce-in"
      >
        Start Tracking →
      </button>
      
      {/* Footer tagline - fade in last */}
      <p className="text-muted/60 text-xs mt-8 italic animate-fade-in-last">
        "Chaos, but make it organized."
      </p>
      
    </div>
  )
}