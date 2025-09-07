export type CalendarCategory = 
  | 'alle' 
  | 'tech' 
  | 'gaming' 
  | 'popkultur' 
  | 'finanzen'
  | 'entertainment'
  | 'AI'
  | 'streaming'
  | 'e-sports'

export interface CalendarLinkOptions {
  category: CalendarCategory
  tags?: string[]
  days?: number
  timezone?: string
}

export interface CalendarLinks {
  webcalUrl: string
  httpsUrl: string
  feedUrl: string
}

/**
 * Composable for generating calendar subscription links
 */
export const useCalendarLinks = () => {
  const config = useRuntimeConfig()
  
  /**
   * Get base URL for the application
   */
  const getBaseUrl = (): string => {
    return config.public.siteUrl || 'https://www.whenext.de'
  }

  /**
   * Generate calendar subscription links for a specific category
   */
  const generateCalendarLinks = (
    category: CalendarCategory = 'alle',
    options?: Omit<CalendarLinkOptions, 'category'>
  ): CalendarLinks => {
    const baseUrl = getBaseUrl()
    let feedPath = `/api/calendar/${category}.ics`
    
    // Add query parameters if provided
    const queryParams = new URLSearchParams()
    
    if (options?.tags && options.tags.length > 0) {
      queryParams.append('tags', options.tags.join(','))
    }
    
    if (options?.days && options.days > 0) {
      queryParams.append('days', options.days.toString())
    }
    
    if (options?.timezone) {
      queryParams.append('timezone', options.timezone)
    }
    
    // Append query string if we have parameters
    if (queryParams.toString()) {
      feedPath += `?${queryParams.toString()}`
    }
    
    const httpsUrl = `${baseUrl}${feedPath}`
    const webcalUrl = `webcal://${baseUrl.replace(/^https?:\/\//, '')}${feedPath}`
    
    return {
      webcalUrl,
      httpsUrl,
      feedUrl: httpsUrl
    }
  }

  /**
   * Generate links for all available categories
   */
  const generateAllCategoryLinks = (
    options?: Omit<CalendarLinkOptions, 'category'>
  ): Record<CalendarCategory, CalendarLinks> => {
    const categories: CalendarCategory[] = [
      'alle', 'tech', 'gaming', 'popkultur', 'finanzen', 
      'entertainment', 'AI', 'streaming', 'e-sports'
    ]
    
    const result = {} as Record<CalendarCategory, CalendarLinks>
    
    categories.forEach(category => {
      result[category] = generateCalendarLinks(category, options)
    })
    
    return result
  }

  /**
   * Validate if a string is a valid calendar category
   */
  const isValidCategory = (category: string): category is CalendarCategory => {
    const validCategories: CalendarCategory[] = [
      'alle', 'tech', 'gaming', 'popkultur', 'finanzen', 
      'entertainment', 'AI', 'streaming', 'e-sports'
    ]
    return validCategories.includes(category as CalendarCategory)
  }

  /**
   * Get human-readable name for a category
   */
  const getCategoryDisplayName = (category: CalendarCategory): string => {
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
    
    return names[category] || `${category} Events`
  }

  /**
   * Get all available categories with their display names
   */
  const getAvailableCategories = (): Array<{ value: CalendarCategory; label: string }> => {
    const categories: CalendarCategory[] = [
      'alle', 'tech', 'gaming', 'popkultur', 'finanzen', 
      'entertainment', 'AI', 'streaming', 'e-sports'
    ]
    
    return categories.map(category => ({
      value: category,
      label: getCategoryDisplayName(category)
    }))
  }

  /**
   * Create a shareable calendar subscription URL for social media
   */
  const createShareableUrl = (category: CalendarCategory): string => {
    const baseUrl = getBaseUrl()
    return `${baseUrl}/?calendar=${category}`
  }

  /**
   * Generate QR code URL for calendar subscription (using external service)
   */
  const generateQRCodeUrl = (category: CalendarCategory): string => {
    const links = generateCalendarLinks(category)
    const qrData = encodeURIComponent(links.webcalUrl)
    
    // Using QR Server API (you could replace with your preferred service)
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrData}`
  }

  /**
   * Copy calendar link to clipboard with error handling
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
        return true
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = text
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        const success = document.execCommand('copy')
        document.body.removeChild(textArea)
        return success
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  }

  /**
   * Get calendar app specific instructions
   */
  const getCalendarAppInstructions = () => {
    return [
      {
        name: 'Apple Calendar (iOS/macOS)',
        icon: 'simple-icons:apple',
        platforms: ['ios', 'desktop'] as const,
        instructions: [
          'Tap "Subscribe in Calendar App" or copy the WebCal URL',
          'Calendar app will open automatically',
          'Confirm subscription in the popup',
          'Events will sync automatically'
        ]
      },
      {
        name: 'Google Calendar',
        icon: 'simple-icons:google',
        platforms: ['web', 'android'] as const,
        instructions: [
          'Copy the HTTPS URL above',
          'Go to Google Calendar → Settings → Add Calendar',
          'Choose "From URL" and paste the link',
          'Click "Add Calendar" to confirm'
        ]
      },
      {
        name: 'Microsoft Outlook',
        icon: 'simple-icons:microsoftoutlook',
        platforms: ['web', 'desktop', 'ios', 'android'] as const,
        instructions: [
          'Copy the HTTPS URL above',
          'In Outlook, go to Calendar → Add Calendar',
          'Choose "Subscribe from web" and paste URL',
          'Name your calendar and click Subscribe'
        ]
      },
      {
        name: 'Thunderbird',
        icon: 'simple-icons:thunderbird',
        platforms: ['desktop'] as const,
        instructions: [
          'Right-click on calendar list → New Calendar',
          'Choose "On the Network" → iCalendar (ICS)',
          'Paste the HTTPS URL and click Next',
          'Set refresh interval and complete setup'
        ]
      }
    ]
  }

  return {
    // Core functions
    generateCalendarLinks,
    generateAllCategoryLinks,
    
    // Utility functions
    isValidCategory,
    getCategoryDisplayName,
    getAvailableCategories,
    createShareableUrl,
    generateQRCodeUrl,
    copyToClipboard,
    getCalendarAppInstructions,
    
    // Computed values
    baseUrl: computed(() => getBaseUrl())
  }
}