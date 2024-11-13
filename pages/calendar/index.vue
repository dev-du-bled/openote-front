<template>
  <v-container>
    <v-calendar
      ref="calendar"
      v-model="value"
      :events="events"
      :view-mode="mobile ? 'day' : 'week'"
      :weekdays="weekday"
      :interval-start="7"
      :intervals="12"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useDate, useDisplay } from "vuetify";

const { mobile } = useDisplay();

const weekday = ref([1, 2, 3, 4, 5]);
const value = ref([new Date()]);

interface Event {
  title: string;
  start: Date;
  end: Date;
  color: string;
  allDay: boolean;
}

const events = ref<Event[]>([]);
const colors = [
  "blue",
  "indigo",
  "deep-purple",
  "cyan",
  "green",
  "orange",
  "grey darken-1",
];
const titles = [
  "Meeting",
  "Holiday",
  "PTO",
  "Travel",
  "Event",
  "Birthday",
  "Conference",
  "Party",
];

const adapter = useDate();

const getEvents = ({ start, end }: { start: Date; end: Date }) => {
  const eventList = [];

  const min = start;
  const max = end;
  const days = (max.getTime() - min.getTime()) / 86400000;
  const eventCount = rnd(days, days + 20);

  for (let i = 0; i < eventCount; i++) {
    const allDay = rnd(0, 3) === 0;
    const firstTimestamp = rnd(min.getTime(), max.getTime());
    const first = new Date(firstTimestamp - (firstTimestamp % 900000));
    const secondTimestamp = rnd(2, allDay ? 288 : 8) * 900000;
    const second = new Date(first.getTime() + secondTimestamp);

    eventList.push({
      title: titles[rnd(0, titles.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: !allDay,
    });
  }

  events.value = eventList;
};

const getEventColor = (event: Event) => {
  return event.color;
};

const rnd = (a: number, b: number): number => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

onMounted(() => {
  getEvents({
    start: adapter.startOfDay(adapter.startOfMonth(new Date())) as Date,
    end: adapter.endOfDay(adapter.endOfMonth(new Date())) as Date,
  });
});

useHead({
  title: "Calendar",
});
</script>
