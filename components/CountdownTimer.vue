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

// Calculate time remaining
const calculateTimeLeft = () => {
  const now = new Date().getTime()
  const eventTime = new Date(props.event.event_date_iso).getTime()
  const difference = eventTime - now

  if (difference <= 0) {
    isExpired.value = true
    timeLeft.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  isExpired.value = false
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24))
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((difference % (1000 * 60)) / 1000)

  timeLeft.value = { days, hours, minutes, seconds }

  // Calculate progress (assuming events are tracked from when they're added)
  // For demo purposes, we'll use a 365-day window
  const totalDuration = 365 * 24 * 60 * 60 * 1000 // 1 year in milliseconds
  const elapsed = totalDuration - difference
  progressPercentage.value = Math.max(0, Math.min(100, (elapsed / totalDuration) * 100))
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

// Initialize and set up interval
onMounted(() => {
  calculateTimeLeft()
  const interval = setInterval(calculateTimeLeft, 1000)
  
  onUnmounted(() => {
    clearInterval(interval)
  })
})
</script>

<style scoped>
.countdown-timer {
  font-variant-numeric: tabular-nums;
}
</style>
