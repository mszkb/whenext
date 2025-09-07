import ical, { ICalAlarmType, ICalAttendeeRole, ICalAttendeeStatus } from 'ical-generator'
import type { CalendarEvent, CalendarFeedOptions } from '~/types/calendar'
import type { CalendarCategory } from '~/composables/useCalendarLinks'

export class iCalGenerator {
  private baseUrl: string

  constructor(baseUrl: string = 'https://www.whenext.de') {
    this.baseUrl = baseUrl
  }

  /**
   * Generate iCal feed for a specific category or all events
   */
  generateCalendarFeed(
    events: CalendarEvent[], 
    category: CalendarCategory = 'alle',
    options: CalendarFeedOptions = {}
  ): string {
    // Create calendar instance
    const calendar = ical({
      name: this.getCalendarName(category),
      description: this.getCalendarDescription(category),
      timezone: 'Europe/Berlin',
      source: `${this.baseUrl}/api/calendar/${category}.ics`,
      url: `${this.baseUrl}/api/calendar/${category}.ics`,
      prodId: {
        company: 'Whenext',
        product: 'Multi-Countdown Calendar',
        language: 'EN'
      },
      method: 'PUBLISH',
      ttl: 86400 // 24 hours cache
    })

    // Filter events based on category and options
    const filteredEvents = this.filterEvents(events, category, options)

    // Convert events to iCal format
    filteredEvents.forEach(event => {
      this.addEventToCalendar(calendar, event, options)
    })

    return calendar.toString()
  }

  /**
   * Filter events based on category and options
   */
  private filterEvents(
    events: CalendarEvent[], 
    category: CalendarCategory, 
    options: CalendarFeedOptions
  ): CalendarEvent[] {
    let filtered = [...events]

    // Filter by category
    if (category !== 'alle') {
      filtered = filtered.filter(event => {
        const categories = this.parseCategories(event.category)
        return categories.includes(category)
      })
    }

    // Filter by tags if specified
    if (options.tags && options.tags.length > 0) {
      filtered = filtered.filter(event => {
        if (!event.tags) return false
        return options.tags!.some(tag => event.tags!.includes(tag))
      })
    }

    // Filter by days ahead if specified
    if (options.days && options.days > 0) {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() + options.days)
      
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.event_date_iso)
        return eventDate <= cutoffDate && eventDate >= new Date()
      })
    }

    // Only include future events for calendar feeds
    const now = new Date()
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.event_date_iso)
      return eventDate > now
    })

    return filtered
  }

  /**
   * Add a single event to the calendar
   */
  private addEventToCalendar(
    calendar: any, 
    event: CalendarEvent, 
    options: CalendarFeedOptions
  ): void {
    const eventDate = new Date(event.event_date_iso)
    const eventId = event.id || this.generateEventId(event)
    const eventUrl = `${this.baseUrl}/event/${eventId}`

    const calEvent = calendar.createEvent({
      id: eventId,
      start: eventDate,
      end: new Date(eventDate.getTime() + (2 * 60 * 60 * 1000)), // Default 2h duration
      timestamp: new Date(),
      summary: event.title,
      description: this.buildEventDescription(event),
      location: event.location || this.extractLocationFromDescription(event),
      url: event.source_url || eventUrl,
      categories: this.parseCategories(event.category),
      status: 'CONFIRMED',
      sequence: 0,
      transparency: 'OPAQUE'
    })

    // Add custom properties
    if (event.confidence) {
      calEvent.x('X-WHENEXT-CONFIDENCE', event.confidence.toString())
    }
    
    if (event.source) {
      calEvent.x('X-WHENEXT-SOURCE', event.source)
    }

    // Add reminders/alarms
    this.addReminders(calEvent, eventDate)

    // Add organizer info
    calEvent.organizer({
      name: event.source || 'Whenext',
      email: 'noreply@whenext.app'
    })
  }

  /**
   * Build comprehensive event description
   */
  private buildEventDescription(event: CalendarEvent): string {
    const parts: string[] = []

    if (event.description) {
      parts.push(event.description)
    }

    if (event.notes) {
      parts.push(`\nNotes: ${event.notes}`)
    }

    if (event.confidence) {
      const confidencePercent = Math.round(event.confidence * 100)
      parts.push(`\nConfidence: ${confidencePercent}%`)
    }

    if (event.source) {
      parts.push(`\nSource: ${event.source}`)
    }

    if (event.source_url) {
      parts.push(`\nMore info: ${event.source_url}`)
    }

    parts.push(`\n\n📅 Tracked by Whenext - https://www.whenext.de`)

    return parts.join('')
  }

  /**
   * Add smart reminders based on event timing
   */
  private addReminders(calEvent: any, eventDate: Date): void {
    const now = new Date()
    const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    // Smart reminder timing based on how far away the event is
    if (daysUntilEvent > 7) {
      // For events more than a week away: remind 1 week before, 1 day before, 1 hour before
      calEvent.createAlarm({
        type: ICalAlarmType.display,
        trigger: 7 * 24 * 60 * 60, // 1 week before (in seconds)
        description: `${calEvent.summary()} is in 1 week`
      })
    }

    if (daysUntilEvent > 1) {
      // Remind 1 day before
      calEvent.createAlarm({
        type: ICalAlarmType.display,
        trigger: 24 * 60 * 60, // 1 day before
        description: `${calEvent.summary()} is tomorrow`
      })
    }

    // Always add 1 hour reminder for events that are more than 1 hour away
    if (daysUntilEvent >= 0) {
      calEvent.createAlarm({
        type: ICalAlarmType.display,
        trigger: 60 * 60, // 1 hour before
        description: `${calEvent.summary()} starts in 1 hour`
      })
    }
  }

  /**
   * Parse category string that might contain multiple categories separated by "/"
   */
  private parseCategories(categoryString: string): string[] {
    if (!categoryString) return []
    return categoryString.split('/').map(cat => cat.trim())
  }

  /**
   * Extract location from event description or notes if not explicitly set
   */
  private extractLocationFromDescription(event: CalendarEvent): string | undefined {
    const text = `${event.description || ''} ${event.notes || ''}`.toLowerCase()
    
    // Simple location extraction patterns
    const locationPatterns = [
      /in\s+([a-z\s]+(?:stadt|city|vegas|francisco|angeles|york))/i,
      /(?:@|at)\s+([a-z\s]+(?:arena|center|hall|venue|convention))/i,
      /(?:berlin|vienna|wien|hamburg|munich|münchen|cologne|köln|frankfurt)/i
    ]

    for (const pattern of locationPatterns) {
      const match = text.match(pattern)
      if (match) {
        return match[1]?.trim() || match[0]?.trim()
      }
    }

    return undefined
  }

  /**
   * Generate a unique event ID based on event data
   */
  private generateEventId(event: CalendarEvent): string {
    const base = `${event.title}-${event.event_date_iso}`.replace(/[^a-zA-Z0-9]/g, '-')
    return base.toLowerCase()
  }

  /**
   * Get calendar name based on category
   */
  private getCalendarName(category: CalendarCategory): string {
    const categoryNames: Record<CalendarCategory, string> = {
      'alle': 'Whenext - All Events',
      'tech': 'Whenext - Tech Events',
      'gaming': 'Whenext - Gaming Events', 
      'popkultur': 'Whenext - Pop Culture Events',
      'finanzen': 'Whenext - Finance Events',
      'entertainment': 'Whenext - Entertainment Events',
      'AI': 'Whenext - AI Events',
      'streaming': 'Whenext - Streaming Events',
      'e-sports': 'Whenext - E-Sports Events'
    }

    return categoryNames[category] || `Whenext - ${category} Events`
  }

  /**
   * Get calendar description based on category
   */
  private getCalendarDescription(category: CalendarCategory): string {
    const descriptions: Record<CalendarCategory, string> = {
      'alle': 'All upcoming events tracked by Whenext - never miss what\'s next in tech, gaming, and entertainment.',
      'tech': 'Upcoming technology events, conferences, and product launches tracked by Whenext.',
      'gaming': 'Gaming events, releases, tournaments, and conventions tracked by Whenext.',
      'popkultur': 'Pop culture events, entertainment releases, and cultural happenings tracked by Whenext.',
      'finanzen': 'Financial events, market announcements, and economic conferences tracked by Whenext.',
      'entertainment': 'Entertainment events, shows, and cultural happenings tracked by Whenext.',
      'AI': 'Artificial Intelligence events, conferences, and announcements tracked by Whenext.',
      'streaming': 'Streaming events, shows, and platform launches tracked by Whenext.',
      'e-sports': 'E-sports tournaments, gaming competitions, and esports events tracked by Whenext.'
    }

    return descriptions[category] || `${category} events tracked by Whenext - never miss what's next.`
  }

  /**
   * Validate calendar category
   */
  static isValidCategory(category: string): category is CalendarCategory {
    const validCategories: CalendarCategory[] = [
      'alle', 'tech', 'gaming', 'popkultur', 'finanzen', 
      'entertainment', 'AI', 'streaming', 'e-sports'
    ]
    return validCategories.includes(category as CalendarCategory)
  }

  /**
   * Get available categories for calendar feeds
   */
  static getAvailableCategories(): CalendarCategory[] {
    return ['alle', 'tech', 'gaming', 'popkultur', 'finanzen', 'entertainment', 'AI', 'streaming', 'e-sports']
  }
}

// Utility function to create iCal generator instance
export function createiCalGenerator(baseUrl?: string): iCalGenerator {
  return new iCalGenerator(baseUrl)
}

// Helper function for quick calendar generation
export function generateQuickCalendar(
  events: CalendarEvent[], 
  category: CalendarCategory = 'alle',
  baseUrl: string = 'https://www.whenext.de'
): string {
  const generator = new iCalGenerator(baseUrl)
  return generator.generateCalendarFeed(events, category)
}