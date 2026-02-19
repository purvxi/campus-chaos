import { useState } from 'react'
import DashLayout from '../components/DashLayout'
import { useSubjects } from '../hooks/useSubjects'

export default function AttendancePage() {
  const { subjects, loading, addSubject, markPresent, markAbsent, deleteSubject } = useSubjects()
  
  const [formData, setFormData] = useState({
    name: '',
    total: 0,
    attended: 0,
    required: 75
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    
    await addSubject(formData)
    setFormData({ name: '', total: 0, attended: 0, required: 75 })
  }

  const getAttendanceStatus = (subject) => {
    if (subject.total === 0) return { percentage: 0, color: 'text-muted', bgColor: 'bg-muted/20', status: 'No data' }
    
    const percentage = (subject.attended / subject.total) * 100
    const required = subject.required || 75
    
    if (percentage >= required + 10) {
      return { percentage: percentage.toFixed(1), color: 'text-success', bgColor: 'bg-success/20', status: 'Safe Zone' }
    } else if (percentage >= required) {
      return { percentage: percentage.toFixed(1), color: 'text-accent2', bgColor: 'bg-accent2/20', status: 'On Track' }
    } else if (percentage >= required - 5) {
      return { percentage: percentage.toFixed(1), color: 'text-warning', bgColor: 'bg-warning/30', status: 'Warning' }
    } else {
      return { percentage: percentage.toFixed(1), color: 'text-danger', bgColor: 'bg-danger/20', status: 'At Risk' }
    }
  }

  if (loading) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted text-lg">Loading your subjects...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-txt mb-2">📊 Attendance Tracker</h1>
        <p className="text-muted">Monitor your presence (or strategic absence)</p>
      </div>

      {/* Add Subject Form */}
      <div className="bg-card p-6 rounded-xl shadow-md border border-txt/10 mb-8">
        <h2 className="text-xl font-semibold text-txt mb-4">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Subject name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
            required
          />
          <input
            type="number"
            placeholder="Total classes"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })}
            className="w-32 px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="Attended"
            value={formData.attended}
            onChange={(e) => setFormData({ ...formData, attended: parseInt(e.target.value) || 0 })}
            className="w-32 px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <input
            type="number"
            placeholder="Required %"
            value={formData.required}
            onChange={(e) => setFormData({ ...formData, required: parseInt(e.target.value) || 75 })}
            className="w-32 px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105"
          >
            Add Subject
          </button>
        </form>
      </div>

      {/* Subjects List */}
      {subjects.length === 0 ? (
        <div className="bg-[#FFDAB9] p-12 rounded-xl text-center rotate-1">
          <p className="text-txt text-xl font-semibold mb-2">No subjects yet!</p>
          <p className="text-txt/70">Add your first subject above to start tracking attendance.</p>
          <p className="text-txt/50 text-sm mt-4 italic">"The first step is admitting you have classes."</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject, index) => {
            const status = getAttendanceStatus(subject)
            return (
              <div
                key={subject.id}
                className={`bg-card p-6 rounded-xl shadow-md border border-txt/10 hover:shadow-lg transition-all ${
                  index % 3 === 0 ? 'hover:-rotate-1' : index % 3 === 1 ? 'hover:rotate-1' : 'hover:-rotate-2'
                }`}
              >
                {/* Subject Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-txt">{subject.name}</h3>
                    <p className="text-muted text-sm">
                      {subject.attended} / {subject.total} classes attended
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="text-danger hover:text-danger/80 text-xl"
                    title="Delete subject"
                  >
                    🗑️
                  </button>
                </div>

                {/* Percentage & Status */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-3xl font-bold ${status.color}`}>
                      {status.percentage}%
                    </span>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                      {status.status}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-txt/10 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        status.color === 'text-success' ? 'bg-success' :
                        status.color === 'text-accent2' ? 'bg-accent2' :
                        status.color === 'text-warning' ? 'bg-warning' :
                        'bg-danger'
                      }`}
                      style={{ width: `${Math.min(parseFloat(status.percentage), 100)}%` }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => markPresent(subject.id)}
                    className="flex-1 bg-success text-txt font-semibold py-2 rounded-lg hover:bg-success/80 transition-all hover:scale-105"
                  >
                    ✓ Present
                  </button>
                  <button
                    onClick={() => markAbsent(subject.id)}
                    className="flex-1 bg-danger text-white font-semibold py-2 rounded-lg hover:bg-danger/80 transition-all hover:scale-105"
                  >
                    ✗ Absent
                  </button>
                </div>

                {/* Required Threshold */}
                <p className="text-muted text-xs text-center mt-3">
                  Required: {subject.required}%
                </p>
              </div>
            )
          })}
        </div>
      )}

    </DashLayout>
  )
}