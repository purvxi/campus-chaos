import { useState, useEffect } from 'react'

export default function PageTransition({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Immediate mount, no delay
    setMounted(true)
  }, [])

  return (
    <div className={`w-full transition-all duration-300 ${
      mounted ? 'opacity-100' : 'opacity-0'
    }`}>
      {children}
    </div>
  )
}