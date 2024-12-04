<template>
  <ClientOnly>
    <v-container v-if="userStatus == 'student'">
      <v-row>
        <v-col :cols="mobile ? 12 : 5">
          <dashboard-day-calendar />
        </v-col>
        <v-col :cols="mobile ? 12 : 7">
          <v-row>
            <v-col>
              <dashboard-student-homework />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <dashboard-student-marks />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <dashboard-student-attendance />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <v-container v-else-if="userStatus == 'teacher'">
      <v-row>
        <v-col :cols="mobile ? 12 : 5">
          <dashboard-day-calendar />
        </v-col>
        <v-col :cols="mobile ? 12 : 7">
          <v-row>
            <v-col>
              <dashboard-teacher-homework />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <dashboard-teacher-marks />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { userStatus } from "@/composables/useCurrentUser";

const { mobile } = useDisplay();

useHead({
  title: "Dashboard",
});
</script>
