/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
        },
        report: {
          dark: '#0f172a',
          darkSoft: '#1e293b',
          muted: '#64748b',
          mutedLight: '#94a3b8',
          /** Verde/teal do print - badges, destaque "Tecnologia", botões */
          accent: '#0d9488',
          accentLight: '#5eead4',
          accentMuted: '#99f6e4',
          pastel: {
            green: '#dcfce7',
            greenBorder: '#86efac',
            blue: '#dbeafe',
            blueBorder: '#93c5fd',
            orange: '#ffedd5',
            orangeBorder: '#fdba74',
            yellow: '#fef9c3',
            yellowBorder: '#fde047',
            lavender: '#ede9fe',
            lavenderBorder: '#c4b5fd',
          },
          offWhite: '#f8fafc',
          card: '#ffffff',
          /** Bordas dos blocos Próximos Passos */
          borderBlue: '#e2e8f0',
          borderPurple: '#e9d5ff',
          /** Resumo Executivo (Figma): título em duas cores */
          titleGreen: '#22c55e',
          titlePurple: '#a855f7',
        },
      },
      backgroundImage: {
        'report-lightning-gradient': 'linear-gradient(to bottom, #22c55e, #a855f7)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        report: '1rem',
        'report-lg': '1.25rem',
        'report-xl': '1.5rem',
        'report-2xl': '2rem',
        /** Card Resumo Executivo (Figma): 16–24px */
        'report-card': '1.5rem',
      },
      boxShadow: {
        report: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'report-md': '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        'report-lg': '0 10px 15px -3px rgb(0 0 0 / 0.06), 0 4px 6px -4px rgb(0 0 0 / 0.06)',
        'report-soft': '0 2px 8px rgb(0 0 0 / 0.04)',
        /** Card Resumo Executivo (Figma 8-1692): sombra suave e difusa */
        'report-executive-card': '0 2px 12px 0 rgb(0 0 0 / 0.06)',
      },
      spacing: {
        'section': '4rem',
        'section-lg': '5rem',
        'card': '1.5rem',
        'card-lg': '2rem',
      },
      maxWidth: {
        report: '72rem',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'float-visible': {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-16px) rotate(2deg)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'float-visible': 'float-visible 5.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
