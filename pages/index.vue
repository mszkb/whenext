<template>
  <div>
    <!-- Hero Section -->
    <HeroSection
      title="Never Miss What's Next"
      highlight-text="Next"
      description="Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring."
      gradient="blue"
      :stats="{
        icon: 'heroicons:clock',
        text: events.length + ' events tracked'
      }"
      />
      <!-- Filters Section -->
    <EventFilters
      :selected-category="selectedCategory"
      :sort-by="sortBy"
      :sort-direction="sortDirection"
      :show-passed-events="showPassedEvents"
      :show-passed-events-toggle="true"
      :available-categories="availableCategories"
      :get-filtered-count="getFilteredCount"
      :selected-timezone="selectedTimezone"
      :is-loading-timezone="isLoadingTimezone"
      :is-auto-detected="isAutoDetected"
      :common-timezones="commonTimezones"
      @category-change="selectedCategory = $event"
      @sort-change="sortBy = $event"
      @sort-direction-toggle="toggleSortDirection"
      @passed-events-toggle="showPassedEvents = $event"
      @timezone-change="setTimezone($event)"
      @auto-detect-timezone="autoDetectTimezone"
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
            :is-history-view="false"
            :timezone="selectedTimezone"
          />
        </div>

        <!-- Empty State -->
        <EmptyState
          v-if="filteredEvents.length === 0"
          title="No events found"
          description="Try adjusting your filter to see more events."
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import eventsData from '~/data/events.json'
import { useEventFilters } from '~/composables/useEventFilters'
import { useTimezone } from '~/composables/useTimezone'

// SEO Meta
useHead({
  title: 'Whenext - Multi Countdown App',
  meta: [
    { name: 'description', content: 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.' }
  ]
})

// Reactive data
const events = ref(eventsData)

// Use the timezone composable
const {
  selectedTimezone,
  isLoadingTimezone,
  isAutoDetected,
  setTimezone,
  autoDetectTimezone,
  commonTimezones,
  initializeTimezone
} = useTimezone()

// Initialize timezone detection on mount
onMounted(() => {
  initializeTimezone()
})

// Use the event filters composable
const {
  selectedCategory,
  sortBy,
  sortDirection,
  showPassedEvents,
  filteredEvents,
  availableCategories,
  getFilteredCount,
  parseCategories,
  isEventExpired,
  toggleSortDirection
} = useEventFilters(events, {
  showPassedEvents: false,
  defaultSortBy: 'date',
  defaultSortDirection: 'asc'
})

// No additional methods needed - all logic is now in components


// Schema.org structured data for events
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Upcoming Events Countdown',
        'description': 'Track upcoming events in tech, gaming, and entertainment',
        'numberOfItems': events.value.length,
        'itemListElement': events.value.map((event, index) => ({
          '@type': 'Event',
          'position': index + 1,
          'name': event.title,
          'description': event.description,
          'startDate': event.event_date_iso,
          'organizer': {
            '@type': 'Organization',
            'name': event.source,
            'url': event.source_url
          },
          'eventStatus': 'https://schema.org/EventScheduled',
          'eventAttendanceMode': 'https://schema.org/MixedEventAttendanceMode',
          'url': event.source_url
        }))
      })
    }
  ]
})
</script>

