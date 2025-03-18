/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: '0.5rem',
  			md: '0.375rem',
  			sm: '0.25rem'
  		},
  		colors: {
  			border: 'rgb(229, 231, 235)',
  			background: 'rgb(249, 250, 251)',
  			foreground: 'rgb(17, 24, 39)',
  			primary: {
  				DEFAULT: 'rgb(252, 146, 60)',
  				foreground: 'rgb(255, 255, 255)'
  			},
  			secondary: {
  				DEFAULT: 'rgb(243, 244, 246)',
  				foreground: 'rgb(17, 24, 39)'
  			},
  			muted: {
  				DEFAULT: 'rgb(107, 114, 128)',
  				foreground: 'rgb(107, 114, 128)'
  			},
  			accent: {
  				DEFAULT: 'rgb(17, 24, 39)',
  				foreground: 'rgb(255, 255, 255)'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} 