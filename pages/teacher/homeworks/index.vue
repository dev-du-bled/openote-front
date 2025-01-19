<template>
  <v-container>
    <v-card
      title="Homeworks"
      :disabled="componentLoading"
      :loading="componentLoading"
    >
      <template v-slot:prepend>
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
        <v-tooltip text="Create a homework">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="addHomeworkDialog()"
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
              <template
                v-for="classItem in classList as ClassItem[]"
                :key="classItem.id"
              >
                <v-list-subheader
                  v-if="
                    homeworkList.some((hw) => hw.class_name === classItem.name)
                  "
                  >{{ classItem.name }}</v-list-subheader
                >
                <v-list-item
                  v-for="homework in homeworkList.filter(
                    (hw) => hw.class_name === classItem.name
                  )"
                  :variant="
                    selectedHomework === null
                      ? 'flat'
                      : (selectedHomework as HomeworkItem).homework_id === homework.homework_id
                      ? 'tonal'
                      : 'flat'
                  "
                  :key="homework.homework_id"
                  @click="selectHomework(homework)"
                >
                  <v-list-item-title>{{
                    homework.homework_title
                  }}</v-list-item-title>
                  <v-list-item-subtitle
                    :class="
                      new Date(homework.homework_due_date) < new Date()
                        ? 'text-red-accent-4'
                        : new Date(homework.homework_due_date).getTime() -
                            new Date().getTime() <
                          86400000
                        ? 'orange-darken-4'
                        : ''
                    "
                  >
                    Due in
                    {{
                      new Date(homework.homework_due_date).toLocaleDateString()
                    }}
                  </v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
          <v-divider v-if="!mobile" :vertical="true" />
          <v-col v-if="!mobile || selectedHomework">
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
                    : new Date(selectedHomework.homework_due_date).getTime() -
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
              <div class="mt-4">
                <v-btn
                  color="primary"
                  class="mr-3"
                  prepend-icon="mdi-pencil"
                  @click="editHomeworkDialog()"
                  >Edit</v-btn
                >
                <v-btn
                  color="error"
                  prepend-icon="mdi-delete"
                  @click="deleteHomeworkDialog"
                  >Delete</v-btn
                >
              </div>
            </div>
            <div v-else>
              <p>Select a homework to see the details</p>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="homeworkDialog.displayed" max-width="600" scrollable>
      <v-card :title="homeworkDialog.edit ? 'Edit Homework' : 'Add Homework'">
        <v-card-text>
          <v-form>
            <v-select
              v-model="homeworkDialog.classId"
              :items="classList"
              item-title="name"
              item-value="id"
              label="Class"
              required
            ></v-select>
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
              label="Due Date"
              required
            ></v-date-input>
          </v-form>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn @click="homeworkDialog.displayed = false">Cancel</v-btn>
          <v-btn
            v-if="homeworkDialog.edit"
            color="primary"
            @click="editHomework"
            >Save</v-btn
          >
          <v-btn v-else color="primary" @click="addHomework">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteHomeWorkDialog.displayed" max-width="600">
      <v-card title="Delete Homework">
        <v-card-text>
          <p>Are you sure you want to delete this homework?</p>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-btn @click="deleteHomeWorkDialog.displayed = false">Cancel</v-btn>
          <v-btn color="error">Delete</v-btn>
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
import type { ClassItem } from "~/utils/types/class";
import type { HomeworkItem } from "~/utils/types/homework";

const { mobile } = useDisplay();

const session = useCookie<SessionContent>("session");
const config = useRuntimeConfig();

const componentLoading = useState("homeworksTeacherLoading", () => true);

const errorSnackbar = useState<string>("errorSnackbar", () => "");
const isErrorSnackbarVisible = computed({
  get: () => errorSnackbar.value.length > 0,
  set: (value) => {
    if (!value) errorSnackbar.value = "";
  },
});

const classList = useState<ClassItem[]>("classList", () => []);
const homeworkList = useState<HomeworkItem[]>("homeworkList", () => []);

const homeworkDialog = useState("homeworkDialog", () => ({
  displayed: false,
  edit: false,
  title: "",
  details: "",
  classId: 0,
  dueDate: new Date(),
}));

const deleteHomeWorkDialog = useState("deleteHomeWorkDialog", () => ({
  displayed: false,
  homeworkId: 0,
}));

const selectedHomework = useState<HomeworkItem | null>(
  "selectedHomework",
  () => null
);

const fetchClassList = async () => {
  await $fetch(`${config.public.apiBaseUrl}/collection/class`, {
    headers: {
      Authorization: session.value.session_token,
    },
  })
    .then((res: any) => {
      classList.value = res;
      console.log(classList.value);
    })
    .catch((err) => {
      errorSnackbar.value = "Error fetching class list";
    });
};

const fetchHomeworkList = async () => {
  await $fetch(`${config.public.apiBaseUrl}/homework`, {
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
  })
    .then((data) => {
      homeworkList.value = (data as HomeworkItem[]).map((hw) => ({
        ...hw,
        homework_due_date: new Date(hw.homework_due_date),
      }));
      console.log(homeworkList.value);
    })
    .catch((err) => {
      errorSnackbar.value = "Error fetching homework list";
    });
};

const selectHomework = (homework: HomeworkItem | null) => {
  selectedHomework.value = homework;
};

const addHomeworkDialog = () => {
  homeworkDialog.value.edit = false;
  homeworkDialog.value.title = "";
  homeworkDialog.value.details = "";
  homeworkDialog.value.classId = 0;
  homeworkDialog.value.dueDate = new Date(new Date().getTime() + 86400000); // Tomorrow
  homeworkDialog.value.displayed = true;
};

const editHomeworkDialog = () => {
  homeworkDialog.value.edit = true;
  homeworkDialog.value.title = selectedHomework.value?.homework_title || "";
  homeworkDialog.value.details = selectedHomework.value?.homework_details || "";
  homeworkDialog.value.classId =
    classList.value.find((c) => c.name === selectedHomework.value?.class_name)
      ?.id || 0;
  homeworkDialog.value.dueDate =
    selectedHomework.value?.homework_due_date || new Date();
  homeworkDialog.value.displayed = true;
};

const deleteHomeworkDialog = () => {
  deleteHomeWorkDialog.value.homeworkId =
    selectedHomework.value?.homework_id || 0;
  deleteHomeWorkDialog.value.displayed = true;
};

const addHomework = async () => {
  await $fetch(`${config.public.apiBaseUrl}/homework/manage`, {
    method: "POST",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      assigned_class: homeworkDialog.value.classId,
      title: homeworkDialog.value.title,
      details: homeworkDialog.value.details,
      due_date: homeworkDialog.value.dueDate.toLocaleDateString(),
    }),
  })
    .then(() => {
      fetchHomeworkList();
      homeworkDialog.value.displayed = false;
    })
    .catch((err) => {
      errorSnackbar.value = "Error adding homework";
    });
};

const editHomework = async () => {
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
      assigned_class: homeworkDialog.value.classId,
      title: homeworkDialog.value.title,
      details: homeworkDialog.value.details,
      due_date: homeworkDialog.value.dueDate.toLocaleDateString(),
    }),
  })
    .then(() => {
      fetchHomeworkList();
      homeworkDialog.value.displayed = false;
    })
    .catch((err) => {
      errorSnackbar.value = "Error editing homework";
    });
};

const deleteHomeWork = async () => {
  await $fetch(`${config.public.apiBaseUrl}/homework/manage`, {
    method: "DELETE",
    headers: {
      Authorization: session.value.session_token,
      "Content-Type": "application/json",
    },
    query: {
      id: deleteHomeWorkDialog.value.homeworkId,
    },
  })
    .then(() => {
      fetchHomeworkList();
      deleteHomeWorkDialog.value.displayed = false;
    })
    .catch((err) => {
      errorSnackbar.value = "Error deleting homework";
    });
};

onMounted(async () => {
  await fetchClassList();
  await fetchHomeworkList();
  componentLoading.value = false;
});

useHead({
  title: "Homeworks",
});
</script>
