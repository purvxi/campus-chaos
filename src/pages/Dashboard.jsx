import DashLayout from '../components/DashLayout'

export default function Dashboard() {
  // Placeholder survival score (we'll calculate this later in Phase 5)
  const survivalScore = 67
  
  const getVerdict = (score) => {
    if (score >= 80) return { text: "You're surprisingly stable.", color: "text-success" }
    if (score >= 65) return { text: "Manageable chaos detected.", color: "text-accent2" }
    if (score >= 50) return { text: "Teetering on the edge.", color: "text-warning" }
    return { text: "Academic emergency mode.", color: "text-danger" }
  }
  
  const verdict = getVerdict(survivalScore)
  
  return (
    <DashLayout>
      
      {/* Hero Strip */}
      <div className="bg-card rounded-2xl p-8 mb-8 border border-txt/10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm uppercase tracking-widest mb-2">System Status</p>
            <h2 className="text-txt text-3xl font-bold">Reality Check Complete</h2>
            <p className={`${verdict.color} text-lg mt-1 font-medium`}>{verdict.text}</p>
          </div>
          <div className="text-right">
            <p className="text-muted text-xs uppercase tracking-widest mb-2">Survival Probability</p>
            <p className="text-6xl font-bold text-accent">{survivalScore}%</p>
          </div>
        </div>
      </div>
      
      {/* Daily Quote Card */}
      <div className="bg-warning p-6 rounded-xl shadow-lg mb-8 rotate-1 max-w-md">
        <p className="text-txt font-semibold text-lg mb-2">📌 Daily Reality Check</p>
        <p className="text-txt/80 italic">"Confidence is high. Attendance is not."</p>
        <button className="mt-4 text-sm text-txt/60 hover:text-txt underline">
          🔄 Another Reality Check
        </button>
      </div>
      
      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Attendance */}
        <div className="bg-[#FFDAB9] p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:-rotate-1">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-txt font-bold text-xl mb-2">Attendance Tracker</h3>
          <p className="text-txt/70 text-sm mb-4">Monitor your presence (or lack thereof)</p>
          <button className="text-accent font-semibold text-sm hover:underline">View Stats →</button>
        </div>
        
        {/* Card: Bunk Calculator */}
        <div className="bg-success p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:rotate-1">
          <div className="text-4xl mb-3">🧮</div>
          <h3 className="text-txt font-bold text-xl mb-2">Can I Bunk?</h3>
          <p className="text-txt/70 text-sm mb-4">The eternal student question, answered</p>
          <button className="text-accent font-semibold text-sm hover:underline">Calculate Risk →</button>
        </div>
        
        {/* Card: Assignments */}
        <div className="bg-purple p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:-rotate-2">
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-txt font-bold text-xl mb-2">Assignment Tracker</h3>
          <p className="text-txt/70 text-sm mb-4">Because deadlines don't care about your plans</p>
          <button className="text-accent font-semibold text-sm hover:underline">View Tasks →</button>
        </div>
        
        {/* Card: Exams */}
        <div className="bg-[#FFB4B4] p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:rotate-2">
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-txt font-bold text-xl mb-2">Upcoming Exams</h3>
          <p className="text-txt/70 text-sm mb-4">Countdown to academic judgment day</p>
          <button className="text-accent font-semibold text-sm hover:underline">View Schedule →</button>
        </div>
        
        {/* Card: Damage Report */}
        <div className="bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-danger hover:rotate-1 md:col-span-2 lg:col-span-1">
          <div className="text-4xl mb-3">💀</div>
          <h3 className="text-txt font-bold text-xl mb-2">Damage Report</h3>
          <p className="text-txt/70 text-sm mb-4">The unfiltered truth about your semester</p>
          <button className="text-danger font-semibold text-sm hover:underline">Face Reality →</button>
        </div>
        
      </div>
      
    </DashLayout>
  )
}