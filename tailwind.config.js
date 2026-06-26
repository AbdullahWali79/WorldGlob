/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 0 40px rgba(56, 189, 248, 0.22)'
      },
      backgroundImage: {
        'space-gradient':
          'radial-gradient(circle at 20% 20%, rgba(59,130,246,0.18), transparent 25%), radial-gradient(circle at 80% 0%, rgba(34,197,94,0.12), transparent 24%), linear-gradient(180deg, #040712 0%, #050816 45%, #02040b 100%)'
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -10px, 0)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.45, transform: 'scale(1)' },
          '50%': { opacity: 0.9, transform: 'scale(1.04)' }
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      },
      animation: {
        drift: 'drift 12s ease-in-out infinite',
        pulseGlow: 'pulseGlow 5s ease-in-out infinite',
        floatSlow: 'floatSlow 8s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
