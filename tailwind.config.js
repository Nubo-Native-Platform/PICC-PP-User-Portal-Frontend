/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        'fill-available': '-webkit-fill-available',
        inherit: 'inherit',
      },
      fontFamily: {
        gothic: ['"Century Gothic"', 'sans-serif'],
      },
      letterSpacing: {
        widePt: '0.8pt',
      },
      colors: {
        primary: '#0099cc',
        secondary: '#607d8b',
        accent: '#F97316',
        muted: '#6B7280',
        surface: '#F9FAFB',
        border: '#E5E7EB',
        secondary_text: '#efefef',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.inter-grid-margin': {
          marginTop: '50px',
        },
      });
    },
  ],
};
