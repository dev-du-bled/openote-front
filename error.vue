<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps({
  error: Object as () => NuxtError,
});
</script>

<template>
  <v-app>
    <Header />
    <v-main>
      <v-container class="text-center">
        <h1 v-if="error" class="font-weight-black text-h1">
          {{ error.statusCode }}
        </h1>
        <p v-if="error" class="my-4">{{ error.message }}</p>
        <h1 v-else>Unknown error !</h1>
        <v-btn prepend-icon="mdi-arrow-left-bold" variant="tonal" to="/"
          >Go back home</v-btn
        >
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>
