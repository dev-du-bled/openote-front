<template>
  <v-card
    title="My recent marks"
    :disabled="componentLoading"
    :loading="componentLoading"
  >
    <template v-slot:append>
      <v-btn to="/calendar" icon="mdi-open-in-new" variant="text"> </v-btn>
    </template>
    <v-card-text v-if="!componentLoading">
      <v-list v-if="marks.length > 0">
        <div v-for="(mark, index) in marks" :key="index">
          <v-list-item>
            <template v-slot:prepend>
              <p
                class="text-h6 font-weight-black pr-4"
                :class="mark.value / mark.max_mark < 0.4 ? 'text-red' : ''"
                style="min-width: 90px; text-align: center"
              >
                {{ mark.value }}/{{ mark.max_mark }}
              </p>
            </template>
            <v-list-item-title
              >{{ mark.title }}
              <span class="text-body-2"
                >({{ mark.unit }})</span
              ></v-list-item-title
            >
            <v-list-item-subtitle
              >Added the
              {{
                new Date(mark.date).toLocaleDateString("fr-FR")
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
type mark = {
  value: number;
  max_mark: number;
  coefficient: number;
  unit: string;
  title: string;
  date: Date;
};

const componentLoading = ref(true);
const marks = ref<mark[]>([]);

const loadMarks = async () => {
  const session = useCookie<SessionContent>("session");
  if (!session.value) logout();
  await $fetch(`${apiUrl}/marks`, {
    headers: {
      Authorization: session.value.session_token,
    },
    params: {
      max_mark: 3,
    },
  })
    .then((data) => {
      marks.value = data as mark[];
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
