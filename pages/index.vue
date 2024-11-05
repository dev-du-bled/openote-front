<template>
  <v-container>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useDate, useDisplay } from "vuetify";

const { mobile } = useDisplay();

const homeworkDone = ref(false);
const homeworkDone2 = ref(false);
const homeworkDone3 = ref(false);

useHead({
  title: "Dashboard",
});
</script>
