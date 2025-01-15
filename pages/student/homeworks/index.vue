<template>
  <v-container>
    <v-card
      title="Homeworks"
      :disabled="componentLoading"
      :loading="componentLoading"
    >
      <template v-slot:append>
        <!-- TODO: Homework past history -->
        <v-tooltip text="See homework history">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="addSelfHomeworkDialog = true"
              icon="mdi-clock-outline"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Create a self homework">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="addSelfHomeworkDialog = true"
              icon="mdi-plus"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-list>
              <v-list-subheader>Pending Homeworks</v-list-subheader>
              <div
                v-for="(homework, index) in homeworks.filter(
                  (hw) => !hw.is_done
                )"
                :key="index"
              >
                <v-list-item
                  :prepend-icon="homework.is_author ? 'mdi-account-school' : ''"
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
                  <v-list-item-subtitle
                    :class="
                      homework.homework_due_date < new Date()
                        ? 'text-red-accent-4'
                        : homework.homework_due_date.getTime() -
                            new Date().getTime() <
                          86400000
                        ? 'orange-darken-4'
                        : ''
                    "
                  >
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
                  :prepend-icon="homework.is_author ? 'mdi-account-school' : ''"
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
          <v-col cols="12" md="6" class="d-flex flex-column fill-height">
            <div v-if="selectedHomework" class="flex-grow-1">
              <h3>{{ selectedHomework.homework_title }}</h3>
              <p v-if="devMode">
                Homework ID: {{ selectedHomework.homework_id }}
              </p>
              <p>
                Status: {{ selectedHomework.is_done ? "Done" : "Not Done" }}
              </p>
              <p
                :class="
                  selectedHomework.homework_due_date < new Date()
                    ? 'text-red-accent-4'
                    : selectedHomework.homework_due_date.getTime() -
                        new Date().getTime() <
                      86400000
                    ? 'orange-darken-4'
                    : ''
                "
              >
                Due Date:
                {{
                  selectedHomework.homework_due_date.toLocaleDateString("fr-FR")
                }}
              </p>
              <p v-if="selectedHomework.is_author">Is self asigned: Yes</p>
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
            <div v-if="selectedHomework?.is_author" class="mt-auto">
              <v-btn
                color="primary"
                class="mr-3"
                prepend-icon="mdi-pencil"
                @click="editHomeworkFunc(selectedHomework)"
                >Edit</v-btn
              >
              <v-btn color="error" prepend-icon="mdi-delete">Delete</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="addSelfHomeworkDialog" max-width="750px">
      <v-card title="Add a self homework">
        <v-card-text>
          <v-text-field
            v-model="newHomework.title"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="newHomework.details"
            label="Details"
            required
          ></v-textarea>
          <v-date-input
            v-model="newHomework.dueDate"
            label="Date"
            :min="new Date(Date.now() + 86400000).toISOString().split('T')[0]"
            required
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
    <v-dialog v-model="editHomeworkDialog.displayed" max-width="750px">
      <v-card title="Edit Homework">
        <v-card-text>
          <v-text-field
            v-model="editHomeworkDialog.title"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="editHomeworkDialog.details"
            label="Details"
            required
          ></v-textarea>
          <v-date-input
            v-model="editHomeworkDialog.dueDate"
            label="Date"
            required
          ></v-date-input>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn variant="text" @click="editHomeworkDialog.displayed = false"
            >Cancel</v-btn
          >
          <v-btn color="primary" @click="saveEditedHomework">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      color="error"
      timer="#730800"
      :text="errorSnackbar"
      v-model="isErrorSnackbarVisible"
    ></v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import type { HomeworkItem } from "~/utils/types/homework";
import devMode from "~/utils/devMode";

const router = useRouter();

const componentLoading = useState("componentLoading", () => true);
const selectedHomework = useState<HomeworkItem | null>(
  "selectedHomework",
  () => null
);
const homeworks = useState<HomeworkItem[]>("homeworks", () => []);
const errorSnackbar = useState<string>("errorSnackbar", () => "");
const isErrorSnackbarVisible = computed({
  get: () => errorSnackbar.value.length > 0,
  set: (value) => {
    if (!value) errorSnackbar.value = "";
  },
});

const addSelfHomeworkDialog = useState<boolean>(
  "addSelfHomeworkDialog",
  () => false
);
const newHomework = useState<{
  title: string;
  details: string;
  dueDate: Date;
}>("newHomework", () => ({
  title: "",
  details: "",
  dueDate: new Date(Date.now() + 86400000),
}));

const editHomeworkDialog = useState("editHomeworkDialog", () => ({
  displayed: false,
  title: "",
  details: "",
  dueDate: new Date(),
}));

const config = useRuntimeConfig();

const loadHomeworks = async () => {
  componentLoading.value = true;
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.api_base_url}/homework/`, {
    headers: {
      Authorization: session.value.session_token,
    },
  })
    .then((data) => {
      homeworks.value = (data as HomeworkItem[]).map((hw) => ({
        ...hw,
        homework_due_date: new Date(hw.homework_due_date),
      }));
      if (router.currentRoute.value.query.view) {
        const homework = homeworks.value.find(
          (h) => h.homework_id === Number(router.currentRoute.value.query.view)
        );
        if (homework) selectedHomework.value = homework;
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
  await $fetch(`${config.public.api_base_url}/homework/status`, {
    method: "PATCH",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      is_done: homework.is_done,
      homework_id: homework.homework_id,
    }),
  })
    .then(() => {
      loadHomeworks();
    })
    .catch((err) => {
      console.error(err);
      errorSnackbar.value = "Error when updating homework status";
      homework.is_done = !homework.is_done;
    });
};

const addSelfHomework = async () => {
  if (!newHomework.value.title || !newHomework.value.details) {
    errorSnackbar.value = "Title, details, and date are required";
    return;
  }
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.api_base_url}/homework/manage`, {
    method: "POST",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: newHomework.value.title,
      details: newHomework.value.details,
      due_date: newHomework.value.dueDate.toISOString(),
      assigned_class: 0,
    }),
  })
    .then(() => {
      loadHomeworks();
      addSelfHomeworkDialog.value = false;
    })
    .catch((err) => {
      console.error(err.data);
      errorSnackbar.value = "Error when adding homework";
    });
};

const editHomeworkFunc = (homework: HomeworkItem) => {
  editHomeworkDialog.value.title = homework.homework_title;
  editHomeworkDialog.value.details = homework.homework_details;
  editHomeworkDialog.value.dueDate = homework.homework_due_date;
  editHomeworkDialog.value.displayed = true;
};

const saveEditedHomework = async () => {
  if (!editHomeworkDialog.value.title || !editHomeworkDialog.value.details) {
    errorSnackbar.value = "All fields are required";
    return;
  }
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.api_base_url}/homework/manage`, {
    method: "PATCH",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      homework_id: selectedHomework.value?.homework_id,
      title: editHomeworkDialog.value.title,
      details: editHomeworkDialog.value.details,
      due_date: editHomeworkDialog.value.dueDate.toLocaleDateString("fr-FR"),
    }),
  })
    .then(() => {
      loadHomeworks();
      editHomeworkDialog.value.displayed = false;
    })
    .catch((err) => {
      console.error(err);
      errorSnackbar.value = "Error when editing homework";
    });
};

onMounted(() => {
  loadHomeworks();
});

useHead({
  title: "Homeworks",
});
</script>

<style>
.v-list-item__spacer {
  width: 16px !important;
  /* Little hack to make the student icon not too far in the list */
}
</style>
