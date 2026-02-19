import { useState } from 'react'
import DashLayout from '../components/DashLayout'
import { useAssignments } from '../hooks/useAssignments'
import PageTransition from '../components/PageTransition'
export default function AssignmentsPage() {
  const { assignments, loading, addAssignment, updateStatus, deleteAssignment } = useAssignments()
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    due_date: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title.trim() || !formData.due_date) return
    
    await addAssignment(formData)
    setFormData({ title: '', subject: '', due_date: '' })
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status, daysLeft) => {
    if (status === 'submitted') return { bg: 'bg-success/20', text: 'text-success', label: '✓ Submitted' }
    if (status === 'overdue' || daysLeft < 0) return { bg: 'bg-danger/20', text: 'text-danger', label: '⚠ Overdue' }
    if (daysLeft === 0) return { bg: 'bg-warning/30', text: 'text-warning', label: '⏰ Due Today' }
    if (daysLeft <= 2) return { bg: 'bg-warning/20', text: 'text-warning', label: `${daysLeft}d left` }
    return { bg: 'bg-accent2/20', text: 'text-accent2', label: `${daysLeft}d left` }
  }

  const pendingAssignments = assignments.filter(a => a.status === 'pending')
  const submittedAssignments = assignments.filter(a => a.status === 'submitted')
  const overdueAssignments = assignments.filter(a => {
    const daysLeft = getDaysUntilDue(a.due_date)
    return a.status !== 'submitted' && daysLeft < 0
  })

  if (loading) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted text-lg">Loading assignments...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
     <PageTransition>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-txt mb-2">📝 Assignment Tracker</h1>
        <p className="text-muted">Because deadlines don't care about your plans</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-warning/20 p-4 rounded-xl border border-warning/30">
          <p className="text-2xl font-bold text-txt">{pendingAssignments.length}</p>
          <p className="text-sm text-muted">Pending</p>
        </div>
        <div className="bg-danger/20 p-4 rounded-xl border border-danger/30">
          <p className="text-2xl font-bold text-txt">{overdueAssignments.length}</p>
          <p className="text-sm text-muted">Overdue</p>
        </div>
        <div className="bg-success/20 p-4 rounded-xl border border-success/30">
          <p className="text-2xl font-bold text-txt">{submittedAssignments.length}</p>
          <p className="text-sm text-muted">Submitted</p>
        </div>
      </div>

      {/* Add Assignment Form */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-txt/10 mb-8">
        <h2 className="text-xl font-semibold text-txt mb-4">Add New Assignment</h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
          <input
            type="text"
            placeholder="Assignment title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="text"
            placeholder="Subject (optional)"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-48 px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="date"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
            className="w-48 px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105"
          >
            Add Assignment
          </button>
        </form>
      </div>

      {/* Assignments List */}
      {assignments.length === 0 ? (
        <div className="bg-success p-12 rounded-xl text-center -rotate-1">
          <p className="text-txt text-xl font-semibold mb-2">No assignments yet!</p>
          <p className="text-txt/70">Either you're very responsible or very unaware.</p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {assignments.map((assignment, index) => {
            const daysLeft = getDaysUntilDue(assignment.due_date)
            const statusInfo = getStatusColor(assignment.status, daysLeft)
            
            return (
              <div
                key={assignment.id}
                className={`bg-card p-6 rounded-xl shadow-md border border-txt/10 hover:shadow-lg transition-all ${
                  index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-txt">{assignment.title}</h3>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted">
                      {assignment.subject && <span>📚 {assignment.subject}</span>}
                      <span>📅 Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {assignment.status === 'pending' && (
                      <button
                        onClick={() => updateStatus(assignment.id, 'submitted')}
                        className="px-4 py-2 bg-success text-txt rounded-lg font-semibold hover:bg-success/80 transition-all text-sm"
                      >
                        Mark Done
                      </button>
                    )}
                    {assignment.status === 'submitted' && (
                      <button
                        onClick={() => updateStatus(assignment.id, 'pending')}
                        className="px-4 py-2 bg-warning text-txt rounded-lg font-semibold hover:bg-warning/80 transition-all text-sm"
                      >
                        Undo
                      </button>
                    )}
                    <button
                      onClick={() => deleteAssignment(assignment.id)}
                      className="text-danger hover:text-danger/80 text-xl px-2"
                      title="Delete"
                    >
                      🗑️
                    </button>
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