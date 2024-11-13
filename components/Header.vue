<template>
  <ClientOnly>
    <v-app-bar scroll-behavior="elevate" class="px-4">
      <v-img
        v-if="!mobile || userStatus == 'none'"
        src="/openote.svg"
        max-width="32px"
        class="ml-4 mb-1"
        draggable="false"
      />
      <template v-slot:prepend v-if="mobile && userStatus != 'none'">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <v-app-bar-title class="font-weight-bold move-left"
        >OpeNote</v-app-bar-title
      >
      <template v-if="!mobile && userStatus != 'none'">
        <template v-for="item in headerItems">
          <v-btn
            :key="item.title"
            v-if="item.to && (!item.role || item.role.includes(userStatus))"
            :to="item.to"
            class="mx-1"
            >{{ item.title }}</v-btn
          >
          <v-menu
            :key="item.title"
            v-if="item.items && (!item.role || item.role.includes(userStatus))"
          >
            <template v-slot:activator="{ props }">
              <v-btn text="true" v-bind="props" class="mx-1"
                >{{ item.title }} <v-icon>mdi-menu-down</v-icon></v-btn
              >
            </template>
            <v-list>
              <v-list-item
                v-for="subItem in item.items"
                :key="subItem.title"
                :to="subItem.to"
              >
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </template>
      <v-spacer />
      <v-btn icon to="/account" v-if="userStatus != 'none'">
        <v-avatar v-if="userProfilePicture" size="x-small">
          <v-img :src="userProfilePicture" alt="Profile Picture" />
        </v-avatar>
        <v-icon v-else>mdi-account</v-icon>
      </v-btn>
      <v-btn icon @click="logout(false)" v-if="userStatus != 'none'">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="mobile && userStatus != 'none'"
      v-model="drawer"
      app
    >
      <v-list>
        <template v-for="item in headerItems">
          <v-list-item
            v-if="item.to && (!item.role || item.role.includes(userStatus))"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-group
            :key="item.title"
            v-if="item.items && (!item.role || item.role.includes(userStatus))"
          >
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :prepend-icon="item.icon"
                :title="item.title"
              ></v-list-item>
            </template>
            <v-list-item
              v-for="subItem in item.items"
              :key="subItem.title"
              :to="subItem.to"
            >
              <v-list-item-title>{{ subItem.title }}</v-list-item-title>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>
    </v-navigation-drawer>
    <template #fallback>
      <!-- This fallback is the content displayed while the real header is not rendered. The header is rendered on client only due to ssr issues -->
      <v-app-bar scroll-behavior="elevate" app class="px-4">
        <v-img src="/openote.svg" max-width="32px" class="ml-4 mb-1" />
        <v-app-bar-title class="font-weight-bold move-left"
          >OpeNote</v-app-bar-title
        >
      </v-app-bar>
    </template>
  </ClientOnly>
</template>

<style scoped>
.move-left {
  transform: translateX(-7px); /* Magic value */
}
</style>

<script setup lang="ts">
const drawer = ref(false);
import { userStatus, type UserStatus } from "~/composables/useCurrentUser";
import { logout } from "@/utils/logout";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { userProfilePicture } from "@/composables/useUserProfile";

const { mobile } = useDisplay();

type headerItem = {
  title: string;
  to?: string;
  icon?: string;
  items?: { title: string; to: string }[];
  role?: UserStatus[]; // The role(s) needed to see the item
};

const headerItems: headerItem[] = [
  { title: "Home", to: "/", icon: "mdi-home" },
  { title: "Calendar", to: "/calendar", icon: "mdi-calendar" },
  {
    title: "Homeworks",
    to: "/student/homeworks",
    icon: "mdi-book-open",
    role: ["student"],
  },
  {
    title: "Marks",
    to: "/student/marks",
    icon: "mdi-chart-bar",
    role: ["student"],
  },
  {
    title: "Attendance",
    to: "/student/attendance",
    icon: "mdi-check",
    role: ["student"],
  },
  // {
  //   title: "Nav2",
  //   items: [
  //     { title: "Register", to: "/register" },
  //     { title: "Login", to: "/login" },
  //   ],
  //   icon: "mdi-account",
  // },
];
</script>
