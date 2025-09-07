<template>
  <div>
    <!-- Hero Section -->
    <HeroSection
      title="Event History"
      description="Browse all completed events and see what you've missed."
      gradient="gray"
      :stats="{
        icon: 'heroicons:clock',
        text: totalPassedEvents + ' completed events'
      }"
    />

    <!-- Filters Section -->
    <EventFilters
      :selected-category="selectedCategory"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      :available-categories="availableCategories"
      :get-filtered-count="getFilteredCount"
      :all-label="'All Completed'"
      @category-change="selectedCategory = $event"
      @sort-change="sortBy = $event"
      @sort-direction-toggle="toggleSortDirection"
    />

    <!-- Events Grid -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            :event="event"
            :index="index"
            :is-history-view="true"
          />
        </div>

        <!-- Empty State -->
        <EmptyState
          v-if="filteredEvents.length === 0"
          title="No completed events found"
          description="Try adjusting your filter or check back later for completed events."
          action-link="/"
          action-text="Back to Upcoming Events"
          action-icon="heroicons:arrow-left"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import eventsData from '~/data/events.json'
import { useEventFilters } from '~/composables/useEventFilters'

// SEO Meta
useHead({
  title: 'Event History - Whenext',
  meta: [
    { name: 'description', content: 'Browse all completed events and see what you\'ve missed in tech, gaming, and entertainment.' }
  ]
})

// Reactive data
const events = ref(eventsData)

// Use the event filters composable for history (passed events only)
const {
  selectedCategory,
  sortBy,
  sortDirection,
  filteredEvents,
  availableCategories,
  getFilteredCount,
  parseCategories,
  isEventExpired,
  toggleSortDirection
} = useEventFilters(events, {
  defaultSortBy: 'date',
  defaultSortDirection: 'desc', // Newest first for history
  filterPassedOnly: true // Only show passed events
})

// Computed property for total passed events count
const totalPassedEvents = computed(() => {
  return events.value.filter(event => isEventExpired(event)).length
})

// No additional methods needed - all logic is now in components
</script>

<style scoped>
.countdown-card {
  @apply bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>