/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'tw-',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      white: "#FFF",
      whiteM: '#FCFCFC',

      black: "#000",

      lightgrayL: "#F8F8F8",
      lightgray: "#ECECEC",
      grey: "#DFDFDF",
      greyM: "#7C7C7C",
      greyD: "#3C3C3C",

      orange: '#DF3C3C',

      green: '#4FDF4F',

      whiteblue: '#D3E1E8',
      blue: '#186AC3',
      lightblueL: '#53A8FC',
      lightblueS: '#A1CCF2',
      lightblue: '#4A89FC',

      primary: "#02FEFE",
      "primary-dark": "#494DD4",

      background: "#002554",
      "background-light": "#142850",

      default: "#142850",

      negative: "#FC4C3C",

      positive: "#2FEE10",

      transparent: "transparent"
    },
    fontSize: {
      xxxs: "0.5rem",
      xxs: "0.65rem",
      xs: "0.80rem",
      sm: "0.875rem",
      base: "1rem",
      md: "1.125rem",
      lg: "1.25rem",
      xl: "1.5rem",
      "2xl": "1.875rem",
      "3xl": "2.25rem",
      "4xl": "3rem",
      "5xl": "4rem",
      "6xl": "6rem"
    },
    fontFamily: {
      sans: ['"Raleway"', "sans-serif"],
      gilroy: ['"Gilroy"', "monospace"],
      spaceMono: ['"SpaceMono"', "monospace"]
    },
    fontWeight: {
      thin: "300",
      regular: "400",
      "semi-bold": "600",
      bold: "700",
      "extra-bold": "900"
    },
    screens: {
      "3xs": { min: "400.98px" },
      "2xs": { min: "540.98px" },
      xs: { min: "740.98px" },
      sm: { min: "780.98px" },
      md: { min: "1024.98px" },
      mdH: { raw: "(max-height: 750.98px)" },
      lg: { min: "1280.98px" },
      xl: { min: "1920.98px" },
      "2xl": { min: "2560px" }
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: 0
          },
          to: {
            opacity: 1
          }
        },
        slideInFromLeft: {
          from: {
            opacity: 0,
            translate: "-100% 0"
          },
          to: {
            opacity: 1
          }
        },
        slideInFromRight: {
          from: {
            opacity: 0,
            translate: "100% 0"
          },
          to: {
            opacity: 1
          }
        },
        slideInFromTop: {
          from: {
            opacity: 0,
            translate: "0 -100%"
          },
          to: {
            opacity: 1
          }
        }
      },
      animation: {
        fadeIn: "fadeIn 0.5s linear forwards",
        slideInFromLeft: "slideInFromLeft 0.75s ease-out",
        slideInFromRight: "slideInFromRight 0.75s ease-out",
        slideInFromTop: "slideInFromTop 0.75s ease-out"
      }
    },
  },
  plugins: [],
}
