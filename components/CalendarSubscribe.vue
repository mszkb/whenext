<template>
  <div class="calendar-subscribe">
    <!-- Subscribe Button -->
    <button
      @click="isModalOpen = true"
      class="filter-button flex items-center"
      :title="`Subscribe to ${categoryName} calendar`"
    >
      <Icon name="heroicons:calendar-days" class="h-4 w-4 mr-2" />
      Subscribe to Calendar
    </button>

    <!-- Modal -->
    <UModal v-model="isModalOpen" :ui="{ width: 'sm:max-w-2xl' }">
      <div class="p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Subscribe to {{ categoryName }} Calendar
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Stay updated with upcoming events directly in your calendar app
            </p>
          </div>
          <button
            @click="isModalOpen = false"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Icon name="heroicons:x-mark" class="h-6 w-6" />
          </button>
        </div>

        <!-- Calendar Links -->
        <div class="space-y-4 mb-6">
          <!-- One-Click Subscribe -->
          <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-2 flex items-center">
              <Icon name="heroicons:bolt" class="h-5 w-5 mr-2 text-blue-600" />
              One-Click Subscribe
            </h4>
            <p class="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Click the button below to automatically open your default calendar app
            </p>
            <button
              @click="handleOneClickSubscribe"
              :class="[
                'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                subscribeSuccess 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white',
                { 'opacity-75 cursor-not-allowed': isSubscribing }
              ]"
              :disabled="isSubscribing"
            >
              <Icon 
                :name="subscribeSuccess ? 'heroicons:check' : isSubscribing ? 'heroicons:arrow-path' : 'heroicons:plus'" 
                :class="['h-4 w-4 mr-2', { 'animate-spin': isSubscribing }]" 
              />
              {{ 
                subscribeSuccess 
                  ? 'Calendar Opened!' 
                  : isSubscribing 
                    ? 'Opening Calendar...' 
                    : 'Subscribe in Calendar App' 
              }}
            </button>
            
            <!-- Success Message -->
            <div v-if="subscribeSuccess" class="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p class="text-sm text-green-700 dark:text-green-300">
                ✅ Your calendar app should have opened. If not, please use the manual links below.
              </p>
            </div>
          </div>

          <!-- Manual Links -->
          <div class="space-y-3" data-manual-links>
            <h4 class="font-medium text-gray-900 dark:text-gray-100 flex items-center">
              <Icon name="heroicons:link" class="h-5 w-5 mr-2 text-gray-600" />
              Copy Links Manually
            </h4>
            
            <!-- WebCal URL -->
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WebCal URL (Recommended)
                  </label>
                  <code class="block text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                    {{ webcalUrl }}
                  </code>
                </div>
                <button
                  @click="copyToClipboard(webcalUrl, 'webcal')"
                  class="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  :title="copiedStates.webcal ? 'Copied!' : 'Copy WebCal URL'"
                >
                  <Icon 
                    :name="copiedStates.webcal ? 'heroicons:check' : 'heroicons:clipboard-document'" 
                    class="h-4 w-4"
                    :class="{ 'text-green-600': copiedStates.webcal }"
                  />
                </button>
              </div>
            </div>

            <!-- HTTPS URL -->
            <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    HTTPS URL (Alternative)
                  </label>
                  <code class="block text-sm text-gray-600 dark:text-gray-400 truncate font-mono">
                    {{ httpsUrl }}
                  </code>
                </div>
                <button
                  @click="copyToClipboard(httpsUrl, 'https')"
                  class="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  :title="copiedStates.https ? 'Copied!' : 'Copy HTTPS URL'"
                >
                  <Icon 
                    :name="copiedStates.https ? 'heroicons:check' : 'heroicons:clipboard-document'" 
                    class="h-4 w-4"
                    :class="{ 'text-green-600': copiedStates.https }"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Calendar App Instructions -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 class="font-medium text-gray-900 dark:text-gray-100 mb-4">
            Setup Instructions by Calendar App
          </h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              v-for="app in calendarApps" 
              :key="app.name"
              class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div class="flex items-center mb-2">
                <Icon :name="app.icon" class="h-5 w-5 mr-2" />
                <span class="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {{ app.name }}
                </span>
              </div>
              <ul class="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <li v-for="(instruction, index) in app.instructions" :key="index" class="flex items-start">
                  <span class="inline-block w-4 text-center">{{ index + 1 }}.</span>
                  <span>{{ instruction }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h5 class="font-medium text-gray-900 dark:text-gray-100 mb-2">
            📅 What you'll get:
          </h5>
          <ul class="text-sm text-gray-600 dark:text-gray-300 space-y-1">
            <li>• Automatic updates when new events are added</li>
            <li>• Smart reminders (1 week, 1 day, and 1 hour before events)</li>
            <li>• Direct links to event sources and details</li>
            <li>• Confidence scores and additional event metadata</li>
            <li>• Works with all major calendar applications</li>
          </ul>
        </div>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  category?: 'alle' | 'tech' | 'gaming' | 'popkultur' | 'finanzen' | 'entertainment' | 'AI' | 'streaming' | 'e-sports'
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  category: 'alle',
  compact: false
})

// Composables
const config = useRuntimeConfig()

// Reactive state
const isModalOpen = ref(false)
const isSubscribing = ref(false)
const subscribeSuccess = ref(false)
const copiedStates = ref({
  webcal: false,
  https: false
})

// Computed properties
const categoryName = computed(() => {
  const names = {
    'alle': 'All Events',
    'tech': 'Tech Events',
    'gaming': 'Gaming Events', 
    'popkultur': 'Pop Culture Events',
    'finanzen': 'Finance Events',
    'entertainment': 'Entertainment Events',
    'AI': 'AI Events',
    'streaming': 'Streaming Events',
    'e-sports': 'E-Sports Events'
  } as const
  return names[props.category] || `${props.category} Events`
})

const baseUrl = computed(() => config.public.siteUrl || 'https://www.whenext.de')

const httpsUrl = computed(() => 
  `${baseUrl.value}/api/calendar/${props.category}.ics`
)

const webcalUrl = computed(() => 
  `webcal://${baseUrl.value.replace(/^https?:\/\//, '')}/api/calendar/${props.category}.ics`
)

// Calendar app instructions
const calendarApps = computed(() => [
  {
    name: 'Apple Calendar (iOS/macOS)',
    icon: 'simple-icons:apple',
    instructions: [
      'Tap "Subscribe in Calendar App" or copy the WebCal URL',
      'Calendar app will open automatically',
      'Confirm subscription in the popup'
    ]
  },
  {
    name: 'Google Calendar',
    icon: 'simple-icons:google',
    instructions: [
      'Copy the HTTPS URL above',
      'Go to Google Calendar → Settings → Add Calendar',
      'Choose "From URL" and paste the link'
    ]
  },
  {
    name: 'Outlook',
    icon: 'simple-icons:microsoftoutlook',
    instructions: [
      'Copy the HTTPS URL above',
      'In Outlook, go to Calendar → Add Calendar',
      'Choose "Subscribe from web" and paste URL'
    ]
  },
  {
    name: 'Thunderbird',
    icon: 'simple-icons:thunderbird',
    instructions: [
      'Right-click on calendar list → New Calendar',
      'Choose "On the Network" → iCalendar (ICS)',
      'Paste the HTTPS URL and click Next'
    ]
  }
])

// Methods
const handleOneClickSubscribe = async () => {
  if (isSubscribing.value) return
  
  isSubscribing.value = true
  
  try {
    // Track the subscription attempt
    trackSubscription('one-click-webcal')
    
    // Get the webcal URL
    const webcalLink = webcalUrl.value
    
    // Detect platform for better user experience
    const platform = detectPlatform()
    
    if (platform === 'ios' || platform === 'macos') {
      // For iOS/macOS, webcal:// URLs work directly
      window.location.href = webcalLink
    } else if (platform === 'android') {
      // For Android, try Google Calendar integration first
      const googleCalendarUrl = `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(httpsUrl.value)}`
      
      // Try to open Google Calendar, fallback to webcal
      const popup = window.open(googleCalendarUrl, '_blank', 'width=800,height=600')
      
      // If popup is blocked or doesn't work, fallback to webcal
      if (!popup || popup.closed) {
        window.location.href = webcalLink
      }
      
      // Close popup after a short delay if it opened successfully
      setTimeout(() => {
        if (popup && !popup.closed) {
          popup.close()
        }
      }, 3000)
      
    } else {
      // For desktop browsers, try webcal first
      try {
        // Create a hidden link and click it to trigger the webcal handler
        const link = document.createElement('a')
        link.href = webcalLink
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // If webcal doesn't work (no handler registered), show fallback after delay
        setTimeout(() => {
          showFallbackOptions()
        }, 2000)
        
      } catch (error) {
        console.error('Webcal subscription failed:', error)
        showFallbackOptions()
      }
    }
    
    // Show success message after a short delay
    setTimeout(() => {
      isSubscribing.value = false
      subscribeSuccess.value = true
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        subscribeSuccess.value = false
      }, 5000)
    }, 1500)
    
  } catch (error) {
    console.error('One-click subscribe failed:', error)
    isSubscribing.value = false
    showFallbackOptions()
  }
}

const detectPlatform = (): string => {
  const userAgent = navigator.userAgent.toLowerCase()
  
  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios'
  } else if (/android/.test(userAgent)) {
    return 'android'
  } else if (/mac/.test(userAgent) && !(/iphone|ipad|ipod/.test(userAgent))) {
    return 'macos'
  } else if (/win/.test(userAgent)) {
    return 'windows'
  } else if (/linux/.test(userAgent)) {
    return 'linux'
  }
  return 'unknown'
}

const showFallbackOptions = () => {
  // Show a toast or notification with manual instructions
  const platform = detectPlatform()
  let message = 'Calendar app not found. Please copy the link below manually.'
  
  if (platform === 'windows') {
    message = 'Please copy the HTTPS URL and add it to your Outlook calendar.'
  } else if (platform === 'android') {
    message = 'Please copy the HTTPS URL and add it to Google Calendar.'
  }
  
  console.log('Fallback:', message)
  
  // Auto-scroll to manual links section
  const manualSection = document.querySelector('[data-manual-links]')
  if (manualSection) {
    manualSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const copyToClipboard = async (text: string, type: 'webcal' | 'https') => {
  try {
    await navigator.clipboard.writeText(text)
    copiedStates.value[type] = true
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      copiedStates.value[type] = false
    }, 2000)
    
    // Track copy action
    trackSubscription(`copy-${type}`)
    
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
  }
}

const trackSubscription = (method: string) => {
  // Track calendar subscription attempts
  // This could be extended with analytics
  console.log(`Calendar subscription: ${props.category} via ${method}`)
  
  // Future: Send to analytics
  // gtag('event', 'calendar_subscribe', {
  //   category: props.category,
  //   method: method
  // })
}

// Clean up states when modal closes
watch(isModalOpen, (isOpen: boolean) => {
  if (!isOpen) {
    copiedStates.value.webcal = false
    copiedStates.value.https = false
    subscribeSuccess.value = false
    isSubscribing.value = false
  }
})
</script>

<style scoped>
/* Ensure proper text wrapping in code elements */
code {
  word-break: break-all;
  hyphens: auto;
}

/* Animation for copied state */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>