/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.7s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'gradient': 'gradient 6s ease infinite',
        'typing': 'typing 3.5s steps(30, end) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backgroundSize: {
        '200%': '200% 200%',
      },
    },
  },
  plugins: [],
  safelist: [
    // Dynamic skill category colors
    'bg-cyan-500/10', 'text-cyan-400', 'border-cyan-500/30', 'hover:border-cyan-400',
    'from-cyan-500/5', 'border-cyan-500/20', 'text-cyan-400',
    'bg-violet-500/10', 'text-violet-400', 'border-violet-500/30', 'hover:border-violet-400',
    'from-violet-500/5', 'border-violet-500/20',
    'bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30', 'hover:border-emerald-400',
    'from-emerald-500/5', 'border-emerald-500/20',
    'bg-orange-500/10', 'text-orange-400', 'border-orange-500/30', 'hover:border-orange-400',
    'from-orange-500/5', 'border-orange-500/20',
    'bg-pink-500/10', 'text-pink-400', 'border-pink-500/30', 'hover:border-pink-400',
    'from-pink-500/5', 'border-pink-500/20',
    'bg-yellow-500/10', 'text-yellow-400', 'border-yellow-500/30', 'hover:border-yellow-400',
    'from-yellow-500/5', 'border-yellow-500/20',
  ],
}
