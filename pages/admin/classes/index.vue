<template>
  <v-container>
    <v-card title="Class List">
      <template v-slot:append>
        <v-tooltip text="Add new class">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="openAddClassDialog"
              icon="mdi-plus"
              variant="text"
            ></v-btn>
          </template>
        </v-tooltip>
      </template>
      <v-data-table
        :headers="classTableHeaders"
        :items="classes"
        :items-per-page="5"
        :hide-default-footer="classes.length < 5"
        :loading="isTableLoading"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn
            density="comfortable"
            variant="text"
            icon="mdi-pencil"
            @click="openEditClassDialog(item.id)"
          />
          <v-btn
            icon="mdi-delete"
            density="comfortable"
            variant="text"
            @click="openDeleteClassDialog(item.id)"
          />
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="classEditDialog.visible" max-width="400">
      <v-card>
        <v-card-title>
          {{ classEditDialog.isNew ? "Add" : "Edit" }} Class
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="classEditDialog.name"
            label="Class Name"
            required
          ></v-text-field>
        </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-spacer />
          <v-btn @click="classEditDialog.visible = false">Cancel</v-btn>
          <v-btn color="primary" @click="saveClass"
            >{{ classEditDialog.isNew ? "Add" : "Save" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="classDeleteDialog.visible" max-width="400">
      <v-card title="Delete Class" prepend-icon="mdi-alert">
        <v-card-text> Are you sure you want to delete this class? </v-card-text>
        <v-card-actions class="bg-surface-light">
          <v-spacer />
          <v-btn @click="classDeleteDialog.visible = false">Cancel</v-btn>
          <v-btn color="error" @click="deleteClass">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      color="error"
      timer="#730800"
      :text="errorMessage"
      v-model="isErrorMessageVisible"
    ></v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import type { ClassItem } from "~/utils/definitions/class";

const isTableLoading = ref(true);

interface TableHeader {
  title: string;
  key: string;
  align?: "start" | "center" | "end";
  sortable?: boolean;
}

const classEditDialog = ref({
  loading: false,
  visible: false,
  isNew: false,
  name: "",
  id: 0,
});

const classDeleteDialog = ref({
  loading: false,
  visible: false,
  id: 0,
});

const classTableHeaders: TableHeader[] = [
  {
    title: "Class ID",
    key: "id",
  },
  {
    title: "Class Name",
    key: "name",
  },
  {
    title: "",
    align: "end",
    sortable: false,
    key: "actions",
  },
];

const errorMessage = ref("");
const isErrorMessageVisible = computed({
  get: () => errorMessage.value.length > 0,
  set: (value) => {
    if (!value) errorMessage.value = "";
  },
});

const session = useCookie<SessionContent>("session");
const config = useRuntimeConfig();

const classes = ref<ClassItem[]>([]);

const fetchClasses = async () => {
  await $fetch(`${config.public.apiBaseUrl}/manage/class`, {
    headers: {
      Authorization: session.value.session_token,
    },
  })
    .then((res: any) => {
      classes.value = res;
    })
    .catch(() => {
      errorMessage.value = "Error fetching class list";
    })
    .finally(() => {
      isTableLoading.value = false;
    });
};

const deleteClass = async () => {
  classDeleteDialog.value.loading = true;
  await $fetch(`${config.public.apiBaseUrl}/manage/class/`, {
    method: "DELETE",
    headers: {
      Authorization: session.value.session_token,
    },
    query: {
      id: classDeleteDialog.value.id,
    },
  })
    .then(() => {
      fetchClasses();
      classDeleteDialog.value.visible = false;
    })
    .catch(() => {
      errorMessage.value = "Error deleting class";
    })
    .finally(() => {
      classDeleteDialog.value.loading = false;
    });
};

const saveClass = async () => {
  classEditDialog.value.loading = true;
  await $fetch(`${config.public.apiBaseUrl}/manage/class`, {
    method: classEditDialog.value.isNew ? "POST" : "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: session.value.session_token,
    },
    body: {
      name: classEditDialog.value.name,
    },
    query: {
      id: classEditDialog.value.isNew ? null : classEditDialog.value.id,
    },
  })
    .then(() => {
      fetchClasses();
      classEditDialog.value.visible = false;
    })
    .catch(() => {
      errorMessage.value = "Error saving class";
    })
    .finally(() => {
      classEditDialog.value.loading = false;
    });
};

const openAddClassDialog = () => {
  classEditDialog.value.isNew = true;
  classEditDialog.value.visible = true;
  classEditDialog.value.name = "";
  classEditDialog.value.id = 0;
};

const openDeleteClassDialog = (id: number) => {
  classDeleteDialog.value.id = id;
  classDeleteDialog.value.visible = true;
};

const openEditClassDialog = (id: number) => {
  const classItem = classes.value.find((item) => item.id === id);
  if (!classItem) return;
  classEditDialog.value.isNew = false;
  classEditDialog.value.visible = true;
  classEditDialog.value.name = classItem.name;
  classEditDialog.value.id = classItem.id;
};

onMounted(() => {
  fetchClasses();
});

useHead({
  title: "Classes",
});
</script>
