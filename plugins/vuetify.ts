/// Author: Firmin BORRACINO
///
/// Description: Adds the vuetify components to the project

import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { VCalendar } from "vuetify/labs/VCalendar";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // Vuetify config goes here
    components: {
      VCalendar,
    },
    theme: {
      // defaultTheme: "dark",
    },
    ssr: true,
  });
  app.vueApp.use(vuetify);
});
