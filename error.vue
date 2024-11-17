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
    <Header />
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
