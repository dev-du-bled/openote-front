<template>
  <v-container class="d-flex justify-center">
    <v-form style="max-width: 400px; width: 100%" @submit.prevent="register">
      <v-alert v-if="error" type="error" class="mb-2">{{ error }}</v-alert>
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>Register</v-card-title>
        <v-card-subtitle> Create an OpeNote account </v-card-subtitle>
        <v-card-text>
          <v-text-field
            v-model="name"
            label="Name"
            type="name"
            required
          />
          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="password"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            label="Password"
            :type="passwordVisible ? 'text' : 'password'"
            required
            @click:append-inner="passwordVisible = !passwordVisible"
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-spacer/>
          <v-btn text type="submit" color="primary">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
const register = async () => {
  loading.value = true;
};
const name = ref("");
const loading = ref(false);
const error = ref("");
const email = ref("");
const password = ref("");
const passwordVisible = ref(false);
</script>
