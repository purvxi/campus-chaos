import { useState } from 'react'
import DashLayout from '../components/DashLayout'
import { useExams } from '../hooks/useExams'
import PageTransition from '../components/PageTransition'
export default function ExamsPage() {
  const { exams, loading, addExam, updatePrepStatus, deleteExam } = useExams()
  
  const [formData, setFormData] = useState({
    subject: '',
    exam_type: 'Midsem',
    exam_date: '',
    prep_status: 'not_started'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.subject.trim() || !formData.exam_date) return
    
    await addExam(formData)
    setFormData({ subject: '', exam_type: 'Midsem', exam_date: '', prep_status: 'not_started' })
  }

  const getDaysUntil = (examDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const exam = new Date(examDate)
    exam.setHours(0, 0, 0, 0)
    const diffTime = exam - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getUrgencyInfo = (daysLeft) => {
    if (daysLeft < 0) return { color: 'text-muted', bg: 'bg-muted/20', message: 'Exam passed', emoji: '✓' }
    if (daysLeft === 0) return { color: 'text-danger', bg: 'bg-danger/20', message: 'TODAY', emoji: '🔥' }
    if (daysLeft === 1) return { color: 'text-danger', bg: 'bg-danger/20', message: 'Tomorrow', emoji: '⚠️' }
    if (daysLeft <= 3) return { color: 'text-warning', bg: 'bg-warning/30', message: `${daysLeft} days`, emoji: '⏰' }
    if (daysLeft <= 7) return { color: 'text-accent2', bg: 'bg-accent2/20', message: `${daysLeft} days`, emoji: '📅' }
    return { color: 'text-success', bg: 'bg-success/20', message: `${daysLeft} days`, emoji: '✨' }
  }

  const getSarcasticMessage = (daysLeft) => {
    if (daysLeft > 14) return "Plenty of time. You'll still start the night before."
    if (daysLeft > 7) return "A week is basically forever in student time."
    if (daysLeft > 3) return "Interesting strategy. Bold, even."
    if (daysLeft === 3) return "Three days. That's 72 hours. Or 71 hours of panic."
    if (daysLeft === 2) return "Two days. Time to update your LinkedIn for backup plans."
    if (daysLeft === 1) return "May your memory be strong and your guesses accurate."
    if (daysLeft === 0) return "It's character development time."
    return "Post-mortem analysis pending."
  }

  const prepStatuses = [
    { value: 'not_started', label: 'Not Started', color: 'bg-muted/20 text-muted' },
    { value: 'revising', label: 'Revising', color: 'bg-accent2/20 text-accent2' },
    { value: 'confident', label: 'Confident', color: 'bg-success/20 text-success' },
    { value: 'lying', label: 'Lying to Myself', color: 'bg-warning/30 text-warning' }
  ]

  if (loading) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted text-lg">Loading exams...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      <PageTransition>
      {/* Header */}
<div className="mb-6 md:mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">📚 Upcoming Exams</h1>
  <p className="text-sm md:text-base text-muted">Countdown to academic judgment day</p>
</div>

      {/* Add Exam Form */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-txt/10 mb-8">
        <h2 className="text-xl font-semibold text-txt mb-4">Add New Exam</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Subject name"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <select
            value={formData.exam_type}
            onChange={(e) => setFormData({ ...formData, exam_type: e.target.value })}
            className="px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="Midsem">Midsem</option>
            <option value="Endsem">Endsem</option>
            <option value="Quiz">Quiz</option>
            <option value="Practical">Practical</option>
          </select>
          <input
            type="date"
            value={formData.exam_date}
            onChange={(e) => setFormData({ ...formData, exam_date: e.target.value })}
            className="px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <select
            value={formData.prep_status}
            onChange={(e) => setFormData({ ...formData, prep_status: e.target.value })}
            className="px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {prepStatuses.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105"
          >
            Add Exam
          </button>
        </form>
      </div>

      {/* Exams List */}
      {exams.length === 0 ? (
        <div className="bg-purple p-12 rounded-xl text-center rotate-2">
          <p className="text-txt text-xl font-semibold mb-2">No exams scheduled!</p>
          <p className="text-txt/70">Living the dream or living in denial?</p>
        </div>
      ) : (
        <div className="space-y-6">
          {exams.map((exam, index) => {
            const daysLeft = getDaysUntil(exam.exam_date)
            const urgency = getUrgencyInfo(daysLeft)
            const currentPrep = prepStatuses.find(s => s.value === exam.prep_status)
            
            return (
              <div
                key={exam.id}
                className={`bg-card p-6 rounded-xl shadow-md border-2 ${
                  daysLeft <= 0 ? 'border-muted/30' :
                  daysLeft <= 2 ? 'border-danger/40' :
                  daysLeft <= 7 ? 'border-warning/30' :
                  'border-txt/10'
                } hover:shadow-lg transition-all ${
                  index % 2 === 0 ? 'hover:-rotate-1' : 'hover:rotate-1'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-txt">{exam.subject}</h3>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-txt/10 text-muted">
                        {exam.exam_type}
                      </span>
                    </div>
                    <p className="text-muted text-sm mb-3">
                      📅 {new Date(exam.exam_date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="text-danger hover:text-danger/80 text-xl px-2"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>

                {/* Countdown */}
                <div className={`${urgency.bg} ${urgency.color} p-4 rounded-lg mb-4 text-center`}>
                  <p className="text-3xl font-bold mb-1">
                    {urgency.emoji} {urgency.message}
                  </p>
                  <p className="text-sm italic opacity-80">
                    {getSarcasticMessage(daysLeft)}
                  </p>
                </div>

                {/* Prep Status Selector */}
                <div>
                  <p className="text-sm text-muted mb-2">Preparation Status:</p>
                  <div className="flex gap-2 flex-wrap">
                    {prepStatuses.map(status => (
                      <button
                        key={status.value}
                        onClick={() => updatePrepStatus(exam.id, status.value)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          exam.prep_status === status.value
                            ? status.color + ' ring-2 ring-offset-2 ring-accent'
                            : 'bg-txt/5 text-muted hover:bg-txt/10'
                        }`}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
</PageTransition>
    </DashLayout>
  )
}