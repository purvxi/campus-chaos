import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-12">
      
      {/* Top label */}
      <div className="text-muted text-xs uppercase tracking-widest mb-4 font-medium">
        Survival Toolkit for Students
      </div>
      
      {/* Hero Title */}
      <h1 className="text-6xl md:text-7xl font-bold text-center mb-3 tracking-tight">
        <span className="text-accent">Campus</span>
        <span className="text-accent2">Chaos</span>
      </h1>
      
      {/* Subtitle */}
      <p className="text-muted text-lg text-center mb-12 max-w-md">
        Track attendance, assignments, exams, and your slowly declining sanity.
      </p>
      
      {/* Sticky Note Cards */}
      <div className="flex flex-wrap justify-center gap-6 mb-12 max-w-3xl">
        
        {/* Card 1: Attendance */}
        <div className="bg-warning p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rotate-2 cursor-pointer w-44">
          <div className="text-3xl mb-2">📊</div>
          <h3 className="text-txt font-semibold text-lg">Attendance</h3>
          <p className="text-txt/70 text-sm mt-1">Never miss (too many) classes</p>
        </div>
        
        {/* Card 2: Assignments */}
        <div className="bg-success p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 -rotate-1 cursor-pointer w-44">
          <div className="text-3xl mb-2">📝</div>
          <h3 className="text-txt font-semibold text-lg">Assignments</h3>
          <p className="text-txt/70 text-sm mt-1">Track deadlines before they track you</p>
        </div>
        
        {/* Card 3: Exams */}
        <div className="bg-purple p-6 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 rotate-3 cursor-pointer w-44">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="text-txt font-semibold text-lg">Exams</h3>
          <p className="text-txt/70 text-sm mt-1">Countdown to academic reckoning</p>
        </div>
        
      </div>
      
      {/* CTA Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="bg-accent text-white font-semibold px-8 py-4 rounded-full hover:bg-accent/90 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg text-base"
      >
        Start Tracking →
      </button>
      
      {/* Footer tagline */}
      <p className="text-muted/60 text-xs mt-8 italic">
        "Chaos, but make it organized."
      </p>
      
    </div>
  )
}