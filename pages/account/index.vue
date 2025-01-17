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
            draggable="false"
            :alt="`${user?.firstname} ${user?.lastname} profile picture`"
            :src="user?.profile_picture"
          />
        </v-avatar>
      </template>

      <v-card-text v-if="user">
        <p class="ma-1 mb-2">
          Name: {{ user.firstname }} {{ user.lastname }}<br />
          Role: {{ user.role }}<br />
          Pronouns: {{ user.pronouns }}
        </p>
        <!-- Email validation -->
        <v-text-field
          v-model="emailDialog.email"
          label="Email"
          type="email"
          :rules="[rules.required, rules.email]"
        />
      </v-card-text>
      <v-card-text v-else-if="!loading">
        <p>Loading seems to have failed</p>
      </v-card-text>
      <v-card-text v-else>
        <p>Loading...</p>
      </v-card-text>
      <v-card-actions class="bg-surface-light">
        <v-btn @click="changePasswordDialog = true" variant="text"
          >Change password</v-btn
        >
        <v-spacer />
        <v-btn
          :disabled="!saveChangesActive"
          variant="text"
          color="primary"
          @click="changeMailConfirm"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>

    <!-- Change password dialog -->
    <v-dialog v-model="changePasswordDialog" max-width="700px">
      <v-card
        prepend-icon="mdi-key"
        title="Change password"
        subtitle="Change your account password"
        :loading="emailDialog.loading"
        :disabled="emailDialog.loading"
      >
        <v-card-text>
          <v-text-field
            v-model="passwordDialog.current"
            label="Current password"
            type="password"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="passwordDialog.new"
            label="New password"
            type="password"
            :rules="[rules.required]"
          />
          <v-text-field
            v-model="passwordDialog.confirm"
            label="Confirm new password"
            type="password"
            :rules="[rules.required, rules.passwordMatch]"
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-spacer />
          <v-btn @click="changePasswordDialog = false" variant="text"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="changePassword">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Change email dialog -->
    <v-dialog v-model="changeMailDialog" max-width="700px">
      <v-card
        prepend-icon="mdi-lock"
        title="Confirm action"
        subtitle="Enter your current password"
        :loading="emailDialog.loading"
        :disabled="emailDialog.loading"
      >
        <v-card-text>
          <p>
            Once confirmed, your email address will be changed to
            <b>{{ emailDialog.email }}</b>
          </p>
          <v-text-field
            v-model="emailDialog.password"
            label="Current password"
            type="password"
            :rules="[rules.required]"
          />
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-spacer />
          <v-btn @click="changeMailDialog = false" variant="text">Cancel</v-btn>
          <v-btn
            color="primary"
            :disabled="emailDialog.password.length == 0"
            @click="changeMail"
            >Save</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { logout } from "~/utils/logout";
import type { User } from "~/utils/types/user";

const user = useState<User>("user");
const passwordDialog = useState("password", () => ({
  loading: false,
  current: "",
  new: "",
  confirm: "",
}));
const emailDialog = useState("email", () => ({
  loading: false,
  email: "",
  password: "",
}));
const loading = useState<boolean>("loading", () => true);
const errorMsg = useState<string>("errorMsg", () => "");
const changeMailDialog = useState<boolean>("changeMailDialog", () => false);
const changePasswordDialog = useState<boolean>(
  "changePasswordDialog",
  () => false
);
const config = useRuntimeConfig();

// Vuetify rules
const rules = {
  required: (v: string) => !!v || "This field is required",
  email: (v: string) => /.+@.+\..+/.test(v) || "E-mail must be valid",
  passwordMatch: (v: string) =>
    v === passwordDialog.value.new || "Passwords must match",
};

const saveChangesActive = computed(
  () =>
    user.value &&
    user.value.email !== "" &&
    user.value.email !== emailDialog.value.email
);

const loadUser = async () => {
  const session = useCookie<SessionContent>("session");
  const token = session.value ? session.value.session_token : null;
  if (!token) return logout();

  await $fetch(`${config.public.api_base_url}/user`, {
    method: "GET",
    headers: { Authorization: token },
  })
    .then((res: any) => {
      user.value = res;
      emailDialog.value.email = res.email;
      loading.value = false;
    })
    .catch((err) => {
      errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
      loading.value = false;
    });
};

const changeMailConfirm = () => {
  if (emailDialog.value.email === user.value.email) {
    errorMsg.value = "The email address is the same as the current one";
    return;
  }
  changeMailDialog.value = true;
};

const changeMail = () => {
  const session = useCookie<SessionContent>("session");
  const token = session.value ? session.value.session_token : null;
  if (!token) return logout();
  emailDialog.value.loading = true;

  $fetch(`${config.public.api_base_url}/user/email`, {
    method: "PATCH",
    headers: { Authorization: token },
    body: JSON.stringify({
      new_email: emailDialog.value.email,
      current_password: emailDialog.value.password,
    }),
  })
    .then(() => {
      user.value.email = emailDialog.value.email;
      changeMailDialog.value = false;
    })
    .catch((err) => {
      errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
    })
    .finally(() => {
      loading.value = false;
    });
};

const changePassword = () => {
  const session = useCookie<SessionContent>("session");
  const token = session.value ? session.value.session_token : null;
  if (!token) return logout();
  passwordDialog.value.loading = true;

  $fetch(`${config.public.api_base_url}/user/password`, {
    method: "PATCH",
    headers: { Authorization: token },
    body: JSON.stringify({
      old_password: passwordDialog.value.current,
      new_password: passwordDialog.value.new,
    }),
  })
    .then(() => {
      changePasswordDialog.value = false;
    })
    .catch((err) => {
      errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
    })
    .finally(() => {
      loading.value = false;
    });
};

onMounted(() => {
  loadUser();
});

useHead({ title: "Account" });
</script>
