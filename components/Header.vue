<template>
  <ClientOnly>
    <v-app-bar scroll-behavior="elevate" class="px-4">
      <template v-slot:prepend v-if="smAndDown && userStatus != 'none'">
        <v-app-bar-nav-icon @click="drawer = !drawer" />
      </template>
      <!-- The logo is hardcoded to be displayed instantiously when loading the page -->
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

      <v-app-bar-title
        class="font-weight-bold move-left"
        v-if="!smAndDown || userStatus == 'none'"
        >OpeNote</v-app-bar-title
      >
      <template v-if="!smAndDown && userStatus != 'none'">
        <template v-for="item in headerItems">
          <v-tooltip v-if="mdAndDown" :text="item.title" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn
                :key="item.title"
                v-if="item.to && (!item.role || item.role.includes(userStatus))"
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
            v-if="item.to && (!item.role || item.role.includes(userStatus))"
            :to="item.to"
            class="mx-1"
            :prepend-icon="item.icon"
          >
            <p>{{ item.title }}</p>
          </v-btn>
          <v-menu
            :key="item.title"
            v-if="item.items && (!item.role || item.role.includes(userStatus))"
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
      <p v-if="userStatus && devMode" class="mr-4">
        {{ userStatus.charAt(0).toUpperCase() + userStatus.slice(1) }}
      </p>
      <v-btn icon to="/account" v-if="userStatus != 'none'">
        <v-avatar v-if="userProfilePicture" size="x-small">
          <v-img :src="userProfilePicture" alt="Profile Picture">
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
      <v-btn icon @click="logout(false)" v-if="userStatus != 'none'">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer
      v-if="smAndDown && userStatus != 'none'"
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

const drawer = ref(false);
import { userStatus, type UserStatus } from "~/composables/useCurrentUser";
import { logout } from "@/utils/logout";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { userProfilePicture } from "@/composables/useUserProfile";

const theme = useTheme();
const { smAndDown, mdAndDown } = useDisplay();

type headerItem = {
  title: string;
  to?: string;
  icon?: string;
  items?: { title: string; to: string }[];
  role?: UserStatus[]; // The role(s) needed to see the item
};

const headerItems: headerItem[] = [
  { title: "Home", to: "/", icon: "mdi-home" },
  {
    title: "Calendar",
    to: "/calendar",
    icon: "mdi-calendar",
    role: ["teacher", "parent", "student"],
  },
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
