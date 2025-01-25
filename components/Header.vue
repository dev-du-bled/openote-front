<template>
  <ClientOnly>
    <v-app-bar scroll-behavior="elevate" class="px-4">
      <template v-slot:prepend v-if="smAndDown && userRole != 'none'">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <Logo />
      <v-app-bar-title
        class="font-weight-bold move-left"
        v-if="!smAndDown || userRole == 'none'"
        >OpeNote</v-app-bar-title
      >
      <template v-if="!smAndDown && userRole != 'none'">
        <template v-for="item in headerItems">
          <v-tooltip v-if="mdAndDown" :text="item.title" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                :key="item.title"
                v-if="item.to && (!item.role || item.role.includes(userRole))"
                :to="item.to"
                class="mx-1"
                v-bind="props"
              >
                <v-icon>{{ item.icon }}</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
          <v-btn
            v-else
            :key="item.title"
            v-if="item.to && (!item.role || item.role.includes(userRole))"
            :to="item.to"
            class="mx-1"
            :prepend-icon="item.icon"
          >
            <p>{{ item.title }}</p>
          </v-btn>
          <v-menu
            :key="item.title"
            v-if="item.items && (!item.role || item.role.includes(userRole))"
          >
            <template v-slot:activator="{ props }">
              <v-btn
                text="true"
                v-bind="props"
                class="mx-1"
                :prepend-icon="item.icon"
                append-icon="mdi-menu-down"
              >
                <p v-if="!mdAndDown">{{ item.title }}</p></v-btn
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
      <p v-if="userRole && devMode" class="mr-4">
        {{ userRole.charAt(0).toUpperCase() + userRole.slice(1) }}
      </p>
      <v-btn icon to="/account" v-if="userRole != 'none'">
        <v-avatar v-if="user?.profile_picture" size="x-small">
          <v-img :src="user?.profile_picture" alt="Profile Picture">
            <template #error>
              <v-icon>mdi-account</v-icon>
            </template>
          </v-img>
        </v-avatar>
        <v-icon v-else>mdi-account</v-icon>
      </v-btn>
      <v-btn
        icon
        @click="
          theme.global.name.value = theme.global.current.value.dark
            ? 'light'
            : 'dark'
        "
      >
        <v-icon>{{
          theme.global.current.value.dark
            ? "mdi-white-balance-sunny"
            : "mdi-moon-waning-crescent"
        }}</v-icon>
      </v-btn>
      <v-btn icon @click="logout(false)" v-if="userRole != 'none'">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="smAndDown && userRole != 'none'"
      v-model="drawer"
      app
    >
      <v-list>
        <template v-for="item in headerItems">
          <v-list-item
            v-if="item.to && (!item.role || item.role.includes(userRole))"
            :key="item.title"
            :to="item.to"
            :prepend-icon="item.icon"
          >
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>

          <v-list-group
            :key="item.title"
            v-if="item.items && (!item.role || item.role.includes(userRole))"
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
      <!-- This fallback is the content displayed while the real header is not rendered -->
      <v-app-bar scroll-behavior="elevate" app class="px-4">
        <Logo />
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
import devMode from "@/utils/devMode";
import { useTheme } from "vuetify";

import { logout } from "@/utils/logout";
import { useDisplay } from "vuetify/lib/framework.mjs";

import { type UserRole } from "@/utils/definitions/user";

const user = useUser();
const userRole = computed(() => user.value?.role ?? "none");

const drawer = ref(false);
const theme = useTheme();
const { smAndDown, mdAndDown } = useDisplay();

type headerItem = {
  title: string;
  to?: string;
  icon?: string;
  items?: { title: string; to: string }[];
  role?: UserRole[]; // The role(s) needed to see the item
};

const headerItems: headerItem[] = [
  // Global items
  { title: "Home", to: "/", icon: "mdi-home" },
  {
    title: "Calendar",
    to: "/calendar",
    icon: "mdi-calendar",
    role: ["teacher", "parent", "student"],
  },
  // Student items
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
  // Teacher items
  {
    title: "Attendance",
    to: "/teacher/attendance",
    icon: "mdi-clock",
    role: ["teacher"],
  },
  {
    title: "Homeworks",
    to: "/teacher/homeworks",
    icon: "mdi-book",
    role: ["teacher"],
  },
  {
    title: "Exams",
    to: "/teacher/exams",
    icon: "mdi-file-document",
    role: ["teacher"],
  },
  // Admin items
  {
    title: "Classes",
    to: "/admin/classes",
    icon: "mdi-school",
    role: ["admin"],
  },
  {
    title: "Users",
    to: "/admin/users",
    icon: "mdi-account",
    role: ["admin"],
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
