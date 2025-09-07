export const useTimezone = () => {
  // Get initial timezone - use same default for both SSR and client to avoid hydration mismatch
  const getInitialTimezone = () => {
    // Always start with the same default to avoid hydration mismatches
    // The timezone will be updated on client side if there's a stored preference
    return 'America/New_York'
  }

  // Reactive state
  const selectedTimezone = ref(getInitialTimezone())
  const isLoadingTimezone = ref(true) // Start as loading to hide initial switch
  const isAutoDetected = computed(() => {
    if (process.client) {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      const closestTimezone = findClosestTimezone(detected)
      return selectedTimezone.value === closestTimezone
    }
    return false
  })

  // Initialize timezone on client side - check for stored preference or auto-detect
  const initializeTimezone = () => {
    if (process.client) {
      const stored = localStorage.getItem('selectedTimezone')
      if (stored) {
        // Use stored timezone preference
        selectedTimezone.value = stored
      } else {
        // No stored timezone, auto-detect and set
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
        const closestTimezone = findClosestTimezone(detected)
        selectedTimezone.value = closestTimezone
        localStorage.setItem('selectedTimezone', closestTimezone)
      }
      // Mark loading as complete
      isLoadingTimezone.value = false
    }
  }

  // Update stored timezone
  const setTimezone = (timezone: string) => {
    selectedTimezone.value = timezone
    if (process.client) {
      localStorage.setItem('selectedTimezone', timezone)
    }
  }

  // Auto-detect user's timezone
  const autoDetectTimezone = () => {
    if (process.client) {
      const detected = Intl.DateTimeFormat().resolvedOptions().timeZone
      const closestTimezone = findClosestTimezone(detected)
      selectedTimezone.value = closestTimezone
      localStorage.setItem('selectedTimezone', closestTimezone)
    }
  }

  // Get timezone offset in minutes
  const getTimezoneOffset = (timezone: string) => {
    if (process.client) {
      try {
        const now = new Date()
        const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }))
        const targetDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }))
        return Math.round((targetDate.getTime() - utcDate.getTime()) / (1000 * 60))
      } catch (error) {
        console.warn('Error calculating timezone offset:', error)
        return 0
      }
    }
    return 0
  }

  // Format date in selected timezone
  const formatInTimezone = (dateStr: string, timezone: string, options: Intl.DateTimeFormatOptions = {}) => {
    if (process.client) {
      try {
        const date = new Date(dateStr)
        return date.toLocaleString('en-US', {
          timeZone: timezone,
          ...options
        })
      } catch (error) {
        console.warn('Error formatting date in timezone:', error)
        return dateStr
      }
    }
    return dateStr
  }

  // Common timezone options
  const commonTimezones = [
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

  // Mapping of detected timezones to common timezone options
  const timezoneMapping = {
    // Eastern Time variants
    'America/New_York': 'America/New_York',
    'America/Nassau': 'America/New_York',
    'America/Toronto': 'America/New_York',
    'America/Montreal': 'America/New_York',
    'America/Detroit': 'America/New_York',
    'America/Indiana/Indianapolis': 'America/New_York',
    'America/Kentucky/Louisville': 'America/New_York',
    'US/Eastern': 'America/New_York',

    // Central Time variants
    'America/Chicago': 'America/Chicago',
    'America/Winnipeg': 'America/Chicago',
    'America/Rainy_River': 'America/Chicago',
    'America/Rankin_Inlet': 'America/Chicago',
    'America/Resolute': 'America/Chicago',
    'America/Matamoros': 'America/Chicago',
    'America/Monterrey': 'America/Chicago',
    'America/Mexico_City': 'America/Chicago',
    'US/Central': 'America/Chicago',

    // Mountain Time variants
    'America/Denver': 'America/Denver',
    'America/Edmonton': 'America/Denver',
    'America/Cambridge_Bay': 'America/Denver',
    'America/Inuvik': 'America/Denver',
    'America/Yellowknife': 'America/Denver',
    'America/Ojinaga': 'America/Denver',
    'America/Chihuahua': 'America/Denver',
    'US/Mountain': 'America/Denver',

    // Pacific Time variants
    'America/Los_Angeles': 'America/Los_Angeles',
    'America/Vancouver': 'America/Los_Angeles',
    'America/Tijuana': 'America/Los_Angeles',
    'America/Whitehorse': 'America/Los_Angeles',
    'America/Dawson': 'America/Los_Angeles',
    'America/Dawson_Creek': 'America/Los_Angeles',
    'US/Pacific': 'America/Los_Angeles',

    // London variants
    'Europe/London': 'Europe/London',
    'Europe/Guernsey': 'Europe/London',
    'Europe/Isle_of_Man': 'Europe/London',
    'Europe/Jersey': 'Europe/London',
    'Europe/Dublin': 'Europe/London',
    'GB': 'Europe/London',
    'GB-Eire': 'Europe/London',

    // Berlin/Paris variants (Central European)
    'Europe/Berlin': 'Europe/Berlin',
    'Europe/Paris': 'Europe/Paris',
    'Europe/Rome': 'Europe/Berlin',
    'Europe/Madrid': 'Europe/Berlin',
    'Europe/Amsterdam': 'Europe/Berlin',
    'Europe/Brussels': 'Europe/Berlin',
    'Europe/Zurich': 'Europe/Berlin',
    'Europe/Vienna': 'Europe/Berlin',
    'Europe/Prague': 'Europe/Berlin',
    'Europe/Warsaw': 'Europe/Berlin',

    // Tokyo variants
    'Asia/Tokyo': 'Asia/Tokyo',
    'Asia/Seoul': 'Asia/Tokyo',
    'Asia/Pyongyang': 'Asia/Tokyo',
    'Japan': 'Asia/Tokyo',

    // Shanghai variants
    'Asia/Shanghai': 'Asia/Shanghai',
    'Asia/Hong_Kong': 'Asia/Shanghai',
    'Asia/Macau': 'Asia/Shanghai',
    'Asia/Taipei': 'Asia/Shanghai',
    'Asia/Singapore': 'Asia/Shanghai',
    'Asia/Manila': 'Asia/Shanghai',
    'Asia/Kuala_Lumpur': 'Asia/Shanghai',
    'Asia/Jakarta': 'Asia/Shanghai',
    'Asia/Bangkok': 'Asia/Shanghai',
    'PRC': 'Asia/Shanghai',
    'Hongkong': 'Asia/Shanghai',

    // Sydney variants
    'Australia/Sydney': 'Australia/Sydney',
    'Australia/Melbourne': 'Australia/Sydney',
    'Australia/Brisbane': 'Australia/Sydney',
    'Australia/Perth': 'Australia/Sydney',
    'Australia/Adelaide': 'Australia/Sydney',
    'Australia/Darwin': 'Australia/Sydney',
    'Australia/Hobart': 'Australia/Sydney',
    'Australia/Lindeman': 'Australia/Sydney',
    'Australia/Lord_Howe': 'Australia/Sydney',
    'Australia/Canberra': 'Australia/Sydney',

    // Auckland variants
    'Pacific/Auckland': 'Pacific/Auckland',
    'Pacific/Fiji': 'Pacific/Auckland',
    'Pacific/Guam': 'Pacific/Auckland',
    'Pacific/Saipan': 'Pacific/Auckland',
    'Pacific/Port_Moresby': 'Pacific/Auckland',
    'Pacific/Noumea': 'Pacific/Auckland',

    // UTC and other fallbacks
    'UTC': 'UTC',
    'GMT': 'UTC',
    'Etc/UTC': 'UTC'
  }

  // Find closest matching timezone from our list
  const findClosestTimezone = (detectedTimezone: string): string => {
    // First, try direct mapping
    if (detectedTimezone in timezoneMapping) {
      return timezoneMapping[detectedTimezone as keyof typeof timezoneMapping]
    }

    // Try region-based matching (e.g., "America/New_York" -> "America/New_York")
    const region = detectedTimezone.split('/')[0]
    for (const [key, value] of Object.entries(timezoneMapping)) {
      if (key.startsWith(region + '/')) {
        return value
      }
    }

    // Try to find by offset comparison (as a last resort)
    if (process.client) {
      try {
        const detectedOffset = getTimezoneOffset(detectedTimezone)
        let closestMatch = 'UTC'
        let smallestDifference = Infinity

        for (const tz of commonTimezones) {
          if (tz.value !== 'UTC') {
            const tzOffset = getTimezoneOffset(tz.value)
            const difference = Math.abs(detectedOffset - tzOffset)
            if (difference < smallestDifference) {
              smallestDifference = difference
              closestMatch = tz.value
            }
          }
        }

        if (smallestDifference < 120) { // Within 2 hours
          return closestMatch
        }
      } catch (error) {
        console.warn('Error finding closest timezone by offset:', error)
      }
    }

    // Fallback to UTC
    return 'UTC'
  }

  return {
    selectedTimezone,
    isLoadingTimezone,
    isAutoDetected,
    setTimezone,
    autoDetectTimezone,
    getTimezoneOffset,
    formatInTimezone,
    commonTimezones,
    findClosestTimezone,
    initializeTimezone
  }
}
