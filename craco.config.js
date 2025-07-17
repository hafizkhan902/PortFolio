const path = require('path');

module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
}; 