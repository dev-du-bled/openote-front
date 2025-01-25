<template>
  <NuxtLoadingIndicator color="blue" />
  <NuxtLayout>
    <v-app>
      <Header />
      <v-main>
        <!-- The page content is rendered on the client only to have something to show if the server is slow to respond because we're depending on it -->
        <ClientOnly>
          <NuxtPage />
        </ClientOnly>
        <Footer />
      </v-main>
    </v-app>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import { useTheme } from "vuetify";

const theme = useTheme();

// Easter egg
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
  if (
    event.code == konamiCode[konamiIndex] ||
    (event.code == "KeyQ" && konamiCode[konamiIndex] == "KeyA") // Avoid malfunction with AZERTY keyboards
  ) {
    konamiIndex++;
    if (konamiIndex == konamiCode.length) {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
};

// Dark mode auto
const handleDarkModeChange = (event: MediaQueryListEvent) => {
  theme.global.name.value = event.matches ? "dark" : "light";
};

onMounted(() => {
  const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener("keydown", handleKeydown);
  theme.global.name.value = darkModeMediaQuery.matches ? "dark" : "light";
  darkModeMediaQuery.addEventListener("change", handleDarkModeChange);
});
</script>
