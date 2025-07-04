/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-black': '#051316',
        'primary-red': '#ec2e3a',
        'accent-pink': '#e9357b',
        'primary-white': '#ffffff',
        'neutral-50': '#fafafa',
        'neutral-100': '#f5f4f5',
        'neutral-200': '#e7e4e7',
        'neutral-400': '#aaa1a9',
        'neutral-600': '#535353',
        'neutral-800': '#2a272a',
        'accent-dark-red': '#ce0026',
        'accent-burgundy': '#541142',
        'accent-soft-red': '#ffdfda',
        'accent-soft-pink': '#faccde',
        'accent-rose': '#fff4f6',
        'accent-yellow': '#f4b640',
        'persian': '#5b3353',
        'accent-persian': '#210d25',
        'accent-persian-50': '#f6e2ed',
        'accent-persian-100': '#d3bdcd',
        'accent-persian-200': '#ae94a8',
        'accent-persian-400': '#734f6b',
        'accent-persian-500': '#5b3353',
        'accent-persian-600': '#502c4a',
        'accent-persian-800': '#311832',
        'gray-1': '#f1ecf1',
        'gray-2': '#d8d8d8',
        'gray-3': '#b1aeb1',
        'gray-4': '#928f92',
        'gray-5': '#737373',
        'gray-7': '#333333',
        'border-dark': 'rgba(0, 0, 0, 0.14)',
        'border-light': 'rgba(255, 255, 255, 0.25)',
        'accent-pink-200': '#fce7f3'
      },
      spacing: {
        'xs': '4px',
        'md': '16px',
        'lg': '24px',
        'xl': '40px',
        'xxl': '64px'
      },
      borderRadius: {
        'xs': '12px',
        'sm': '16px',
        'xl': '24px'
      },
      fontSize: {
        'xl': '48px',
        'xxl': '64px'
      }
    },
  },
  plugins: [],
};