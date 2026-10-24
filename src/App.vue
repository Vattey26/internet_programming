<script setup lang="ts">
import { computed, ref, watch } from "vue";
import EventList from "./components/EventList.vue";
import { initialEvents } from "./data/events";
import type { CampusEvent } from "./types";
import { seatsLeft } from "./format.ts";

const STORAGE_KEY = "campus-event:mybooking";

const events = ref<CampusEvent[]>(initialEvents.map(e => ({ ...e })));

function loadBookings(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is number => typeof x === "number") : [];

  }
  catch {
    return[];
  }
}

const myBookings = ref<number[]>([]);
const bookingCount = computed(() => myBookings.value.length);

function book(id:number) {
  const event = events.value.find((e) => e.id === id);
  if (!event || seatsLeft(event) == 0) return;
  event.booked++;
  myBookings.value.push(id);
}

function onBook(id: number) {
  book(id);
}

for (const id of loadBookings()) book(id);

watch (
  myBookings,
  (ids) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {

    }
  },
  { deep: true},
);
</script>

<template>
  <main>
    <header>
      <h1>Campus Events</h1>
      <!-- TODO 5: show the real count ("1 seat" / "N seats") -->
      <p class="mine">You have booked {{ bookingCount }} {{ bookingCount === 1 ? "seat." : "seats." }}</p>
    </header>
    <EventList :events="events" @book="onBook" />
  </main>
</template>

<style scoped>
header { margin-bottom: 16px; }
.mine { color: #6b7280; margin: 0; }
</style>
