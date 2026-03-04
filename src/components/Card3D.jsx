import { useState } from 'react'

export default function Card3D({ children, className = '', onClick, subtle = false }) {
  const [transform, setTransform] = useState('')

  const handleMouseMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // FIXED: Reduced rotation angles for subtle effect (especially for auth pages)
    const intensity = subtle ? 3 : 10
    const rotateX = ((y - centerY) / centerY) * -(intensity / 3)
    const rotateY = ((x - centerX) / centerX) * (intensity / 3)
    const scale = subtle ? 1.01 : 1.02
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  }

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{ 
        transform,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
