<template>
  <v-container>
    <v-card
      title="Homeworks"
      :disabled="componentLoading"
      :loading="componentLoading"
      ><template v-slot:prepend>
        <v-tooltip text="Return" v-if="mobile && selectedHomework !== null">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="selectHomework(null)"
              icon="mdi-arrow-left"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>
      <template v-slot:append v-if="!mobile || !selectedHomework">
        <!-- TODO: Homework past history -->
        <v-tooltip text="See homework history">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              icon="mdi-clock-outline"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Create a self homework">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="addSelfHomeworkDialog()"
              icon="mdi-plus"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="5" v-if="!mobile || !selectedHomework">
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
                    {{ homework.homework_due_date.toLocaleDateString() }}
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
                    {{ homework.homework_due_date.toLocaleDateString() }}
                  </v-list-item-subtitle>
                </v-list-item>
                <v-divider
                  v-if="index < homeworks.filter((hw) => hw.is_done).length - 1"
                ></v-divider>
              </div>
            </v-list>
          </v-col>
          <v-divider v-if="!mobile" :vertical="true" />
          <v-col
            class="d-flex flex-column fill-height"
            v-if="!mobile || selectedHomework"
          >
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
                {{ selectedHomework.homework_due_date.toLocaleDateString() }}
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
              <v-btn
                color="error"
                prepend-icon="mdi-delete"
                @click="deleteHoweworkFunc(selectedHomework)"
                >Delete</v-btn
              >
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="homeworkDialog.displayed" max-width="750px">
      <v-card
        :title="
          homeworkDialog.editMode ? 'Edit Homework' : 'Add a self homework'
        "
      >
        <v-card-text>
          <v-text-field
            v-model="homeworkDialog.title"
            label="Title"
            required
          ></v-text-field>
          <v-textarea
            v-model="homeworkDialog.details"
            label="Details"
            required
          ></v-textarea>
          <v-date-input
            v-model="homeworkDialog.dueDate"
            label="Date"
            :min="
              !homeworkDialog.editMode &&
              new Date(Date.now() + 86400000).toISOString().split('T')[0]
            "
            required
          ></v-date-input>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn variant="text" @click="homeworkDialog.displayed = false">
            Cancel
          </v-btn>
          <v-btn
            v-if="homeworkDialog.editMode"
            color="primary"
            @click="saveEditedHomework"
          >
            Save
          </v-btn>
          <v-btn v-else color="primary" @click="addSelfHomework"> Add </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Confirmation dialog for deleting homework -->
    <v-dialog v-model="deleteHoweworkDialog" max-width="500px">
      <v-card
        title="Delete homework"
        subtitle="Are you sure you want to delete this homework?"
      >
        <v-card-actions class="bg-surface-light">
          <v-btn variant="text" @click="deleteHoweworkDialog = false"
            >Cancel</v-btn
          >
          <v-btn
            color="error"
            @click="selectedHomework && deleteHowework(selectedHomework)"
            >Delete</v-btn
          >
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
import { useDisplay } from "vuetify";
import type { HomeworkItem } from "~/utils/types/homework";
import devMode from "~/utils/devMode";

const router = useRouter();
const session = useCookie<SessionContent>("session");
const { mobile } = useDisplay();

const componentLoading = useState("homeworksStudentLoading", () => true);
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

const homeworkDialog = useState<{
  displayed: boolean;
  editMode: boolean;
  title: string;
  details: string;
  dueDate: Date;
}>("newHomework", () => ({
  displayed: false,
  editMode: false,
  title: "",
  details: "",
  dueDate: new Date(Date.now() + 86400000),
}));

// Added state for delete confirmation dialog
const deleteHoweworkDialog = useState<boolean>(
  "deleteHoweworkDialog",
  () => false
);

const config = useRuntimeConfig();

const loadHomeworks = async () => {
  componentLoading.value = true;
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/homework/`, {
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
      }
      componentLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      componentLoading.value = false;
    });
};

const selectHomework = (homework: HomeworkItem | null) => {
  selectedHomework.value = homework;
};

const changeHomeworkStatus = async (homework: HomeworkItem) => {
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/homework/status`, {
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
  if (!homeworkDialog.value.title || !homeworkDialog.value.details) {
    errorSnackbar.value = "Title, details, and date are required";
    return;
  }
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/homework/manage`, {
    method: "POST",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: homeworkDialog.value.title,
      details: homeworkDialog.value.details,
      due_date: homeworkDialog.value.dueDate.toLocaleDateString(),
      assigned_class: 0,
    }),
  })
    .then(() => {
      loadHomeworks();
      homeworkDialog.value.displayed = false;
    })
    .catch((err) => {
      console.error(err.data);
      errorSnackbar.value = "Error when adding homework";
    });
};

const addSelfHomeworkDialog = () => {
  homeworkDialog.value.displayed = true;
  homeworkDialog.value.editMode = false;
  homeworkDialog.value.title = "";
  homeworkDialog.value.details = "";
  homeworkDialog.value.dueDate = new Date(Date.now() + 86400000);
};
const editHomeworkFunc = (homework: HomeworkItem) => {
  homeworkDialog.value.title = homework.homework_title;
  homeworkDialog.value.details = homework.homework_details;
  homeworkDialog.value.dueDate = homework.homework_due_date;
  homeworkDialog.value.displayed = true;
  homeworkDialog.value.editMode = true;
};

const saveEditedHomework = async () => {
  if (!homeworkDialog.value.title || !homeworkDialog.value.details) {
    errorSnackbar.value = "All fields are required";
    return;
  }
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/homework/manage`, {
    method: "PATCH",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    query: {
      id: selectedHomework.value?.homework_id,
    },
    body: JSON.stringify({
      title: homeworkDialog.value.title,
      details: homeworkDialog.value.details,
      due_date: homeworkDialog.value.dueDate.toISOString(),
      assigned_class: 0,
    }),
  })
    .then(() => {
      loadHomeworks();
      homeworkDialog.value.displayed = false;
    })
    .catch((err) => {
      console.error(err);
      errorSnackbar.value = "Error when editing homework";
    });
};

// Show confirmation dialog before deleting
const deleteHoweworkFunc = (homework: HomeworkItem) => {
  selectedHomework.value = homework;
  deleteHoweworkDialog.value = true;
};

const deleteHowework = async (homework: HomeworkItem) => {
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/homework/manage`, {
    method: "DELETE",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    query: {
      id: homework.homework_id,
    },
  })
    .then(() => {
      loadHomeworks();
    })
    .catch((err) => {
      console.error(err);
      errorSnackbar.value = "Error when deleting homework";
    })
    .finally(() => {
      deleteHoweworkDialog.value = false;
      if (selectedHomework.value?.homework_id === homework.homework_id) {
        selectedHomework.value = null;
      }
    });
};

onMounted(async () => {
  await loadHomeworks();
  router.push({ query: {} });
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
