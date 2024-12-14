<template>
    <v-container style="max-width: 900px; width: 100%; margin: 0 auto">
        <v-alert v-if="errorMsg" type="error" class="mb-2">{{ errorMsg }}</v-alert>
        <v-card title="My account" subtitle="Manage your account settings" :disabled="loading" :loading="loading">
            <template v-slot:append>
                <v-avatar size="64">
                    <v-img
                        draggable="false"
                        :alt="`${user?.firstname} ${user?.lastname} profile picture`"
                        :src="user?.profile_picture"
                    ></v-img>
                </v-avatar>
            </template>

            <v-card-text v-if="user">
                <p class="ma-1 mb-2">
                    Name: {{ user.firstname }} {{ user.lastname }}<br />
                    Role: {{ user.role }}<br />
                    Pronouns: {{ user.pronouns }}
                </p>
                <v-text-field v-model="user.email" label="Email" type="email"></v-text-field>
            </v-card-text>
            <v-card-text v-else-if="!loading">
                <p>Loading seems to have failed</p>
            </v-card-text>
            <v-card-text v-else>
                <p>Loading...</p>
            </v-card-text>
            <v-card-actions class="bg-surface-light">
                <v-btn @click="changePasswordDialog = true" variant="text">Change password</v-btn>
                <v-spacer />
                <v-btn variant="text" color="primary">Save</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog v-model="changePasswordDialog" max-width="700px">
            <v-card title="Change password" subtitle="Change your account password">
                <v-card-text>
                    <v-text-field v-model="password.current" label="Current password" type="password"></v-text-field>
                    <v-text-field v-model="password.new" label="New password" type="password"></v-text-field>
                    <v-text-field v-model="password.confirm" label="Confirm new password" type="password"></v-text-field>
                </v-card-text>
                <v-card-actions class="bg-surface-light">
                    <v-spacer />
                    <v-btn @click="changePasswordDialog = false" variant="text">Cancel</v-btn>
                    <v-btn color="primary">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { logout } from "~/utils/logout";
import type { User } from "~/utils/types/user";

const user = ref<User>();
const password = ref({
    current: "",
    new: "",
    confirm: "",
});
const loading = ref(true);
const errorMsg = ref("");
const changePasswordDialog = ref(false);
const config = useRuntimeConfig();

const loadUser = async () => {
    const session = useCookie<SessionContent>("session");
    const token = session.value ? session.value.session_token : null;

    if (!token) return logout();

    await $fetch(`${config.public.api_base_url}/user`, {
        method: "GET",
        headers: {
            Authorization: token,
        },
    })
        .then((res: any) => {
            console.log(res);
            user.value = res;
            loading.value = false;
        })
        .catch((err) => {
            errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
            loading.value = false;
        });
};

const saveAccountChanges = async () => {
    const session = useCookie<SessionContent>("session");
    const token = session.value ? session.value.session_token : null;
    if (!token) return logout();

    await $fetch(`${config.public.api_base_url}/user`, {
        method: "PUT",
        headers: {
            Authorization: token,
        },
        body: JSON.stringify(user.value),
    })
        .then((res: any) => {
            console.log(res);
            user.value = res;
        })
        .catch((err) => {
            errorMsg.value = err.data.detail ? err.data.detail : "An error occurred";
        });
};

onMounted(() => {
    loadUser();
});

useHead({
    title: "Account",
});
</script>
