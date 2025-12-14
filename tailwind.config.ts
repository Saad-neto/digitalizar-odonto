import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          light: "hsl(var(--primary-light))",
          dark: "hsl(var(--primary-dark))",
          "ultra-light": "hsl(var(--primary-ultra-light))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
          light: "hsl(var(--success-light))",
          dark: "hsl(var(--success-dark))",
          bg: "hsl(var(--success-bg))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          light: "hsl(var(--text-light))",
        },
        gray: {
          50: "hsl(var(--bg-gray-50))",
          100: "hsl(var(--bg-gray-100))",
          200: "hsl(var(--bg-gray-200))",
        },
        blue: {
          trust: "hsl(var(--blue-trust))",
          light: "hsl(var(--blue-light))",
        },
        orange: {
          warning: "hsl(var(--orange-warning))",
          light: "hsl(var(--orange-light))",
        },
        red: {
          alert: "hsl(var(--red-alert))",
          light: "hsl(var(--red-light))",
        },
        yellow: {
          highlight: "hsl(var(--yellow-highlight))",
          light: "hsl(var(--yellow-light))",
        },
        // Redesign: Paleta profissional azul médico
        medical: {
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          300: '#93C5FD',
          400: '#60A5FA',
          500: '#0066CC',  // Principal - Azul médico
          600: '#0052A3',
          700: '#003D7A',
          800: '#002952',
          900: '#001F3F',
        },
        mint: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',  // Secundária - Verde menta
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        neutral: {
          50: '#FAFAFA',
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
        gold: {
          500: '#D4AF37',  // Acento premium
          600: '#B8941F',
        },
      },
      spacing: {
        // Redesign: Espaçamentos Behance-style
        'section': '5rem',      // 80px
        'section-lg': '6rem',   // 96px
        'section-xl': '8rem',   // 128px
        'card-padding': '2rem', // 32px
      },
      backgroundImage: {
        "gradient-hero": "var(--gradient-hero)",
        "gradient-success": "var(--gradient-success)",
        "gradient-subtle": "var(--gradient-subtle)",
        "gradient-card": "var(--gradient-card)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        cta: "var(--shadow-cta)",
        hover: "var(--shadow-hover)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Consolas", "monospace"],
        // Redesign: Serif para títulos (autoridade médica)
        heading: ["Merriweather", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        h1: "var(--h1-size)",
        h2: "var(--h2-size)",
        h3: "var(--h3-size)",
        h4: "var(--h4-size)",
        body: "var(--body-size)",
        small: "var(--small-size)",
        // Redesign: Hierarquia Behance-style
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],  // 56px
        'title-xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],   // 48px
        'title-lg': ['2.25rem', { lineHeight: '1.3' }],                          // 36px
        'title-md': ['1.5rem', { lineHeight: '1.4' }],                           // 24px
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],                          // 18px
        'body-md': ['1rem', { lineHeight: '1.6' }],                              // 16px
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],                          // 14px
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "scale-in": {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        },
        "slide-up": {
          "0%": {
            transform: "translateY(100%)",
            opacity: "0"
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1"
          }
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: ".8" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-up": "slide-up 0.4s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
