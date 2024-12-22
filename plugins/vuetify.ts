import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { VCalendar } from "vuetify/labs/VCalendar";
import { createVuetify } from "vuetify";
import { VDateInput } from "vuetify/lib/labs/components.mjs";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    components: {
      VCalendar,
      VDateInput,
    },
    theme: {
      // defaultTheme: "dark",
    },
    ssr: true,
  });
  app.vueApp.use(vuetify);
});
