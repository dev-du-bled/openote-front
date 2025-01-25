<template>
  <v-card
    title="My attendance"
    :disabled="componentLoading"
    :loading="componentLoading"
  >
    <template v-slot:append>
      <v-btn to="/student/attendance" icon="mdi-open-in-new" variant="text">
      </v-btn>
    </template>
    <v-card-text v-if="!componentLoading">
      <p class="text-center text-grey">
        Not implemented, this is a dummy loading time
      </p>
    </v-card-text>
    <v-card-text v-else>
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
      ></v-skeleton-loader>
      <v-divider />
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
      ></v-skeleton-loader>
      <v-divider />
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
        class="mb-4"
      ></v-skeleton-loader>
    </v-card-text>
    <v-snackbar v-model="errorSnackbar" color="error" :timer="true">
      <p>Error when updating homework status</p>
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
const componentLoading = ref(true)
const errorSnackbar = ref(false)

onMounted(() => {
  setTimeout(() => {
    componentLoading.value = false;
  }, 2000);
});
</script>
