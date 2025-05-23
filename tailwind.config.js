module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: {
            DEFAULT: '#2563eb',
            light: '#3b82f6',
            dark: '#1d4ed8',
          },
          secondary: {
            DEFAULT: '#6b7280',
            light: '#9ca3af',
            dark: '#4b5563',
          },
        },
      },
    },
    plugins: [],
  };