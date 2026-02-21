import { useState } from 'react'
import DashLayout from '../components/DashLayout'
import PageTransition from '../components/PageTransition'
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
    
    if (!formData.name || !formData.name.trim()) {
      alert('Please enter a subject name')
      return
    }
    
    const subjectData = {
      name: formData.name.trim(),
      total: parseInt(formData.total) || 0,
      attended: parseInt(formData.attended) || 0,
      required: parseInt(formData.required) || 75
    }
    
    const result = await addSubject(subjectData)
    
    if (result) {
      setFormData({ name: '', total: 0, attended: 0, required: 75 })
    }
  }

  const getAttendanceStatus = (subject) => {
    if (!subject.total || subject.total === 0) {
      return {
        percentage: 0,
        color: 'text-muted',
        bgColor: 'bg-muted/20',
        status: 'No Data',
        remark: 'Start attending… maybe.'
      }
    }
  
    const percentage = (subject.attended / subject.total) * 100
    const required = subject.required || 75
  
    if (percentage >= required + 10) {
      return {
        percentage: percentage.toFixed(1),
        color: 'text-success',
        bgColor: 'bg-success/20',
        status: 'Safe Zone',
        remark: 'Relax. You can afford a bunk.'
      }
    } else if (percentage >= required) {
      return {
        percentage: percentage.toFixed(1),
        color: 'text-accent2',
        bgColor: 'bg-accent2/20',
        status: 'On Track',
        remark: 'Careful. You’re on the edge.'
      }
    } else if (percentage >= required - 5) {
      return {
        percentage: percentage.toFixed(1),
        color: 'text-warning',
        bgColor: 'bg-warning/30',
        status: 'Warning',
        remark: 'One more bunk and you’re in danger.'
      }
    } else {
      return {
        percentage: percentage.toFixed(1),
        color: 'text-danger',
        bgColor: 'bg-danger/20',
        status: 'At Risk',
        remark: 'Attend class. Immediately.'
      }
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
      <PageTransition>
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">📊 Attendance Tracker</h1>
          <p className="text-sm md:text-base text-muted">Monitor your presence (or strategic absence)</p>
        </div>

        {/* Add Subject Form */}
        <div className="bg-card p-4 md:p-6 rounded-xl shadow-md border border-txt/10 mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-semibold text-txt mb-4">Add New Subject</h2>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-txt text-xs font-medium mb-1">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g., Data Structures"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                required
              />
            </div>
            
            <div className="w-full sm:w-32">
              <label className="block text-txt text-xs font-medium mb-1">Total Classes</label>
              <input
                type="number"
                placeholder="0"
                value={formData.total}
                onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                min="0"
              />
            </div>
            
            <div className="w-full sm:w-32">
              <label className="block text-txt text-xs font-medium mb-1">Attended</label>
              <input
                type="number"
                placeholder="0"
                value={formData.attended}
                onChange={(e) => setFormData({ ...formData, attended: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                min="0"
              />
            </div>
            
            <div className="w-full sm:w-32">
              <label className="block text-txt text-xs font-medium mb-1">Required %</label>
              <input
                type="number"
                placeholder="75"
                value={formData.required}
                onChange={(e) => setFormData({ ...formData, required: parseInt(e.target.value) || 75 })}
                className="w-full px-4 py-2 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                min="0"
                max="100"
              />
            </div>
            
            <div className="w-full sm:w-auto flex items-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105 text-sm"
              >
                Add Subject
              </button>
            </div>
          </form>
          
          <p className="text-xs text-muted mt-3 italic">
            💡 <strong>Required %:</strong> Your college's minimum attendance requirement (usually 75%)
          </p>
        </div>

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <div className="bg-[#FFDAB9] p-8 md:p-12 rounded-xl text-center rotate-1">
            <p className="text-txt text-lg md:text-xl font-semibold mb-2">No subjects yet!</p>
            <p className="text-txt/70 text-sm md:text-base">Add your first subject above to start tracking attendance.</p>
            <p className="text-txt/50 text-xs md:text-sm mt-4 italic">"The first step is admitting you have classes."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {subjects.map((subject, index) => {
              const status = getAttendanceStatus(subject)
              return (
                <div
                  key={subject.id}
                  className={`bg-card p-4 md:p-6 rounded-xl shadow-md border border-txt/10 hover:shadow-lg transition-all animate-fade-in ${
                    index % 3 === 0 ? 'hover:-rotate-1' : index % 3 === 1 ? 'hover:rotate-1' : 'hover:-rotate-2'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Subject Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-txt">{subject.name}</h3>
                      <p className="text-muted text-xs md:text-sm">
                        {subject.attended} / {subject.total} classes attended
                      </p>
                    </div>
                    <button
                      onClick={() => deleteSubject(subject.id)}
                      className="text-danger hover:text-danger/80 text-lg md:text-xl"
                      title="Delete subject"
                    >
                      🗑️
                    </button>
                  </div>

                  {/* Percentage & Status */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-2xl md:text-3xl font-bold ${status.color}`}>
                        {status.percentage}%
                      </span>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.bgColor} ${status.color}`}>
                        {status.status}
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <p className="text-xs italic text-muted mt-2 text-center">
  {status.remark}
</p>
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
                      className="flex-1 bg-success text-txt font-semibold py-2 rounded-lg hover:bg-success/80 transition-all hover:scale-105 text-sm"
                    >
                      ✓ Present
                    </button>
                    <button
                      onClick={() => markAbsent(subject.id)}
                      className="flex-1 bg-danger text-white font-semibold py-2 rounded-lg hover:bg-danger/80 transition-all hover:scale-105 text-sm"
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

      </PageTransition>
    </DashLayout>
  )
}