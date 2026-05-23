/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--bg) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-2': 'hsl(var(--surface-2) / <alpha-value>)',
        ink: 'hsl(var(--ink) / <alpha-value>)',
        'ink-soft': 'hsl(var(--ink-soft) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        primary: 'hsl(var(--primary) / <alpha-value>)',
        'primary-soft': 'hsl(var(--primary-soft) / <alpha-value>)',
        accent: 'hsl(var(--accent) / <alpha-value>)',
        focus: 'hsl(var(--focus) / <alpha-value>)',
        'tile-garage': 'hsl(var(--tile-garage) / <alpha-value>)',
        'tile-garden': 'hsl(var(--tile-garden) / <alpha-value>)',
        'tile-shapes': 'hsl(var(--tile-shapes) / <alpha-value>)',
        'tile-race': 'hsl(var(--tile-race) / <alpha-value>)',
      },
      borderRadius: {
        xl: '1.1rem',
        '2xl': '1.6rem',
        '3xl': '2.1rem',
        '4xl': '2.75rem',
        '5xl': '3.5rem',
      },
      boxShadow: {
        soft: '0 1px 2px hsl(var(--shadow) / 0.10), 0 8px 22px -8px hsl(var(--shadow) / 0.20)',
        lift: '0 2px 6px hsl(var(--shadow) / 0.14), 0 18px 40px -14px hsl(var(--shadow) / 0.28)',
        inset: 'inset 0 2px 6px hsl(var(--shadow) / 0.16)',
      },
      transitionTimingFunction: {
        calm: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      fontSize: {
        tile: ['1.05rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],
      },
    },
  },
  plugins: [],
}
