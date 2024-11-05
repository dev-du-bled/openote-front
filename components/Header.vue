<template>
  <div>
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
        <v-icon>mdi-account</v-icon>
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
  </div>
</template>

<style scoped>
.move-left {
  transform: translateX(-7px); /* Magic value */
}
</style>

<script setup lang="ts">
const drawer = ref(false);
import { ClientOnly } from "#build/components";
import { userStatus, type UserStatus } from "@/composables/currentUser";
import { logout } from "@/utils/logout";
import { useDisplay } from "vuetify/lib/framework.mjs";

const { mobile } = useDisplay();

type headerItem = {
  title: string;
  to?: string;
  icon?: string;
  items?: { title: string; to: string }[];
  role?: UserStatus[]; // The role needed to see the item
};

const headerItems: headerItem[] = [
  { title: "Home", to: "/", icon: "mdi-home" },
  { title: "Calendar", to: "/calendar", icon: "mdi-calendar" },
  {
    title: "Homework",
    to: "/student/homeworks",
    icon: "mdi-book-open",
    role: ["student"],
  },
  { title: "Marks", to: "/marks", icon: "mdi-chart-bar", role: ["student"] },
  {
    title: "Nav2",
    items: [
      { title: "Register", to: "/register" },
      { title: "Login", to: "/login" },
    ],
    icon: "mdi-account",
  },
  { title: "Nav3", to: "/index2", icon: "mdi-account" },
];
</script>
