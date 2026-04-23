/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			pml: {
				brand: '#CB2187',
				black: '#000000',
				white: '#FFFFFF',
				text: {
					700: '#595858',
					500: '#808080',
					primary: '#CB2187',
					'base-white': '#FFFFFF'
				},
				bg: {
					alt: '#D3D3D3',
					'brand-tint': '#F6EAF2',
					base: '#F5F5F5',
					dark: '#666666'
				},
				status: {
					success: '#008A25',
					warning: '#F2C94C',
					error: '#FF0A22'
				},
				accent: {
					green: '#8ED69A',
					yellow: '#EAD891',
					flamingo: '#F56675',
					teal: '#69BBB5',
					pink: '#E7D3DF'
				}
			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
		},
		fontSize: {
			h1: ['64px', { lineHeight: '76px', fontWeight: '700', letterSpacing: '-0.01em' }],
			h2: ['48px', { lineHeight: '60px', fontWeight: '600', letterSpacing: '-0.005em' }],
			h3: ['40px', { lineHeight: '50px', fontWeight: '600', letterSpacing: '-0.0025em' }],
			h4: ['32px', { lineHeight: '40px', fontWeight: '700' }],
			h5: ['32px', { lineHeight: '40px', fontWeight: '600' }],
			h6: ['28px', { lineHeight: '36px', fontWeight: '500' }],
			h7: ['24px', { lineHeight: '32px', fontWeight: '600' }],
			h8: ['24px', { lineHeight: '32px', fontWeight: '500' }],
			h9: ['20px', { lineHeight: '30px', fontWeight: '700' }],
			h10: ['20px', { lineHeight: '30px', fontWeight: '600' }],
			h11: ['20px', { lineHeight: '30px', fontWeight: '400' }],
			'body-lg': ['18px', { lineHeight: '26px', fontWeight: '500' }],
			'body-lg-regular': ['18px', { lineHeight: '26px', fontWeight: '400' }],
			'body-bold': ['16px', { lineHeight: '24px', fontWeight: '700' }],
			'body-semibold': ['16px', { lineHeight: '24px', fontWeight: '600' }],
			'body-medium': ['16px', { lineHeight: '24px', fontWeight: '500' }],
			'body-regular': ['16px', { lineHeight: '24px', fontWeight: '400' }],
			'body-sm-semibold': ['14px', { lineHeight: '22px', fontWeight: '600', letterSpacing: '0.01em' }],
			'body-sm': ['14px', { lineHeight: '22px', fontWeight: '400', letterSpacing: '0.01em' }],
			'caption-semibold': ['13px', { lineHeight: '18px', fontWeight: '600', letterSpacing: '0.015em' }],
			caption: ['13px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '0.015em' }],
			'footnote-semibold': ['12px', { lineHeight: '18px', fontWeight: '600', letterSpacing: '0.02em' }],
			footnote: ['12px', { lineHeight: '18px', fontWeight: '400', letterSpacing: '0.02em' }]
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};