<template>
  <v-card
    title="My homework"
    :disabled="componentLoading"
    :loading="componentLoading"
  >
    <template v-slot:append>
      <v-btn to="/student/homeworks" icon="mdi-open-in-new" variant="text">
      </v-btn>
    </template>
    <v-card-text v-if="!componentLoading">
      <v-list v-if="homeworks.length > 0">
        <div v-for="(homework, index) in homeworks" :key="index">
          <v-list-item
            :variant="homework.is_done ? 'plain' : 'flat'"
            :key="index"
          >
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  :id="'homework-' + index"
                  v-model="homework.is_done"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
            <template v-slot:append>
              <v-btn icon variant="text">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <v-list-item-title
              >{{ homework.homework_title }}
              {{ homework.is_done ? "(Done)" : "" }}</v-list-item-title
            >
            <v-list-item-subtitle
              >Due in
              {{
                homework.homework_due_date.toLocaleDateString("fr-FR")
              }}</v-list-item-subtitle
            >
          </v-list-item>
          <v-divider v-if="index < homeworks.length - 1"></v-divider>
        </div>
      </v-list>
      <p v-else class="text-center text-grey">
        There is no homeworks to display
      </p>
    </v-card-text>
    <v-card-text v-else>
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
      ></v-skeleton-loader>
      <v-divider />
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
      ></v-skeleton-loader>
      <v-divider />
      <v-skeleton-loader
        :loading="componentLoading"
        type="table-heading"
        class="mb-4"
      ></v-skeleton-loader>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { HomeworkItem } from "~/utils/types/homework";

const componentLoading = ref(true);
const homeworks = ref<HomeworkItem[]>([]);

const loadHomeworks = async () => {
  const session = useCookie<SessionContent>("session");
  if (!session.value) logout();
  await $fetch(`${apiUrl}/homework/`, {
    headers: {
      Authorization: session.value.session_token,
    },
    params: {
      max_homework: 3,
      show_not_completed_only: true,
    },
  })
    .then((data) => {
      console.log(data);
      homeworks.value = (data as HomeworkItem[]).map((homework) => ({
        ...homework,
        homework_due_date: new Date(homework.homework_due_date),
      }));
      componentLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      componentLoading.value = false;
    });
};

onMounted(() => {
  loadHomeworks();
});
</script>
