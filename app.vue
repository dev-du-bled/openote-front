<template>
  <NuxtLayout>
    <v-app>
      <Header />
      <v-main>
        <NuxtPage />
        <Footer />
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const konamiCode = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];
let konamiIndex = 0;

const handleKeydown = (event: { code: string }) => {
  if (event.code == konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex == konamiCode.length) {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>
