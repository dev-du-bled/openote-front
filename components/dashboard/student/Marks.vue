<template>
  <v-card title="My recent marks">
    <template v-slot:append>
      <v-btn to="/calendar" icon="mdi-open-in-new" variant="text"> </v-btn>
    </template>
    <v-card-text>
      <v-list v-if="marks.length > 0">
        <div v-for="(mark, index) in marks" :key="index">
          <v-list-item>
            <template v-slot:prepend>
              <p
                class="text-h6 font-weight-black pr-4"
                :class="mark.mark / mark.max_mark < 0.4 ? 'text-red' : ''"
                style="min-width: 90px; text-align: center"
              >
                {{ mark.mark }}/{{ mark.max_mark }}
              </p>
            </template>
            <v-list-item-title
              >{{ mark.description }}
              <span>({{ mark.subject }})</span></v-list-item-title
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
  </v-card>
</template>

<script setup lang="ts">
type mark = {
  mark: number;
  max_mark: number;
  coefficient: number;
  subject: string;
  description: string;
  date: Date;
};

const marks = ref<mark[]>([
  {
    mark: 10,
    max_mark: 20,
    coefficient: 2.0,
    subject: "System",
    description: "QCM Linux",
    date: new Date("2021-12-13"),
  },
  {
    mark: 10,
    max_mark: 200,
    coefficient: 2.0,
    subject: "System",
    description: "QCM Linux",
    date: new Date("2021-12-13"),
  },
  {
    mark: 6,
    max_mark: 20,
    coefficient: 2.0,
    subject: "History",
    description: "TP WWII",
    date: new Date("2021-02-13"),
  },
  {
    mark: 10,
    max_mark: 20,
    coefficient: 2.0,
    subject: "System",
    description: "QCM Linux",
    date: new Date("2021-12-13"),
  },
]);

const loadMarks = async () => {};
</script>
