import DashLayout from '../components/DashLayout'
import { useSubjects } from '../hooks/useSubjects'
import PageTransition from '../components/PageTransition'
export default function BunkPage() {
  const { subjects, loading } = useSubjects()

  const getBunkInfo = (subject) => {
    if (subject.total === 0) {
      return {
        canBunk: 0,
        status: 'No data',
        message: 'Attend some classes first, then we can calculate.',
        color: 'text-muted',
        bgColor: 'bg-muted/20'
      }
    }

    const current = (subject.attended / subject.total) * 100
    const required = subject.required || 75

    // Calculate: How many can I bunk before dropping below required%?
    let safeBunks = 0
    let testAttended = subject.attended
    let testTotal = subject.total

    while (true) {
      testTotal += 1
      const newPercentage = (testAttended / testTotal) * 100
      if (newPercentage < required) break
      safeBunks += 1
    }

    if (current < required) {
      // Already below threshold - need to recover
      let classesNeeded = 0
      let recoverAttended = subject.attended
      let recoverTotal = subject.total

      while ((recoverAttended / recoverTotal) * 100 < required) {
        recoverAttended += 1
        recoverTotal += 1
        classesNeeded += 1
        if (classesNeeded > 50) break // Safety limit
      }

      return {
        canBunk: 0,
        status: 'At Risk',
        message: `You need to attend ${classesNeeded} consecutive classes to recover.`,
        color: 'text-danger',
        bgColor: 'bg-danger/20'
      }
    }

    if (safeBunks === 0) {
      return {
        canBunk: 0,
        status: 'Critical',
        message: 'You cannot miss even one class without consequences.',
        color: 'text-warning',
        bgColor: 'bg-warning/30'
      }
    }

    if (safeBunks >= 5) {
      return {
        canBunk: safeBunks,
        status: 'Safe Zone',
        message: `You can safely miss ${safeBunks} classes. But should you?`,
        color: 'text-success',
        bgColor: 'bg-success/20'
      }
    }

    return {
      canBunk: safeBunks,
      status: 'Moderate',
      message: `You can bunk ${safeBunks} ${safeBunks === 1 ? 'class' : 'classes'}. Use wisely.`,
      color: 'text-accent2',
      bgColor: 'bg-accent2/20'
    }
  }

  if (loading) {
    return (
      <DashLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted text-lg">Calculating bunk capacity...</p>
        </div>
      </DashLayout>
    )
  }

  return (
    <DashLayout>
      <PageTransition>
      {/* Header */}
<div className="mb-6 md:mb-8">
  <h1 className="text-3xl md:text-4xl font-bold text-txt mb-2">🧮 Can I Bunk?</h1>
  <p className="text-sm md:text-base text-muted">The eternal student question, mathematically answered</p>
</div>

      {subjects.length === 0 ? (
        <div className="bg-success p-12 rounded-xl text-center rotate-1">
          <p className="text-txt text-xl font-semibold mb-2">No subjects to analyze!</p>
          <p className="text-txt/70">Add subjects in Attendance Tracker first.</p>
          <button 
            onClick={() => window.location.href = '/attendance'}
            className="mt-6 px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent/90"
          >
            Go to Attendance →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {subjects.map((subject, index) => {
            const bunkInfo = getBunkInfo(subject)
            const currentPercentage = subject.total > 0 
              ? ((subject.attended / subject.total) * 100).toFixed(1)
              : 0

            return (
              <div
                key={subject.id}
                className={`bg-card p-6 rounded-xl shadow-md border border-txt/10 hover:shadow-lg transition-all ${
                  index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'
                }`}
              >
                {/* Subject Header */}
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-txt mb-1">{subject.name}</h3>
                  <p className="text-muted text-sm">
                    Current: {currentPercentage}% • Required: {subject.required}%
                  </p>
                </div>

                {/* Bunk Verdict */}
                <div className={`${bunkInfo.bgColor} ${bunkInfo.color} p-6 rounded-lg text-center mb-4`}>
                  <p className="text-5xl font-bold mb-2">
                    {bunkInfo.canBunk === 0 ? '🚫' : '✓'}
                  </p>
                  <p className="text-3xl font-bold mb-1">{bunkInfo.canBunk}</p>
                  <p className="text-sm uppercase tracking-widest opacity-80 mb-3">{bunkInfo.status}</p>
                  <p className="text-sm italic">{bunkInfo.message}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-txt/5 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-txt">{subject.attended}</p>
                    <p className="text-xs text-muted">Attended</p>
                  </div>
                  <div className="bg-txt/5 p-3 rounded-lg">
                    <p className="text-2xl font-bold text-txt">{subject.total - subject.attended}</p>
                    <p className="text-xs text-muted">Missed</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer Note */}
      {subjects.length > 0 && (
        <div className="mt-8 bg-warning/20 p-6 rounded-xl border border-warning/30">
          <p className="text-txt text-sm">
            <strong>⚠️ Disclaimer:</strong> This calculator assumes consistent attendance moving forward. 
            Bunking strategically is an art. Use this data wisely (or ignore it and face consequences).
          </p>
        </div>
      )}
</PageTransition>
    </DashLayout>
  )
}