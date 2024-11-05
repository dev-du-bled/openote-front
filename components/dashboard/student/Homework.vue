<template>
  <v-card title="My homework">
    <template v-slot:append>
      <v-btn to="/calendar" icon="mdi-open-in-new" variant="text"> </v-btn>
    </template>
    <v-card-text>
      <v-list v-if="homeworks.length > 0">
        <div v-for="(homework, index) in homeworks" :key="index">
          <v-list-item :variant="homework.done ? 'plain' : 'flat'" :key="index">
            <template v-slot:prepend>
              <v-list-item-action start>
                <v-checkbox-btn
                  :id="'homework-' + index"
                  v-model="homework.done"
                ></v-checkbox-btn>
              </v-list-item-action>
            </template>
            <template v-slot:append>
              <v-btn icon variant="text">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
            </template>
            <v-list-item-title
              >{{ homework.title }}
              {{ homework.done ? "(Done)" : "" }}</v-list-item-title
            >
            <v-list-item-subtitle
              >Due in
              {{
                homework.dueDate.toLocaleDateString("fr-FR")
              }}</v-list-item-subtitle
            >
          </v-list-item>
          <v-divider v-if="index < homeworks.length - 1"></v-divider>
        </div>
      </v-list>
      <p v-else class="text-center text-grey">
        There is no homeworks to display
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
const homeworks = ref([
  {
    title: "Math homework",
    done: false,
    dueDate: new Date("2024-08-21"),
  },
  {
    title: "Physics homework",
    done: false,
    dueDate: new Date("2024-08-22"),
  },
  {
    title: "Chemistry homework",
    done: false,
    dueDate: new Date("2024-08-24"),
  },
]);
</script>
