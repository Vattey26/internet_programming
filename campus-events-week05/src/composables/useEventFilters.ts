import { computed, ref, type Ref } from "vue";
import type { CampusEvent, Category } from "../types";

// Reusable filtering for any page that shows a list of events.
export function useEventFilters(events: Ref<CampusEvent[]>) {
  const search = ref("");
  const category = ref<Category | "all">("all");

  const visible = computed(() => {
    const term = search.value.trim().toLowerCase();
    return events.value.filter(e => {
      const matchesCategory = category.value === "all" || e.category === category.value;
      const matchesSearch =
        term === "" ||
        e.title.toLowerCase().includes(term) ||
        e.location.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  });

  return { search, category, visible };
}