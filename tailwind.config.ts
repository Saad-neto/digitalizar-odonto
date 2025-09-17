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
      },
      fontSize: {
        h1: "var(--h1-size)",
        h2: "var(--h2-size)",
        h3: "var(--h3-size)",
        h4: "var(--h4-size)",
        body: "var(--body-size)",
        small: "var(--small-size)",
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
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
