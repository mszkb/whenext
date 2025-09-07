<template>
  <section class="py-8 bg-white dark:bg-gray-800 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-6">
        <!-- Category Filters -->
        <div class="flex flex-wrap justify-center gap-4">
          <button
            @click="$emit('category-change', 'all')"
            :class="['filter-button', selectedCategory === 'all' ? 'filter-button-active' : '']"
          >
            <Icon name="heroicons:squares-2x2" class="h-4 w-4 mr-2" />
            {{ allLabel }} ({{ getFilteredCount('all') }})
          </button>
          <button
            v-for="category in availableCategories"
            :key="category"
            @click="$emit('category-change', category)"
            :class="['filter-button', selectedCategory === category ? 'filter-button-active' : '']"
          >
            <Icon :name="getCategoryIcon(category)" class="h-4 w-4 mr-2" />
            {{ capitalizeFirst(category) }} ({{ getFilteredCount(category) }})
          </button>
        </div>

        <!-- Controls -->
        <div class="flex flex-col gap-4">
          <!-- Calendar Subscribe Button -->
          <div class="flex justify-center lg:justify-end">
            <CalendarSubscribe 
              :category="selectedCategory === 'all' ? 'alle' : selectedCategory" 
            />
          </div>
          
          <!-- Sort Controls -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <select
                :value="sortBy"
                @change="$emit('sort-change', $event.target.value)"
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
              @click="$emit('sort-direction-toggle')"
              class="filter-button p-2"
              :title="sortDirection === 'asc' ? 'Sort Ascending' : 'Sort Descending'"
            >
              <Icon
                :name="sortDirection === 'asc' ? 'heroicons:arrow-up' : 'heroicons:arrow-down'"
                class="h-4 w-4"
              />
            </button>
          </div>

          <!-- Timezone Selector -->
          <div class="flex items-center gap-2">
            <Icon
              name="heroicons:globe-alt"
              :class="[
                'h-4 w-4',
                isLoadingTimezone ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'
              ]"
            />
            <div class="relative">
              <select
                :value="selectedTimezone"
                @change="$emit('timezone-change', $event.target.value)"
                :disabled="isLoadingTimezone"
                :class="[
                  'filter-button appearance-none pr-8 text-sm',
                  isLoadingTimezone ? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-700' : ''
                ]"
              >
                <option
                  v-for="tz in commonTimezones"
                  :key="tz.value"
                  :value="tz.value"
                >
                  {{ tz.label }}
                </option>
              </select>
              <Icon
                name="heroicons:chevron-down"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 pointer-events-none"
                :class="isLoadingTimezone ? 'opacity-50' : ''"
              />
            </div>

            <!-- Auto-detect button -->
            <button
              @click="$emit('auto-detect-timezone')"
              :disabled="isLoadingTimezone"
              :class="[
                'filter-button p-2',
                isAutoDetected && !isLoadingTimezone ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : '',
                isLoadingTimezone ? 'bg-gray-100 dark:bg-gray-700 animate-pulse' : ''
              ]"
              :title="isLoadingTimezone ? 'Detecting timezone...' : isAutoDetected ? 'Auto-detected timezone' : 'Auto-detect timezone'"
            >
              <Icon
                :name="isLoadingTimezone ? 'heroicons:arrow-path' : 'heroicons:map-pin'"
                :class="[
                  'h-4 w-4',
                  isLoadingTimezone ? 'animate-spin' : ''
                ]"
              />
            </button>
          </div>

          <!-- Show Passed Events Toggle (only for main page) -->
          <div v-if="showPassedEventsToggle" class="flex justify-end">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                :checked="showPassedEvents"
                @change="$emit('passed-events-toggle', $event.target.checked)"
                type="checkbox"
                class="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
              <span class="text-sm text-gray-700 dark:text-gray-300">Show Passed Events</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  selectedCategory: {
    type: String,
    required: true
  },
  sortBy: {
    type: String,
    required: true
  },
  sortDirection: {
    type: String,
    required: true
  },
  showPassedEvents: {
    type: Boolean,
    default: false
  },
  showPassedEventsToggle: {
    type: Boolean,
    default: false
  },
  availableCategories: {
    type: Array,
    required: true
  },
  getFilteredCount: {
    type: Function,
    required: true
  },
  allLabel: {
    type: String,
    default: 'All Events'
  },
  selectedTimezone: {
    type: String,
    required: true
  },
  isLoadingTimezone: {
    type: Boolean,
    default: true
  },
  isAutoDetected: {
    type: Boolean,
    default: true
  },
  commonTimezones: {
    type: Array,
    default: () => [
      { value: 'UTC', label: 'UTC' },
      { value: 'America/New_York', label: 'Eastern Time' },
      { value: 'America/Chicago', label: 'Central Time' },
      { value: 'America/Denver', label: 'Mountain Time' },
      { value: 'America/Los_Angeles', label: 'Pacific Time' },
      { value: 'Europe/London', label: 'London' },
      { value: 'Europe/Berlin', label: 'Berlin' },
      { value: 'Europe/Paris', label: 'Paris' },
      { value: 'Asia/Tokyo', label: 'Tokyo' },
      { value: 'Asia/Shanghai', label: 'Shanghai' },
      { value: 'Australia/Sydney', label: 'Sydney' },
      { value: 'Pacific/Auckland', label: 'Auckland' }
    ]
  }
})

// Define emits
defineEmits([
  'category-change',
  'sort-change',
  'sort-direction-toggle',
  'passed-events-toggle',
  'timezone-change',
  'auto-detect-timezone'
])

// Methods
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

const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
</script>
