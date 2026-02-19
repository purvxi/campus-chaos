export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:      '#FFF8F0',
        card:    '#FFFBF5',
        accent:  '#FF6B6B',
        accent2: '#4ECDC4',
        warning: '#FFE66D',
        danger:  '#FF6B6B',
        success: '#95E1D3',
        txt:     '#2F2F2F',
        muted:   '#6B6B6B',
        purple:  '#A8DADC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-delayed': 'fadeIn 0.8s ease-out 0.3s both',
        'fade-in-last': 'fadeIn 1s ease-out 1.2s both',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out 0.2s both',
        'bounce-in': 'bounceIn 0.6s ease-out 0.8s both',
        'card-1': 'cardSlideUp 0.5s ease-out 0.4s both',
        'card-2': 'cardSlideUp 0.5s ease-out 0.5s both',
        'card-3': 'cardSlideUp 0.5s ease-out 0.6s both',
        'count-up': 'pulse 1.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(30px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        cardSlideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
  