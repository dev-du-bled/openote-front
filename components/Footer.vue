<template>
  <v-footer
    class="text-body-2 d-flex flex-column text-medium-emphasis bg-transparent"
  >
    <div v-if="devMode" class="w-100 text-center">
      This is a development build. Do not use in production.
    </div>
    OpeNote - {{ new Date().getFullYear() }}
  </v-footer>
</template>

<script setup>
const devMode = computed(() => import.meta.env.DEV);
</script>
