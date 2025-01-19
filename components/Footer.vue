<template>
  <v-footer
    class="text-body-2 d-flex flex-column text-medium-emphasis bg-transparent"
  >
    <div v-if="devMode" class="w-100 text-center">
      🚧 You're currently running in development mode. 🚧
    </div>
    OpeNote - {{ new Date().getFullYear() }}
  </v-footer>
</template>

<script setup>
import devMode from "~/utils/devMode";
</script>
