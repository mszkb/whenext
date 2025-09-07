export interface EventItem {
  id?: string
  title: string
  category: string
  unix_timestamp: number
  event_date_iso: string
  [key: string]: any
}

export interface EventFiltersOptions {
  showPassedEvents?: boolean
  defaultSortBy?: 'date' | 'category' | 'name'
  defaultSortDirection?: 'asc' | 'desc'
  filterPassedOnly?: boolean // For history page
}

export const useEventFilters = (events: Ref<EventItem[]>, options: EventFiltersOptions = {}) => {
  const {
    showPassedEvents: initialShowPassedEvents = false,
    defaultSortBy = 'date',
    defaultSortDirection = 'asc',
    filterPassedOnly = false
  } = options

  // Reactive state
  const selectedCategory = ref('all')
  const sortBy = ref<'date' | 'category' | 'name'>(defaultSortBy)
  const sortDirection = ref<'asc' | 'desc'>(defaultSortDirection)
  const showPassedEvents = ref(initialShowPassedEvents)

  // Computed: Extract unique categories from events data
  const availableCategories = computed(() => {
    const categorySet = new Set<string>()

    events.value.forEach(event => {
      if (event.category) {
        const categories = parseCategories(event.category)
        categories.forEach(cat => categorySet.add(cat))
      }
    })

    return Array.from(categorySet).sort()
  })

  // Computed properties
  const filteredEvents = computed(() => {
    let filtered = events.value

    // Filter for passed events only (for history page)
    if (filterPassedOnly) {
      filtered = filtered.filter(event => isEventExpired(event))
    }
    // Filter passed events based on toggle (for main page)
    else if (!showPassedEvents.value) {
      filtered = filtered.filter(event => !isEventExpired(event))
    }

    // Filter by category
    if (selectedCategory.value !== 'all') {
      filtered = filtered.filter(event => {
        const eventCategories = parseCategories(event.category)
        return eventCategories.includes(selectedCategory.value)
      })
    }

    // Sort events
    return filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy.value) {
        case 'date':
          comparison = a.unix_timestamp - b.unix_timestamp
          break
        case 'category':
          const aCategories = parseCategories(a.category)
          const bCategories = parseCategories(b.category)
          const aPrimaryCategory = aCategories[0] || ''
          const bPrimaryCategory = bCategories[0] || ''
          if (aPrimaryCategory !== bPrimaryCategory) {
            comparison = aPrimaryCategory.localeCompare(bPrimaryCategory)
          } else {
            comparison = a.unix_timestamp - b.unix_timestamp
          }
          break
        case 'name':
          if (a.title !== b.title) {
            comparison = a.title.localeCompare(b.title)
          } else {
            comparison = a.unix_timestamp - b.unix_timestamp
          }
          break
        default:
          comparison = a.unix_timestamp - b.unix_timestamp
      }

      // Apply direction
      return sortDirection.value === 'desc' ? -comparison : comparison
    })
  })

  // Get filtered count for category buttons
  const getFilteredCount = (category: string) => {
    let filtered = events.value

    // Apply the same filtering logic as filteredEvents
    if (filterPassedOnly) {
      filtered = filtered.filter(event => isEventExpired(event))
    } else if (!showPassedEvents.value) {
      filtered = filtered.filter(event => !isEventExpired(event))
    }

    if (category === 'all') {
      return filtered.length
    }

    return filtered.filter(event => {
      const eventCategories = parseCategories(event.category)
      return eventCategories.includes(category)
    }).length
  }

  // Utility functions
  const parseCategories = (categoryString: string) => {
    if (!categoryString) return []
    return categoryString.split('/').map(cat => cat.trim())
  }

  const isEventExpired = (event: EventItem) => {
    if (!event || !event.event_date_iso) return false
    return new Date(event.event_date_iso).getTime() <= Date.now()
  }

  const toggleSortDirection = () => {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  }

  // Return reactive state and computed properties
  return {
    // Reactive state
    selectedCategory,
    sortBy,
    sortDirection,
    showPassedEvents,

    // Computed properties
    filteredEvents,
    availableCategories,

    // Methods
    getFilteredCount,
    parseCategories,
    isEventExpired,
    toggleSortDirection
  }
}
