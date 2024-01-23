import "@mdi/font/css/materialdesignicons.css"
import "vuetify/styles"
import { createVuetify } from "vuetify"

export default createVuetify({
  theme: {
    themes: {
      light: {
        colors: {
          primary: "#215CAF",
          secondary: "#5CBBF6",
          blue: "#2196F3"
          // background: "#eef5f9",
          // surface: "#4D7DBF"
        },
      },
      dark: {
        colors: { 
          primary: "#ffff00",
        }
      },
      tableTheme: {
        colors: {
          surface: "#e2ecf7",
          // surface: "#215CAF",

        },
      }
    },
  },
})
