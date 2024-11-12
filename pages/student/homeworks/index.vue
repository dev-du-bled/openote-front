<template>
  <v-container>
    <v-card :disabled="componentLoading" :loading="componentLoading">
      <v-card-title>Homeworks</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="pr-0">
            <v-list>
              <div v-for="(homework, index) in homeworks" :key="index">
                <v-list-item
                  :variant="homework.is_done ? 'plain' : 'flat'"
                  :key="index"
                  @click="selectHomework(homework)"
                >
                  <v-list-item-title>
                    {{ homework.homework_title }}
                    {{ homework.is_done ? "(Done)" : "" }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Due in
                    {{ homework.homework_due_date.toLocaleDateString("fr-FR") }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider v-if="index < homeworks.length - 1"></v-divider>
              </div>
            </v-list>
          </v-col>
          <v-divider :vertical="true"></v-divider>
          <v-col cols="12" md="6">
            <div v-if="selectedHomework">
              <h3>{{ selectedHomework.homework_title }}</h3>
              <p>
                Status: {{ selectedHomework.is_done ? "Done" : "Not Done" }}
              </p>
              <p>
                Due Date:
                {{
                  selectedHomework.homework_due_date.toLocaleDateString("fr-FR")
                }}
              </p>
              <p>Details: {{ selectedHomework.homework_details }}</p>
            </div>
            <div v-else>
              <p>Select a homework to see the details</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { HomeworkItem } from "~/utils/types/homework";

const componentLoading = ref(true);
const homeworks = ref<HomeworkItem[]>([]);

const loadHomeworks = async () => {
  const session = useCookie<SessionContent>("session");
  if (!session.value) logout();
  await $fetch(`${apiUrl}/homework`, {
    headers: {
      Authorization: session.value.session_token,
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

const selectedHomework = ref<HomeworkItem | null>(null);

function selectHomework(homework: HomeworkItem) {
  selectedHomework.value = homework;
}
</script>
