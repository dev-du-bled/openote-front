<template>
  <v-container>
    <v-card
      title="Homeworks"
      :disabled="componentLoading"
      :loading="componentLoading"
    >
      <template v-slot:append>
        <v-btn
          @click="addSelfHomeworkDialog = true"
          icon="mdi-plus"
          variant="text"
        >
        </v-btn>
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" class="pr-0">
            <v-list>
              <v-list-subheader>Pending Homeworks</v-list-subheader>
              <div
                v-for="(homework, index) in homeworks.filter(
                  (hw) => !hw.is_done
                )"
                :key="index"
              >
                <v-list-item
                  :variant="
                    selectedHomework?.homework_id === homework.homework_id
                      ? 'tonal'
                      : 'flat'
                  "
                  @click="selectHomework(homework)"
                >
                  <v-list-item-title>
                    {{ homework.homework_title }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Due in
                    {{ homework.homework_due_date.toLocaleDateString("fr-FR") }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider
                  v-if="
                    index < homeworks.filter((hw) => !hw.is_done).length - 1
                  "
                ></v-divider>
              </div>
              <div v-if="homeworks.filter((hw) => !hw.is_done).length === 0">
                <v-list-item>
                  <v-list-item-title>No pending homeworks</v-list-item-title>
                </v-list-item>
              </div>
            </v-list>
            <v-list v-if="homeworks.filter((hw) => hw.is_done).length > 0">
              <v-list-subheader>Completed Homeworks</v-list-subheader>
              <div
                v-for="(homework, index) in homeworks.filter(
                  (hw) => hw.is_done
                )"
                :key="index"
              >
                <v-list-item
                  :variant="
                    selectedHomework?.homework_id === homework.homework_id
                      ? 'tonal'
                      : 'plain'
                  "
                  @click="selectHomework(homework)"
                >
                  <v-list-item-title>
                    {{ homework.homework_title }} (Done)
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    Due in
                    {{ homework.homework_due_date.toLocaleDateString("fr-FR") }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider
                  v-if="index < homeworks.filter((hw) => hw.is_done).length - 1"
                ></v-divider>
              </div>
            </v-list>
          </v-col>
          <v-divider :vertical="true" />
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
              <v-checkbox-btn
                v-model="selectedHomework.is_done"
                label="Mark as done"
                @change="changeHomeworkStatus(selectedHomework)"
              ></v-checkbox-btn>
            </div>
            <div v-else>
              <p>Select a homework to see the details</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-snackbar color="error" :timer="true" v-model="errorSnackbar">
      <p>Error when updating homework status</p>
    </v-snackbar>
    <v-dialog v-model="addSelfHomeworkDialog" max-width="750px">
      <v-card title="Add a self homework">
        <v-card-text>
          <v-text-field
            v-model="newHomeworkTitle"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="newHomeworkDetails"
            label="Details"
            required
          ></v-textarea>
          <v-date-input
            v-model="newHomeworkDueDate"
            label="Date"
          ></v-date-input>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn variant="text" @click="addSelfHomeworkDialog = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="addSelfHomework">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import type { HomeworkItem } from "~/utils/types/homework";

const router = useRouter();

const componentLoading = ref(true);
const selectedHomework = ref<HomeworkItem | null>(null);
const homeworks = ref<HomeworkItem[]>([]);
const errorSnackbar = ref(false);
const addSelfHomeworkDialog = ref(false);
const newHomeworkTitle = ref("");
const newHomeworkDetails = ref("");
const newHomeworkDueDate = ref(new Date());

const loadHomeworks = async () => {
  componentLoading.value = true;
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(
    `${window.location.protocol}//${window.location.hostname}:8000/homework`,
    {
      headers: {
        Authorization: session.value.session_token,
      },
    }
  )
    .then((data) => {
      homeworks.value = (data as HomeworkItem[]).map((homework) => ({
        ...homework,
        homework_due_date: new Date(homework.homework_due_date),
      }));
      if (router.currentRoute.value.query.view) {
        const homework = homeworks.value.find(
          (hw) =>
            hw.homework_id === Number(router.currentRoute.value.query.view)
        );
        if (homework) {
          selectedHomework.value = homework;
        }
        router.push({ query: {} });
      }
      componentLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      componentLoading.value = false;
    });
};

const selectHomework = (homework: HomeworkItem) => {
  selectedHomework.value = homework;
};

const changeHomeworkStatus = async (homework: HomeworkItem) => {
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(
    `${window.location.protocol}//${window.location.hostname}:8000/homework/status`,
    {
      method: "PATCH",
      headers: {
        Authorization: session.value.session_token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        is_done: homework.is_done,
        homework_id: homework.homework_id,
      }),
    }
  )
    .then(() => {
      loadHomeworks();
    })
    .catch((err) => {
      console.error(err);
      errorSnackbar.value = true;
      homework.is_done = !homework.is_done;
    });
};

const addSelfHomework = async () => {};

onMounted(() => {
  loadHomeworks();
});

useHead({
  title: "Homeworks",
});
</script>
