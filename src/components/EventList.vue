<script setup lang="ts">
import { computed, ref } from "vue";
import type { CampusEvent, Category } from "../types";
import EventCard from "./EventCard.vue";

const props = defineProps<{ events: CampusEvent[] }>();
const emit = defineEmits<{ book: [id: number]}>();

const search = ref("");
const category = ref<Category | "all">("all")

const visible = computed(() => {
  const q = search.value.toLowerCase();
  return props.events.filter(
    (e) =>
      (category.value === "all" || e.category === category.value) &&
      (e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)),
  );
});
</script>

<template>
  <section>
    <div class="filters">
      <input v-model="search" type="search" placeholder="Search title or location" aria-label="Search" />
      <select v-model="category" aria-label="Category">
        <option value="all">All categories</option>
        <option value="talk">Talks</option>
        <option value="workshop">Workshops</option>
        <option value="social">Social</option>
        <option value="sport">Sport</option>
      </select>
    </div>

    <p class="count">{{ visible.length }} of {{ events.length }} events</p>

    <div v-if="visible.length > 0" class="grid">
      <EventCard v-for="e in visible" :key="e.id" :event="e" @book="emit('book', $event)" />
    </div>
    <p v-else class="empty">No events match your search.</p>
  </section>
</template>

<style scoped>
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filters input { flex: 1; min-width: 200px; }
.count { color: #6b7280; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 16px; }
.empty { padding: 32px; text-align: center; background: white; border-radius: 10px; }
</style>
