import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#1476ff',
        'secondary': '#f3f5ff',
        'light': '#f9faff',
        'light-background': '#e1e7f2',
        'light-options': '#f3f5ff',
        'light-text': '#000000',
        'dark-background': '#0f172a',
        'dark-options': '#1e293b',
        'dark-text': '#ffffff',
        'trueDark-background': '#000000',
        'trueDark-options': '#181818',
        'trueDark-text': '#ffffff',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
