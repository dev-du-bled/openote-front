<template>
  <v-container>
    <v-calendar
      ref="calendar"
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
const names = [
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

const getEventColor = (event: any) => {
  return event.color;
};

const fetchEvents = ({ start, end }: { start: Date; end: Date }) => {
  const eventList: Array<any> = [];

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
      title: names[rnd(0, names.length - 1)],
      start: first,
      end: second,
      color: colors[rnd(0, colors.length - 1)],
      allDay: !allDay,
    });
  }

  events.value = eventList;
};

const rnd = (a: number, b: number) => {
  return Math.floor((b - a + 1) * Math.random()) + a;
};

onMounted(() => {
  fetchEvents({
    start: adapter.startOfDay(adapter.startOfMonth(new Date())) as Date,
    end: adapter.endOfDay(adapter.endOfMonth(new Date())) as Date,
  });
});
</script>
