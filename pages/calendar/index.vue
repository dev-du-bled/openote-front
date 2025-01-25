<template>
  <v-container>
    <v-calendar
      :events="events"
      :view-mode="mobile ? 'day' : 'week'"
      :weekdays="weekday"
      :interval-start="7"
      :intervals="12"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { useDate, useDisplay } from "vuetify";

const { mobile } = useDisplay();
const weekday = [1, 2, 3, 4, 5];

const events = ref<Array<any>>([]);
const colors = [
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1",
];
const courses = [
  "Math class",
  "English lesson",
  "Science course",
  "Programming tutorial",
  "Art workshop",
  "Music class",
  "History lecture",
];

const adapter = useDate();

const rnd = (a: number, b: number) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

function generateCourseEvents(startDate: Date, endDate: Date) {
  const eventList: Array<any> = [];
  let current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    // Monday=1, Tuesday=2, Wednesday=3, Thursday=4, Friday=5
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      // morning
      const morningCount = rnd(2, 4);
      for (let i = 0; i < morningCount; i++) {
        const hour = rnd(8, 11);
        const start = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          hour,
          0
        );
        const duration = 60;
        const end = new Date(start.getTime() + duration * 60000);
        eventList.push({
          title: courses[rnd(0, courses.length - 1)],
          start,
          end,
          color: colors[rnd(0, colors.length - 1)],
          allDay: false,
        });
      }
      // afternoon
      const afternoonCount = rnd(2, 4);
      for (let i = 0; i < afternoonCount; i++) {
        const hour = rnd(13, 17);
        const minute = 0;
        const start = new Date(
          current.getFullYear(),
          current.getMonth(),
          current.getDate(),
          hour,
          minute
        );
        const duration = 60;
        const end = new Date(start.getTime() + duration * 60000);
        eventList.push({
          title: courses[rnd(0, courses.length - 1)],
          start,
          end,
          color: colors[rnd(0, colors.length - 1)],
          allDay: false,
        });
      }
    }
    current.setDate(current.getDate() + 1);
  }
  return eventList;
}

const fetchEvents = ({ start, end }: { start: Date; end: Date }) => {
  events.value = generateCourseEvents(start, end);
};

onMounted(() => {
  fetchEvents({
    start: adapter.startOfDay(adapter.startOfMonth(new Date())) as Date,
    end: adapter.endOfDay(adapter.endOfMonth(new Date())) as Date,
  });
});

useHead({
  title: "Calendar",
});
</script>
