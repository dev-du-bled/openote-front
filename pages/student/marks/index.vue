<template>
  <v-container>
    <v-card
      title="Marks"
      :disabled="componentLoading"
      :loading="componentLoading"
    >
      <v-card-text>
        <div v-for="(marks, unit) in groupedMarks" :key="unit">
          <v-list>
            <v-list-subheader>{{ unit }}</v-list-subheader>
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
                <v-list-item-title>{{ mark.exam_title }} </v-list-item-title>
                <v-list-item-subtitle
                  >Added the
                  {{
                    new Date(mark.exam_date).toLocaleDateString()
                  }}</v-list-item-subtitle
                >
              </v-list-item>
              <v-divider v-if="index < marks.length - 1"></v-divider>
            </div>
          </v-list>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import type { MarkItem } from "@/utils/types/mark";

const componentLoading = ref(true);

const marks = useState<MarkItem[]>("marks", () => []);
const config = useRuntimeConfig();

const groupedMarks = computed(() => {
  const grouped = marks.value.reduce((acc, mark) => {
    if (!acc[mark.exam_unit]) {
      acc[mark.exam_unit] = [];
    }
    acc[mark.exam_unit].push(mark);
    return acc;
  }, {} as Record<string, MarkItem[]>);
  for (const unit in grouped) {
    grouped[unit].sort(
      (a, b) =>
        new Date(b.exam_date).getTime() - new Date(a.exam_date).getTime()
    );
  }
  return Object.keys(grouped)
    .sort()
    .reduce((acc, key) => {
      acc[key] = grouped[key];
      return acc;
    }, {} as Record<string, MarkItem[]>);
});

const loadMarks = async () => {
  const session = useCookie<SessionContent>("session");
  if (!session.value?.session_token) logout();
  await $fetch(`${config.public.apiBaseUrl}/marks`, {
    headers: {
      Authorization: session.value.session_token,
    },
  })
    .then((data) => {
      marks.value = (data as MarkItem[]).map((marks) => ({
        ...marks,
        date: new Date(marks.exam_date),
      }));
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

useHead({
  title: "Marks",
});
</script>
