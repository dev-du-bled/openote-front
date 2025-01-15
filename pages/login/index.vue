<template>
  <v-container>
    <v-form
      style="max-width: 400px; width: 100%; margin: 0 auto"
      @submit.prevent="login"
    >
      <v-alert v-if="state.errorMsg" closable type="error" class="mb-2">
        {{ state.errorMsg }}
      </v-alert>
      <v-alert v-if="state.sucessMsg" closable type="success" class="mb-2">
        {{ state.sucessMsg }}
      </v-alert>
      <v-card
        title="Login"
        subtitle="Login to your OpeNote account"
        :loading="state.loading"
        :disabled="state.loading"
      >
        <v-card-text>
          <v-text-field
            v-model="form.email"
            label="Email"
            type="email"
            required
          />
          <v-text-field
            v-model="form.password"
            label="Password"
            :type="form.passwordVisible ? 'text' : 'password'"
            required
            :append-inner-icon="
              form.passwordVisible ? 'mdi-eye' : 'mdi-eye-off'
            "
            @click:append-inner="form.passwordVisible = !form.passwordVisible"
          />
          <v-checkbox
            v-model="form.longerSession"
            label="Stay logged in longer"
            hide-details
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <!-- <v-btn text="" @click="forgotPasswordState.dialog = true"
            >Forgot password ?</v-btn
          > -->
          <v-spacer />
          <v-btn text="" type="submit" color="primary">Login</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
    <v-card
      v-if="devMode"
      title="Login as (Debug only)"
      style="margin: 0 auto; max-width: 400px"
      class="mt-3"
    >
      <v-card-actions>
        <v-btn
          @click="
            form.email = 'student1@example.com';
            form.password = 'password';
          "
          variant="text"
          >Student 1</v-btn
        >
        <v-btn
          @click="
            form.email = 'student2@example.com';
            form.password = 'password';
          "
          variant="text"
          >Student 2</v-btn
        >
        <v-btn
          @click="
            form.email = 'teacher@example.com';
            form.password = 'password';
          "
          variant="text"
          >Teacher</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-dialog v-model="forgotPasswordState.dialog" max-width="750px">
      <v-card :loading="state.loading" :disabled="state.loading">
        <v-card-title>Forgot password</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="forgotPasswordState.email"
            label="Email"
            type="email"
            required
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn text="" @click="forgotPasswordState.dialog = false"
            >Cancel</v-btn
          >
          <v-btn text="" color="primary" @click="forgotPassword">Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import devMode from "~/utils/devMode";
import { useState } from "#app";

const router = useRouter();

const form = useState("form", () => ({
  email: "",
  password: "",
  longerSession: false,
  passwordVisible: false,
}));

const state = useState("state", () => ({
  loading: false,
  errorMsg: "",
  sucessMsg: "",
}));

const forgotPasswordState = useState("forgotPassword", () => ({
  dialog: false,
  email: "",
}));

const login = async () => {
  const config = useRuntimeConfig();
  state.value.loading = true;
  console.log({ email: form.value.email, password: form.value.password });
  try {
    await $fetch(`${config.public.api_base_url}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        extended_period: form.value.longerSession,
      }),
    })
      .then((data) => {
        const session = useCookie<SessionContent>("session");
        session.value = data as SessionContent;
        window.location.href = "/";
      })
      .catch((err) => {
        try {
          state.value.errorMsg = err.data.detail
            ? err.data.detail
            : "An error occurred";
        } catch (e) {
          state.value.errorMsg = "An error occurred";
        }
        state.value.loading = false;
      });
  } catch (e) {
    if (e instanceof Error) {
      state.value.errorMsg = e.message;
    } else {
      state.value.errorMsg = String(e);
    }
    state.value.loading = false;
  }
};

const forgotPassword = async () => {
  // Implement forgot password functionality
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("logout")) {
    state.value.sucessMsg = "You have been logged out";
  } else if (urlParams.has("expired")) {
    state.value.errorMsg = "Your session has expired";
  }
  router.push({ query: {} });
});

useHead({
  title: "Login",
});
</script>
