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
  }
})

// Define emits
defineEmits([
  'category-change',
  'sort-change',
  'sort-direction-toggle',
  'passed-events-toggle'
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
