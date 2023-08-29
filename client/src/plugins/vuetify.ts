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
          // background: "#215CAF",
          // surface: "#4D7DBF"
        },
      },
      dark: {},
      tableTheme: {
        dark: false,
        colors: {
          surface: "#F5F5F5",
        },
      }
    },
  },
})
