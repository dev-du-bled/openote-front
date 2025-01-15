<script setup lang="ts">
import type { NuxtError } from "#app";

const router = useRouter();
const props = defineProps({
  error: Object as () => NuxtError,
});
const onClickAction = () => {
  router.push("/");
};
</script>

<template>
  <v-app>
    <v-app-bar scroll-behavior="elevate" app class="px-4">
      <svg
        class="ml-4 mb-1"
        width="32"
        height="31"
        viewBox="0 0 455 441"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M236 440.995C357.088 440.188 455 341.778 455 220.5C455 98.7212 356.279 0 234.5 0C156.338 0 87.6744 40.6687 48.5157 102H236V102.013C300.753 102.816 352.997 155.557 352.997 220.5C352.997 285.443 300.753 338.184 236 338.987V440.995Z"
          fill="#086FAF"
          fill-opacity="0.5"
        />
        <path d="M0 440V137H201V440H0Z" fill="#086FAF" />
        <path d="M28 177H173V202H28V177Z" fill="white" />
        <path d="M28 220H173V245H28V220Z" fill="white" />
      </svg>
      <v-app-bar-title class="font-weight-bold move-left"
        >OpeNote</v-app-bar-title
      >
    </v-app-bar>
    <v-main>
      <v-container class="text-center d-flex align-center justify-center my-8">
        <div>
          <h1 v-if="error" class="font-weight-black text-h1">
            {{ error.statusCode }}
          </h1>
          <p v-if="error" class="my-4">{{ error.message }}</p>
          <h1 v-else>Unknown error !</h1>
          <v-btn prepend-icon="mdi-arrow-left-bold" variant="tonal" to="/">
            Go back home
          </v-btn>
        </div>
      </v-container>
      <Footer />
    </v-main>
  </v-app>
</template>

<script setup lang="ts"></script>
