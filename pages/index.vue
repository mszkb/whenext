<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 text-shadow">
          Never Miss What's <span class="text-yellow-300">Next</span>
        </h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
          Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.
        </p>
        <div class="flex justify-center items-center space-x-4 text-lg">
          <Icon name="heroicons:clock" class="h-6 w-6" />
          <span>{{ filteredEvents.length }} events tracked</span>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="py-8 bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-wrap justify-center gap-4">
          <button
            @click="selectedCategory = 'all'"
            :class="['filter-button', selectedCategory === 'all' ? 'filter-button-active' : '']"
          >
            <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-2" />
            All Events ({{ events.length }})
          </button>
          <button
            @click="selectedCategory = 'tech'"
            :class="['filter-button', selectedCategory === 'tech' ? 'filter-button-active' : '']"
          >
            <Icon name="heroicons:cpu-chip" class="h-4 w-4 mr-2" />
            Tech ({{ events.filter(e => e.category === 'tech').length }})
          </button>
          <button
            @click="selectedCategory = 'gaming'"
            :class="['filter-button', selectedCategory === 'gaming' ? 'filter-button-active' : '']"
          >
            <Icon name="heroicons:puzzle-piece" class="h-4 w-4 mr-2" />
            Gaming ({{ events.filter(e => e.category === 'gaming').length }})
          </button>
          <button
            @click="selectedCategory = 'entertainment'"
            :class="['filter-button', selectedCategory === 'entertainment' ? 'filter-button-active' : '']"
          >
            <Icon name="heroicons:film" class="h-4 w-4 mr-2" />
            Entertainment ({{ events.filter(e => e.category === 'entertainment').length }})
          </button>
        </div>
      </div>
    </section>

    <!-- Events Grid -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="(event, index) in filteredEvents"
            :key="event.id"
            class="countdown-card"
            :class="`animate-fade-in-up animation-delay-${index * 100}`"
          >
            <!-- Event Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <Icon :name="`heroicons:${event.icon}`" class="h-8 w-8 text-blue-600" />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ event.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ event.source }}
                  </p>
                </div>
              </div>
              <span :class="['category-badge', `category-${event.category}`]">
                {{ event.category }}
              </span>
            </div>

            <!-- Event Description -->
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              {{ event.description }}
            </p>

            <!-- Countdown Timer -->
            <div class="mb-6">
              <CountdownTimer :event="event" />
            </div>

            <!-- Confidence and Source -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
                <span :class="getConfidenceBadgeClass(event.confidence)">
                  {{ Math.round(event.confidence * 100) }}%
                </span>
              </div>
              <a
                :href="event.source_url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View Source
                <Icon name="heroicons:arrow-top-right-on-square" class="h-3 w-3 ml-1 inline" />
              </a>
            </div>

            <!-- Additional Notes -->
            <div v-if="event.notes" class="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p class="text-xs text-gray-600 dark:text-gray-400">
                <Icon name="heroicons:information-circle" class="h-3 w-3 mr-1 inline" />
                {{ event.notes }}
              </p>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredEvents.length === 0" class="text-center py-16">
          <Icon name="heroicons:calendar-days" class="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No events found
          </h3>
          <p class="text-gray-500 dark:text-gray-400">
            Try adjusting your filter to see more events.
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import eventsData from '~/data/events.json'

// SEO Meta
useHead({
  title: 'Whenext - Multi Countdown App',
  meta: [
    { name: 'description', content: 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.' }
  ]
})

// Reactive data
const events = ref(eventsData)
const selectedCategory = ref('all')

// Computed properties
const filteredEvents = computed(() => {
  if (selectedCategory.value === 'all') {
    return events.value.sort((a, b) => a.unix_timestamp - b.unix_timestamp)
  }
  return events.value
    .filter(event => event.category === selectedCategory.value)
    .sort((a, b) => a.unix_timestamp - b.unix_timestamp)
})

// Methods
const getConfidenceBadgeClass = (confidence) => {
  const classes = ['confidence-badge']
  if (confidence >= 0.8) {
    classes.push('confidence-high')
  } else if (confidence >= 0.6) {
    classes.push('confidence-medium')
  } else {
    classes.push('confidence-low')
  }
  return classes.join(' ')
}

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

<style scoped>
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
