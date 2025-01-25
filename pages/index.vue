<template>
  <ClientOnly>
    <!-- The student dashboard layout -->
    <v-container v-if="userRole == 'student'">
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
    <!-- The teacher dashboard layout -->
    <v-container v-else-if="userRole == 'teacher'">
      <v-row>
        <v-col :cols="mobile ? 12 : 5">
          <dashboard-day-calendar />
        </v-col>
        <v-col :cols="mobile ? 12 : 7">
          <v-row>
            <v-col>
              <dashboard-teacher-unrecorded-attendance />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <dashboard-teacher-schedules-exams />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <!-- Admin -->
    <v-container v-else-if="userRole == 'admin'">
      <h1>Welcome, {{ user?.firstname }} !</h1>
    </v-container>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";

const user = useUser();
const userRole = computed(() => user.value?.role);

const { mobile } = useDisplay();

useHead({
  title: "Dashboard",
});
</script>
