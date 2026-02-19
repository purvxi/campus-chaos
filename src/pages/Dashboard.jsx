import DashLayout from '../components/DashLayout'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSubjects } from '../hooks/useSubjects'
import { useAssignments } from '../hooks/useAssignments'
import { useExams } from '../hooks/useExams'

export default function Dashboard() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)
  
  // Fetch real data from Supabase
  const { subjects } = useSubjects()
  const { assignments } = useAssignments()
  const { exams } = useExams()
  const sarcasticQuotes = [
    "Confidence is high. Attendance is not.",
    "Your GPA called. It wants a word.",
    "Remember when you said 'I'll start tomorrow'? It's tomorrow.",
    "Motivation is temporary. Deadlines are forever.",
    "You're not procrastinating. You're 'strategically delaying'.",
    "That assignment? Still due. Ignoring it won't help.",
    "Your attendance is a work of fiction.",
    "Study now or cry later. Your choice.",
    "The semester ends eventually. Your regrets don't.",
    "You've attended 60% of classes. The other 40% sends regards.",
    "Exams don't care about your feelings.",
    "You said you'd study an hour ago. Still waiting.",
    "Your future self is judging your current decisions.",
    "Bunking is fun until it's not.",
    "Academic consequences have entered the chat.",
    "That 'I'll be fine' energy isn't backed by data.",
    "You're one missed class away from a character arc.",
    "The library exists. Consider visiting.",
    "Your study plan is solid. Shame you're not following it."
  ]
  
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(
    Math.floor(Math.random() * sarcasticQuotes.length)
  )
  
  const rotateQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % sarcasticQuotes.length)
  }
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Calculate real stats
  const avgAttendance = subjects.length > 0
    ? Math.round(subjects.reduce((acc, s) => acc + (s.total > 0 ? (s.attended / s.total) * 100 : 0), 0) / subjects.length)
    : 0
  
  const pendingAssignments = assignments.filter(a => a.status === 'pending').length
  
  const upcomingExams = exams.filter(e => {
    const daysLeft = Math.ceil((new Date(e.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
    return daysLeft >= 0
  }).length
  
  // Placeholder survival score (we'll calculate properly in Damage Report)
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
      <div className={`bg-card rounded-2xl p-8 mb-8 border border-txt/10 shadow-sm transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm uppercase tracking-widest mb-2">System Status</p>
            <h2 className="text-txt text-3xl font-bold">Reality Check Complete</h2>
            <p className={`${verdict.color} text-lg mt-1 font-medium`}>{verdict.text}</p>
          </div>
          <div className="text-right">
            <p className="text-muted text-xs uppercase tracking-widest mb-2">Survival Probability</p>
            <p className="text-6xl font-bold text-accent animate-count-up">{survivalScore}%</p>
          </div>
        </div>
      </div>
      
      {/* Daily Quote Card - WITH ROTATION */}
<div className={`bg-warning p-6 rounded-xl shadow-lg mb-8 max-w-md transition-all duration-700 delay-200 ${
  mounted ? 'opacity-100 rotate-1 translate-y-0' : 'opacity-0 rotate-0 translate-y-4'
}`}>
  <p className="text-txt font-semibold text-lg mb-2">📌 Daily Reality Check</p>
  <p className="text-txt/80 italic" key={currentQuoteIndex}>"{sarcasticQuotes[currentQuoteIndex]}"</p>
  <button 
    onClick={rotateQuote}
    className="mt-4 text-sm text-txt/60 hover:text-txt underline transition-colors hover:scale-105"
  >
    🔄 Another Reality Check
  </button>
</div>
      
      {/* Feature Grid - NOW CLICKABLE WITH REAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card: Attendance - CLICKABLE */}
        <div 
          onClick={() => navigate('/attendance')}
          className={`bg-[#FFDAB9] p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:-rotate-1 duration-500 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl mb-3">📊</div>
          <h3 className="text-txt font-bold text-xl mb-2">Attendance Tracker</h3>
          <p className="text-txt/70 text-sm mb-4">
            {subjects.length > 0 
              ? `${subjects.length} subjects • ${avgAttendance}% avg`
              : 'No subjects tracked yet'
            }
          </p>
          <button className="text-accent font-semibold text-sm hover:underline">View Stats →</button>
        </div>
        
        {/* Card: Bunk Calculator - CLICKABLE */}
        <div 
          onClick={() => navigate('/bunk')}
          className={`bg-success p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:rotate-1 duration-500 delay-400 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl mb-3">🧮</div>
          <h3 className="text-txt font-bold text-xl mb-2">Can I Bunk?</h3>
          <p className="text-txt/70 text-sm mb-4">
            {subjects.length > 0
              ? `Calculating risk for ${subjects.length} subjects`
              : 'Add subjects first'
            }
          </p>
          <button className="text-accent font-semibold text-sm hover:underline">Calculate Risk →</button>
        </div>
        
        {/* Card: Assignments - CLICKABLE */}
        <div 
          onClick={() => navigate('/assignments')}
          className={`bg-purple p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:-rotate-2 duration-500 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl mb-3">📝</div>
          <h3 className="text-txt font-bold text-xl mb-2">Assignment Tracker</h3>
          <p className="text-txt/70 text-sm mb-4">
            {assignments.length > 0
              ? `${pendingAssignments} pending • ${assignments.length} total`
              : 'No assignments tracked'
            }
          </p>
          <button className="text-accent font-semibold text-sm hover:underline">View Tasks →</button>
        </div>
        
        {/* Card: Exams - CLICKABLE */}
        <div 
          onClick={() => navigate('/exams')}
          className={`bg-[#FFB4B4] p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer hover:rotate-2 duration-500 delay-600 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl mb-3">📚</div>
          <h3 className="text-txt font-bold text-xl mb-2">Upcoming Exams</h3>
          <p className="text-txt/70 text-sm mb-4">
            {exams.length > 0
              ? `${upcomingExams} upcoming • ${exams.length} total`
              : 'No exams scheduled'
            }
          </p>
          <button className="text-accent font-semibold text-sm hover:underline">View Schedule →</button>
        </div>
        
        {/* Card: Damage Report - CLICKABLE */}
        <div 
          onClick={() => navigate('/damage')}
          className={`bg-card p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-2 border-danger hover:rotate-1 md:col-span-2 lg:col-span-1 duration-500 delay-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="text-4xl mb-3">💀</div>
          <h3 className="text-txt font-bold text-xl mb-2">Damage Report</h3>
          <p className="text-txt/70 text-sm mb-4">Complete survival analysis</p>
          <button className="text-danger font-semibold text-sm hover:underline">Face Reality →</button>
        </div>
        
      </div>
      
    </DashLayout>
  )
}