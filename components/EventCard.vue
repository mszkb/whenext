<template>
  <div
    :class="[
      'countdown-card',
      'animate-fade-in-up animation-delay-' + (index * 100),
      isHistoryView ? 'opacity-75' : ''
    ]"
  >
    <!-- Event Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <Icon
          :name="`heroicons:${event.icon}`"
          :class="[
            'h-8 w-8',
            isHistoryView ? 'text-gray-500' : 'text-blue-600'
          ]"
        />
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
        <CategoryBadge
          v-for="category in parseCategories(event.category)"
          :key="category"
          :category="category"
        />
      </div>
    </div>

    <!-- Event Description -->
    <p class="text-gray-600 dark:text-gray-300 text-sm mb-6 leading-relaxed">
      {{ event.description }}
    </p>

    <!-- Countdown Timer -->
    <div class="mb-6">
      <CountdownTimer :event="event" :timezone="timezone" />
    </div>

    <!-- Status Section -->
    <div class="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      <!-- Confidence or Status -->
      <div v-if="!isExpired" class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
        <span :class="getConfidenceBadgeClass(event.confidence)">
          {{ Math.round(event.confidence * 100) }}%
        </span>
      </div>
      <div v-else class="flex items-center space-x-2">
        <span class="text-sm text-gray-500 dark:text-gray-400">Event Status:</span>
        <span :class="[
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          isHistoryView
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
        ]">
          Completed
        </span>
      </div>

      <!-- Source Link -->
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
</template>

<script setup>
import { useEventFilters } from '~/composables/useEventFilters'

const props = defineProps({
  event: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  },
  isHistoryView: {
    type: Boolean,
    default: false
  },
  timezone: {
    type: String,
    default: 'UTC'
  }
})

// Get utility functions from composable
const { parseCategories, isEventExpired } = useEventFilters(ref([]), {})

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

// Computed
const isExpired = computed(() => isEventExpired(props.event))
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
