module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"] ,
  theme: {
    extend: {
      colors: {
        glacier: {
          50: '#f5f9fc',
          100: '#e6f0f8',
          200: '#cbe0f0',
          300: '#9fc6e3',
          400: '#6aa8d3',
          500: '#2f6fa1',
          600: '#275979',
          700: '#1d4256',
          800: '#132d38',
          900: '#0b1b22'
        },
        indigo: {
          50: '#f5f7ff',
          100: '#eef2ff',
          200: '#e0e7ff',
          300: '#c7d2fe',
          400: '#a5b4fc',
          500: '#6475f9',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#2b236f'
        },
        earth: {
          50: '#fbfaf8',
          100: '#f4efe7',
          200: '#e8dccf',
          300: '#d2bfa7',
          400: '#b8926f',
          500: '#8b7754',
          600: '#6f5c45',
          700: '#554436',
          800: '#3b2f27',
          900: '#221815'
        },
        saffron: {
          50: '#fff9f1',
          100: '#fff3e0',
          200: '#ffe7b8',
          300: '#ffd77a',
          400: '#ffc44a',
          500: '#ffb703',
          600: '#e69a03',
          700: '#b37002',
          800: '#7d4901',
          900: '#4c2b00'
        },
        pine: {
          50: '#f6fbf8',
          100: '#eef7ef',
          200: '#def0dd',
          300: '#bfe0bf',
          400: '#8fbf93',
          500: '#0b3d2e',
          600: '#0a3427',
          700: '#07261f',
          800: '#051918',
          900: '#030c0b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
        28: '7rem',
        36: '9rem'
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px'
      }
    }
  },
  plugins: [],
}
