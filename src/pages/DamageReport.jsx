import DashLayout from '../components/DashLayout'
import { useSubjects } from '../hooks/useSubjects'
import { useAssignments } from '../hooks/useAssignments'
import { useExams } from '../hooks/useExams'
import PageTransition from '../components/PageTransition'
export default function DamageReport() {
  const { subjects } = useSubjects()
  const { assignments } = useAssignments()
  const { exams } = useExams()

  // SURVIVAL SCORE CALCULATION (Simplified version - full one in Phase 5)
  
  const calcAttendanceScore = () => {
    if (subjects.length === 0) return 100
    
    const scores = subjects.map(s => {
      if (s.total === 0) return 100
      const current = (s.attended / s.total) * 100
      const required = s.required || 75
      
      if (current >= required + 10) return 100
      if (current >= required) return 85
      if (current >= required - 5) return 65
      return 40
    })
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const calcAssignmentScore = () => {
    if (assignments.length === 0) return 100
    
    const pending = assignments.filter(a => a.status === 'pending').length
    const overdue = assignments.filter(a => {
      const daysLeft = Math.ceil((new Date(a.due_date) - new Date()) / (1000 * 60 * 60 * 24))
      return a.status === 'pending' && daysLeft < 0
    }).length
    
    const submitted = assignments.filter(a => a.status === 'submitted').length
    const completionRate = submitted / assignments.length
    const overdueImpact = (overdue / assignments.length) * 40
    
    return Math.max(0, Math.round((completionRate * 100) - overdueImpact))
  }

  const calcExamScore = () => {
    if (exams.length === 0) return 100
    
    const upcoming = exams.filter(e => {
      const daysLeft = Math.ceil((new Date(e.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
      return daysLeft >= 0
    })
    
    if (upcoming.length === 0) return 100
    
    const scores = upcoming.map(e => {
      const daysLeft = Math.ceil((new Date(e.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
      let timeScore = 100
      
      if (daysLeft <= 1) timeScore = 30
      else if (daysLeft <= 3) timeScore = 50
      else if (daysLeft <= 7) timeScore = 70
      else if (daysLeft <= 14) timeScore = 85
      
      const prepMultipliers = {
        'confident': 1.0,
        'revising': 0.85,
        'not_started': 0.65,
        'lying': 0.5
      }
      
      return timeScore * (prepMultipliers[e.prep_status] || 0.65)
    })
    
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  const attendanceScore = calcAttendanceScore()
  const assignmentScore = calcAssignmentScore()
  const examScore = calcExamScore()
  
  const survivalScore = Math.round(
    attendanceScore * 0.4 +
    assignmentScore * 0.3 +
    examScore * 0.3
  )

  const getVerdict = (score) => {
    if (score >= 90) return { text: 'Exceptionally stable. Possibly overachieving.', color: 'text-success', emoji: '🌟' }
    if (score >= 80) return { text: 'Chaos under control. Well done.', color: 'text-success', emoji: '✅' }
    if (score >= 70) return { text: 'Warning signs detected. Tread carefully.', color: 'text-accent2', emoji: '⚠️' }
    if (score >= 60) return { text: 'Operational but unstable. Fix things soon.', color: 'text-warning', emoji: '🔶' }
    if (score >= 50) return { text: 'High academic volatility. Crisis mode.', color: 'text-warning', emoji: '📉' }
    return { text: 'System failure imminent. Emergency measures required.', color: 'text-danger', emoji: '🚨' }
  }

  const verdict = getVerdict(survivalScore)

  return (
    <DashLayout>
      <PageTransition>
     {/* Header */}
<div className="mb-6 md:mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">💀 Damage Report</h1>
  <p className="text-sm md:text-base text-muted">The unfiltered truth about your academic existence</p>
</div>

      {/* Big Survival Score */}
      <div className="bg-card rounded-2xl p-12 mb-8 border-2 border-accent text-center shadow-xl">
        <p className="text-muted text-sm uppercase tracking-widest mb-4">Overall Survival Probability</p>
        <p className="text-9xl font-bold text-accent mb-4">{survivalScore}%</p>
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl">{verdict.emoji}</span>
          <p className={`text-2xl font-semibold ${verdict.color}`}>{verdict.text}</p>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        
        {/* Attendance */}
        <div className="bg-[#FFDAB9] p-6 rounded-xl shadow-md">
          <p className="text-txt/60 text-xs uppercase tracking-widest mb-2">Attendance Health</p>
          <p className="text-5xl font-bold text-txt mb-1">{attendanceScore}</p>
          <p className="text-sm text-txt/70">Weight: 40%</p>
          <div className="mt-4 pt-4 border-t border-txt/20">
            <p className="text-xs text-txt/70">{subjects.length} subjects tracked</p>
          </div>
        </div>

        {/* Assignments */}
        <div className="bg-purple p-6 rounded-xl shadow-md">
          <p className="text-txt/60 text-xs uppercase tracking-widest mb-2">Assignment Status</p>
          <p className="text-5xl font-bold text-txt mb-1">{assignmentScore}</p>
          <p className="text-sm text-txt/70">Weight: 30%</p>
          <div className="mt-4 pt-4 border-t border-txt/20">
            <p className="text-xs text-txt/70">
              {assignments.filter(a => a.status === 'submitted').length} / {assignments.length} completed
            </p>
          </div>
        </div>

        {/* Exams */}
        <div className="bg-[#FFB4B4] p-6 rounded-xl shadow-md">
          <p className="text-txt/60 text-xs uppercase tracking-widest mb-2">Exam Preparedness</p>
          <p className="text-5xl font-bold text-txt mb-1">{examScore}</p>
          <p className="text-sm text-txt/70">Weight: 30%</p>
          <div className="mt-4 pt-4 border-txt/20">
            <p className="text-xs text-txt/70">
              {exams.filter(e => {
                const daysLeft = Math.ceil((new Date(e.exam_date) - new Date()) / (1000 * 60 * 60 * 24))
                return daysLeft >= 0
              }).length} upcoming exams
            </p>
          </div>
        </div>

      </div>

      {/* Recommendations */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-txt/10">
        <h2 className="text-xl font-bold text-txt mb-4">📋 Recommendations</h2>
        <div className="space-y-3">
          {attendanceScore < 70 && (
            <div className="flex gap-3 items-start">
              <span className="text-2xl">⚠️</span>
              <p className="text-txt text-sm"><strong>Attendance Critical:</strong> You're playing with fire. Attend more classes immediately.</p>
            </div>
          )}
          {assignmentScore < 60 && (
            <div className="flex gap-3 items-start">
              <span className="text-2xl">📝</span>
              <p className="text-txt text-sm"><strong>Assignment Backlog:</strong> Submit pending work ASAP. Overdue tasks are killing your score.</p>
            </div>
          )}
          {examScore < 70 && (
            <div className="flex gap-3 items-start">
              <span className="text-2xl">📚</span>
              <p className="text-txt text-sm"><strong>Exam Prep Low:</strong> Start studying now. Cramming the night before won't cut it.</p>
            </div>
          )}
          {survivalScore >= 80 && (
            <div className="flex gap-3 items-start">
              <span className="text-2xl">🎉</span>
              <p className="text-txt text-sm"><strong>You're Doing Great:</strong> Keep up the momentum. Don't get complacent.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Quote */}
      <div className="mt-8 text-center">
        <p className="text-muted text-sm italic">
          "The first step to solving a problem is acknowledging it exists. You're welcome."
        </p>
      </div>
</PageTransition>
    </DashLayout>
  )
}