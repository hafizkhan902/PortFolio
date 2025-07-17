/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0D1117',
          light: '#FFFFFF'
        },
        accent: {
          blue: '#2563EB',    // Changed from #00FFFF to a more visible blue
          green: '#10B981',   // Changed from #39FF14 to a more balanced green
          purple: '#8B5CF6'   // Changed from #C084FC to a stronger purple
        },
        text: {
          dark: '#F3F4F6',    // Slightly adjusted for better readability
          light: '#111827'    // Slightly adjusted for better contrast
        }
      },
      fontFamily: {
        space: ['Space Grotesk', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif']
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}; 