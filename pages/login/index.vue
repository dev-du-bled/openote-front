<template>
  <v-container>
    <v-form
      style="max-width: 400px; width: 100%; margin: 0 auto"
      @submit.prevent="login"
    >
      <v-alert v-if="errorMsg" closable type="error" class="mb-2">{{
        errorMsg
      }}</v-alert>
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>Login</v-card-title>
        <v-card-subtitle> Login to your OpeNote account </v-card-subtitle>
        <v-card-text>
          <v-text-field v-model="email" label="Email" type="email" required />
          <v-text-field
            v-model="password"
            label="Password"
            :type="passwordVisible ? 'text' : 'password'"
            required
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="passwordVisible = !passwordVisible"
          />
          <v-checkbox
            v-model="longerSession"
            label="Stay logged in longer"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn text="" @click="forgotPasswordDialog = true"
            >Forgot password ?</v-btn
          >
          <v-spacer />
          <v-btn text="" type="submit" color="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-dialog v-model="forgotPasswordDialog" max-width="750px">
      <v-card :loading="loading" :disabled="loading">
        <v-card-title>Forgot password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="forgotPasswordEmail"
            label="Email"
            type="email"
            required
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn text="" @click="forgotPasswordDialog = false">Cancel</v-btn>
          <v-btn text="" color="primary" @click="forgotPassword">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
const forgotPassword = ref(false);
const forgotPasswordEmail = ref("");
const forgotPasswordDialog = ref(false);
const loading = ref(false);
const errorMsg = ref("");
const email = ref("teacher@example.com");
const password = ref("password");
const passwordVisible = ref(false);
const longerSession = ref(false);

const login = async () => {
  loading.value = true;
  try {
    await $fetch(
      `${window.location.protocol}//${window.location.hostname}:8000/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
          extended_period: longerSession.value,
        }),
      }
    )
      .then((data) => {
        const session = useCookie<SessionContent>("session");
        session.value = data as SessionContent;
        window.location.href = "/";
      })
      .catch((err) => {
        try {
          errorMsg.value = err.data.detail
            ? err.data.detail
            : "An error occurred";
        } catch (e) {
          errorMsg.value = "An error occurred";
        }
        loading.value = false;
      });
  } catch (e) {
    if (e instanceof Error) {
      errorMsg.value = e.message;
    } else {
      errorMsg.value = String(e);
    }
    loading.value = false;
  }
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("logout")) {
    errorMsg.value = "You have been logged out";
  } else if (urlParams.has("expired")) {
    errorMsg.value = "Your session has expired";
  }
});

useHead({
  title: "Login",
});
</script>
