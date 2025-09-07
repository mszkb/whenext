<template>
  <div class="text-center">
    <!-- Event Date Display -->
    <div class="mb-3">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {{ formatEventDate(event.event_date_iso) }}
      </p>
    </div>

    <!-- Countdown Display -->
    <div v-if="!isExpired" class="grid grid-cols-4 gap-2 mb-2">
      <div class="text-center">
        <div class="countdown-timer text-blue-600 dark:text-blue-400">
          {{ timeLeft.days }}
        </div>
        <div class="countdown-unit">Days</div>
      </div>
      <div class="text-center">
        <div class="countdown-timer text-purple-600 dark:text-purple-400">
          {{ String(timeLeft.hours).padStart(2, '0') }}
        </div>
        <div class="countdown-unit">Hours</div>
      </div>
      <div class="text-center">
        <div class="countdown-timer text-pink-600 dark:text-pink-400">
          {{ String(timeLeft.minutes).padStart(2, '0') }}
        </div>
        <div class="countdown-unit">Minutes</div>
      </div>
      <div class="text-center">
        <div class="countdown-timer text-green-600 dark:text-green-400">
          {{ String(timeLeft.seconds).padStart(2, '0') }}
        </div>
        <div class="countdown-unit">Seconds</div>
      </div>
    </div>

    <!-- Expired State -->
    <div v-else class="py-4">
      <div class="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
        Event Passed
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400">
        This event occurred {{ formatTimeAgo(event.event_date_iso) }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div v-if="!isExpired" class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
      <div 
        class="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-1000"
        :style="{ width: progressPercentage + '%' }"
      ></div>
    </div>

    <!-- Time Remaining Text -->
    <div v-if="!isExpired" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
      {{ getTimeRemainingText() }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  event: {
    type: Object,
    required: true
  }
})

// Reactive state
const timeLeft = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const isExpired = ref(false)
const progressPercentage = ref(0)

// Reactive state for time calculations
const eventTime = computed(() => new Date(props.event.event_date_iso).getTime())
const totalDuration = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds

// Calculate time remaining with optimized calculations
const calculateTimeLeft = () => {
  const now = Date.now()
  const difference = eventTime.value - now

  // Immediate expiry detection for better responsiveness
  if (difference <= 0) {
    if (!isExpired.value) {
      // Just expired - update immediately
      isExpired.value = true
      timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      progressPercentage.value = 100
    }
    return
  }

  // Only update if not expired
  if (isExpired.value) {
    isExpired.value = false
  }

  // Calculate time components with optimized math
  const days = Math.floor(difference / 86400000) // 1000 * 60 * 60 * 24
  const hours = Math.floor((difference % 86400000) / 3600000) // 1000 * 60 * 60
  const minutes = Math.floor((difference % 3600000) / 60000) // 1000 * 60
  const seconds = Math.floor((difference % 60000) / 1000)

  // Only update if values have actually changed to reduce reactivity overhead
  const newTimeLeft = { days, hours, minutes, seconds }
  if (JSON.stringify(timeLeft.value) !== JSON.stringify(newTimeLeft)) {
    timeLeft.value = newTimeLeft
  }

  // Calculate progress percentage
  const elapsed = totalDuration - difference
  const newProgress = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
  if (progressPercentage.value !== newProgress) {
    progressPercentage.value = newProgress
  }
}

// Format event date for display
const formatEventDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  })
}

// Format time ago for expired events
const formatTimeAgo = (dateStr) => {
  const date = new Date(dateStr)
  const now = new Date()
  const difference = now - date
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor(difference / (1000 * 60 * 60))
  const minutes = Math.floor(difference / (1000 * 60))
  
  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  } else {
    return 'just now'
  }
}

// Get human-readable time remaining
const getTimeRemainingText = () => {
  const { days, hours, minutes } = timeLeft.value
  
  if (days > 365) {
    const years = Math.floor(days / 365)
    return `${years} year${years !== 1 ? 's' : ''} remaining`
  } else if (days > 30) {
    const months = Math.floor(days / 30)
    return `${months} month${months !== 1 ? 's' : ''} remaining`
  } else if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} remaining`
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
  } else {
    return 'Less than a minute remaining'
  }
}

// Timer state
let animationFrameId = null
let intervalId = null

// High-frequency update function using requestAnimationFrame
const updateTimer = () => {
  calculateTimeLeft()
  animationFrameId = requestAnimationFrame(updateTimer)
}

// Fallback interval for browsers without requestAnimationFrame support
const startFallbackTimer = () => {
  intervalId = setInterval(calculateTimeLeft, 100) // 100ms for smooth updates
}

// Initialize countdown data immediately for SSR compatibility
calculateTimeLeft()

// Initialize and set up timer
onMounted(() => {
  // Start the continuous timer updates for client-side interactivity
  if (typeof requestAnimationFrame !== 'undefined') {
    updateTimer()
  } else {
    startFallbackTimer()
  }

  onUnmounted(() => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }
    if (intervalId) {
      clearInterval(intervalId)
    }
  })
})
</script>

<style scoped>
.countdown-timer {
  font-variant-numeric: tabular-nums;
}
</style>
