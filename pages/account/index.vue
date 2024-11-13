<template>
  <v-container style="max-width: 900px; width: 100%; margin: 0 auto">
    <v-alert v-if="errorMsg" type="error" class="mb-2">{{ errorMsg }}</v-alert>
    <v-card
      title="My account"
      subtitle="Manage your account settings"
      :disabled="loading"
      :loading="loading"
    >
      <template v-slot:append>
        <v-avatar size="64">
          <v-img
            alt="John"
            src="https://cdn.discordapp.com/attachments/1025087065580384316/1289147373788074056/OIP.png?ex=6713730d&is=6712218d&hm=ec28127f1d0e53f3b60907ac75e2fd55c00fdc39f6ffce215c2720049fed75ec&"
          ></v-img>
        </v-avatar>
      </template>

      <v-card-text>
        <v-form></v-form>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-spacer />
        <v-btn text="" color="primary">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { logout } from "~/utils/logout";

const user = ref({
  firstName: "John",
  lastName: "Doe",
  email: "",
  profile_picture: "",
});
const loading = ref(true);
const errorMsg = ref("");

const loadUser = async () => {
  const session = useCookie<SessionContent>("session");
  const token = session.value ? session.value.session_token : null;
  if (!token) return logout();

  await $fetch(
    `${window.location.protocol}//${window.location.hostname}:8000/user`,
    {
      method: "GET",
      headers: {
        Authorization: token,
      },
    }
  )
    .then((res: any) => {
      console.log(res);
      user.value.profile_picture = res["profile_picture"];
      loading.value = false;
    })
    .catch((err) => {
      if (err.status == 422) return logout(); // the token is invalid, logout
      errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
      loading.value = false;
    });
};

onMounted(() => {
  loadUser();
});

useHead({
  title: "Account",
});
</script>
