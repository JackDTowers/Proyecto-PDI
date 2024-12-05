/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  //Para evitar problemas con los estilos del material angular (estilos creados para suavizar inconsistencias entre navegadores)
  // corePlugins: {
  //   preflight: false,
  // },
}

