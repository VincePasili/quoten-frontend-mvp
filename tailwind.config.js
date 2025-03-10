const flowbite = require("flowbite-react/tailwind");
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html',     flowbite.content(),
],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 1.5s linear infinite',
        'spin-fast': 'spin 1s linear infinite', 
      },
    },
  },
  plugins: [    flowbite.plugin(),
],
};

