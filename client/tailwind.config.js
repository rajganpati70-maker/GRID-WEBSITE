/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'grid-black': '#000008',
        'grid-dark': '#050514',
        'grid-navy': '#080820',
        'grid-cyan': '#00d4ff',
        'grid-blue': '#0066ff',
        'grid-purple': '#7b2fff',
        'grid-silver': '#c0cfe8',
        'grid-glow': '#00d4ff33',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'rajdhani': ['Rajdhani', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'neon-cyan': '0 0 20px #00d4ff55, 0 0 60px #00d4ff22',
        'neon-blue': '0 0 20px #0066ff55, 0 0 60px #0066ff22',
        'neon-purple': '0 0 20px #7b2fff55, 0 0 60px #7b2fff22',
        'neon-sm': '0 0 10px #00d4ff44',
        'card': '0 4px 40px rgba(0,212,255,0.08), 0 0 0 1px rgba(0,212,255,0.12)',
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)",
        'radial-glow': "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)",
        'hero-gradient': "radial-gradient(ellipse at top, rgba(0,102,255,0.2) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(123,47,255,0.15) 0%, transparent 60%)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'scan': 'scan 8s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px #00d4ff44' },
          '100%': { boxShadow: '0 0 30px #00d4ff, 0 0 60px #00d4ff55' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        }
      }
    },
  },
  plugins: [],
}
