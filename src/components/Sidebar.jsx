import { NavLink } from 'react-router-dom'

const links = [
  { to: '/dashboard',    icon: '🏠', label: 'Dashboard'   },
  { to: '/attendance',   icon: '📊', label: 'Attendance'  },
  { to: '/bunk',         icon: '🧮', label: 'Bunk Calc'   },
  { to: '/assignments',  icon: '📝', label: 'Assignments' },
  { to: '/exams',        icon: '📚', label: 'Exams'       },
  { to: '/damage',       icon: '💀', label: 'Damage Report'},
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-txt/10 flex flex-col py-8 px-4">
      
      {/* Logo */}
      <div className="mb-10 px-2">
        <h2 className="text-xl font-bold text-txt">
          <span className="text-accent">Campus</span>
          <span className="text-accent2">Chaos</span>
        </h2>
        <p className="text-muted text-xs mt-1">Student Survival Kit</p>
      </div>
      
      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-lg
              transition-all duration-200 font-medium text-sm
              ${isActive 
                ? 'bg-accent text-white shadow-md' 
                : 'text-txt hover:bg-txt/5 hover:translate-x-1'
              }
            `}
          >
            <span className="text-xl">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      
      {/* Footer */}
      <div className="mt-auto pt-6 px-2 border-t border-txt/10">
        <p className="text-muted text-xs italic">
          "Organized chaos is still chaos."
        </p>
      </div>
      
    </aside>
  )
}