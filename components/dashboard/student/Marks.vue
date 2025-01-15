<template>
  <v-card
    title="My recent marks"
    :disabled="componentLoading"
    :loading="componentLoading"
  >
    <template v-slot:append>
      <v-btn to="/student/marks" icon="mdi-open-in-new" variant="text"> </v-btn>
    </template>
    <v-card-text v-if="!componentLoading">
      <v-list v-if="marks.length > 0">
        <div v-for="(mark, index) in marks" :key="index">
          <v-list-item>
            <template v-slot:prepend>
              <p
                class="text-h6 font-weight-black pr-4"
                :class="
                  mark.mark_value / mark.exam_max_mark < 0.4
                    ? 'text-red'
                    : mark.mark_value / mark.exam_max_mark < 0.7
                    ? 'text-orange'
                    : 'text-green'
                "
                style="min-width: 90px; text-align: center"
              >
                {{ mark.mark_value }}/{{ mark.exam_max_mark }}
              </p>
            </template>
            <v-list-item-title
              >{{ mark.exam_title }}
              <span class="text-body-2"
                >({{ mark.exam_unit }})</span
              ></v-list-item-title
            >
            <v-list-item-subtitle
              >Added the
              {{
                new Date(mark.exam_date).toLocaleDateString("fr-FR")
              }}</v-list-item-subtitle
            >
          </v-list-item>
          <v-divider v-if="index < marks.length - 1"></v-divider>
        </div>
      </v-list>
      <p v-else class="text-center text-grey">There is no marks to display</p>
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
import type { MarkItem } from "@/utils/types/mark";
const componentLoading = useState("marksComponentLoading", () => true);
const marks = useState<MarkItem[]>("marksComponent", () => []);
const config = useRuntimeConfig();

const loadMarks = async () => {
  const session = useCookie<SessionContent>("session");
  if (!session.value) logout();
  await $fetch(`${config.public.api_base_url}/marks`, {
    headers: {
      Authorization: session.value.session_token,
    },
    params: {
      max_mark: 3,
    },
  })
    .then((data) => {
      marks.value = data as MarkItem[];
      componentLoading.value = false;
    })
    .catch((err) => {
      console.error(err);
      componentLoading.value = false;
    });
};

onMounted(() => {
  loadMarks();
});
</script>
