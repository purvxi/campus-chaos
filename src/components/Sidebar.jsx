import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'

const links = [
  { to: '/dashboard',    icon: '🏠', label: 'Dashboard'   },
  { to: '/attendance',   icon: '📊', label: 'Attendance'  },
  { to: '/bunk',         icon: '🧮', label: 'Bunk Calc'   },
  { to: '/assignments',  icon: '📝', label: 'Assignments' },
  { to: '/exams',        icon: '📚', label: 'Exams'       },
  { to: '/damage',       icon: '💀', label: 'Damage Report'},
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsOpen(false) // Auto-close on mobile
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
       <button
       onClick={() => setIsOpen(!isOpen)}
       className="fixed top-3 left-3 z-50 bg-accent text-white p-2 rounded-lg shadow-lg md:hidden text-xl"
     >
       {isOpen ? '✕' : '☰'}
     </button>
      )}

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        ${isMobile ? 'fixed top-0 left-0 h-full z-40' : 'relative'}
        min-h-screen bg-card border-r border-txt/10 flex flex-col py-8 transition-all duration-300
        ${isOpen ? 'w-64 px-4' : isMobile ? '-translate-x-full w-64 px-4' : 'w-20 px-2'}
      `}>
        
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between mb-10 px-2">
          {isOpen && (
            <div>
              <h2 className="text-xl font-bold text-txt">
                <span className="text-accent">Campus</span>
                <span className="text-accent2">Chaos</span>
              </h2>
              <p className="text-muted text-xs mt-1">Student Survival Kit</p>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-2xl hover:scale-110 transition-transform ml-auto"
              title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isOpen ? '◀' : '▶'}
            </button>
          )}
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col gap-1">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={() => isMobile && setIsOpen(false)}
              title={!isOpen ? link.label : ''}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-lg
                transition-all duration-200 font-medium text-sm
                ${isActive 
                  ? 'bg-accent text-white shadow-md' 
                  : 'text-txt hover:bg-txt/5 hover:translate-x-1'
                }
                ${!isOpen && !isMobile && 'justify-center'}
              `}
            >
              <span className="text-base md:text-xl">{link.icon}</span>
              {(isOpen || isMobile) && link.label}
            </NavLink>
          ))}
        </nav>
        
        {/* Footer */}
        {isOpen && (
          <div className="mt-auto pt-6 px-2 border-t border-txt/10">
            <p className="text-muted text-xs italic">
              "Organized chaos is still chaos."
            </p>
          </div>
        )}
        
      </aside>
    </>
  )
}