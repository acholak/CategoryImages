import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // --- Colors ---
      // Teal used sparingly: primary actions only (Generate button, focus rings, active states)
      colors: {
        teal: {
          DEFAULT: '#00CCBC',
          hover:   '#00B5A6',
          light:   '#E6FAF9', // tint for subtle backgrounds (e.g. success states)
        },
        // Neutral palette — everything else lives here
        neutral: {
          50:  '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },

      // --- Typography ---
      // System font stack — fast, familiar, no external font load
      fontFamily: {
        sans: [
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },

      // --- Border radius ---
      // Soft — everything feels rounded and approachable
      borderRadius: {
        sm:   '6px',
        DEFAULT: '8px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl': '24px',
        full: '9999px',
      },

      // --- Shadows ---
      // Gentle — present but never heavy
      boxShadow: {
        sm:  '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        DEFAULT: '0 2px 8px 0 rgb(0 0 0 / 0.08), 0 1px 3px -1px rgb(0 0 0 / 0.06)',
        md:  '0 4px 16px 0 rgb(0 0 0 / 0.08), 0 2px 6px -2px rgb(0 0 0 / 0.06)',
        lg:  '0 8px 24px 0 rgb(0 0 0 / 0.08), 0 4px 10px -4px rgb(0 0 0 / 0.06)',
        none: 'none',
      },

      // --- Spacing ---
      // Airy — generous base unit, used liberally for padding/gaps
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },

      // --- Layout ---
      // Split layout: form (left) + image preview (right)
      maxWidth: {
        'form':    '480px',  // left panel max width
        'preview': '560px',  // right panel max width
        'app':     '1160px', // overall container
      },
    },
  },
  plugins: [],
}

export default config
