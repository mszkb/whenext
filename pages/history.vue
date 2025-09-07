<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-gray-600 via-slate-600 to-zinc-600 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Event History
        </h1>
        <p class="text-xl text-gray-200 max-w-2xl mx-auto">
          Browse all completed events and see what you've missed.
        </p>
        <div class="flex justify-center items-center space-x-4 mt-6 text-lg">
          <Icon name="heroicons:clock" class="h-6 w-6" />
          <span>{{ totalPassedEvents }} completed events</span>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="py-8 bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
          <!-- Category Filters -->
          <div class="flex flex-wrap justify-center gap-4">
            <button
              @click="selectedCategory = 'all'"
              :class="['filter-button', selectedCategory === 'all' ? 'filter-button-active' : '']"
            >
              <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-2" />
              All Completed ({{ getFilteredCount('all') }})
            </button>
            <button
              v-for="category in availableCategories"
              :key="category"
              @click="selectedCategory = category"
              :class="['filter-button', selectedCategory === category ? 'filter-button-active' : '']"
            >
              <Icon :name="getCategoryIcon(category)" class="h-4 w-4 mr-2" />
              {{ capitalizeFirst(category) }} ({{ getFilteredCount(category) }})
            </button>
          </div>

          <!-- Sort Controls -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                v-model="sortBy"
                class="filter-button appearance-none pr-8"
              >
                <option value="date">Sort by Date</option>
                <option value="category">Sort by Category</option>
                <option value="name">Sort by Name</option>
              </select>
              <Icon name="heroicons:chevron-down" class="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none" />
            </div>

            <!-- Sort Direction Toggle -->
            <button
              @click="toggleSortDirection"
              class="filter-button p-2"
              :title="sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
            >
              <Icon
                :name="sortDirection === 'asc' ? 'heroicons:arrow-up' : 'heroicons:arrow-down'"
                class="h-4 w-4"
              />
            </button>
          </div>
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
            class="countdown-card opacity-75"
            :class="`animate-fade-in-up animation-delay-${index * 100}`"
          >
            <!-- Event Header -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                <Icon :name="`heroicons:${event.icon}`" class="h-8 w-8 text-gray-500" />
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {{ event.title }}
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ event.source }}
                  </p>
                </div>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="category in parseCategories(event.category)"
                  :key="category"
                  :class="['category-badge', getCategoryClass(category)]"
                >
                  {{ category }}
                </span>
              </div>
            </div>

            <!-- Event Description -->
            <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
              {{ event.description }}
            </p>

            <!-- Event Details -->
            <div class="mb-6">
              <CountdownTimer :event="event" />
            </div>

            <!-- Event Status -->
            <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Completed
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
            No completed events found
          </h3>
          <p class="text-gray-500 dark:text-gray-400 mb-4">
            Try adjusting your filter or check back later for completed events.
          </p>
          <NuxtLink
            to="/"
            class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Icon name="heroicons:arrow-left" class="h-4 w-4 mr-2" />
            Back to Upcoming Events
          </NuxtLink>
        </div>
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

// Methods
// Get appropriate icon for category
const getCategoryIcon = (category) => {
  const iconMap = {
    tech: 'heroicons:cpu-chip',
    gaming: 'heroicons:puzzle-piece',
    entertainment: 'heroicons:film',
    ai: 'heroicons:bolt',
    'e-sports': 'heroicons:trophy',
    esports: 'heroicons:trophy',
    streaming: 'heroicons:video-camera',
    default: 'heroicons:tag'
  }

  return iconMap[category.toLowerCase()] || iconMap.default
}

// Get category class for styling
const getCategoryClass = (category) => {
  const classMap = {
    tech: 'category-tech',
    gaming: 'category-gaming',
    entertainment: 'category-entertainment',
    ai: 'category-ai',
    'e-sports': 'category-e-sports',
    esports: 'category-e-sports',
    streaming: 'category-streaming',
    default: 'category-default'
  }

  return classMap[category.toLowerCase()] || classMap.default
}

// Capitalize first letter of string
const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
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
