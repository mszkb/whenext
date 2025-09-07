import { readFileSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    // Get category from route params
    const category = getRouterParam(event, 'category')
    
    // Valid categories
    const validCategories = ['alle', 'tech', 'gaming', 'popkultur', 'finanzen', 'entertainment', 'AI', 'streaming', 'e-sports']
    
    // Remove .ics extension if present
    const cleanCategory = category?.replace('.ics', '')
    
    // Validate category
    if (!cleanCategory || !validCategories.includes(cleanCategory)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid category. Available categories: ${validCategories.join(', ')}. Received: ${cleanCategory}`
      })
    }

    // Load events data
    let events: any[]
    try {
      // Load from data/events.json
      const dataPath = join(process.cwd(), 'data', 'events.json')
      const eventsData = readFileSync(dataPath, 'utf-8')
      events = JSON.parse(eventsData)
    } catch (dataError) {
      console.error('Failed to load events data:', dataError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to load events data'
      })
    }

    // Simple iCal generation for testing
    const filteredEvents = cleanCategory === 'alle' ? events : events.filter(event => {
      const categories = event.category?.split('/').map((cat: string) => cat.trim())
      return categories?.includes(cleanCategory)
    })

    // Basic iCal format
    const icalLines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Whenext//Multi-Countdown Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:Whenext - ${cleanCategory === 'alle' ? 'All Events' : cleanCategory + ' Events'}`,
      `X-WR-CALDESC:Track upcoming events in ${cleanCategory === 'alle' ? 'tech, gaming, and entertainment' : cleanCategory}`,
      'X-WR-TIMEZONE:Europe/Berlin',
    ]

    // Add events
    filteredEvents.slice(0, 10).forEach((event: any) => {
      if (event.event_date_iso) {
        const eventDate = new Date(event.event_date_iso)
        const now = new Date()
        
        // Only include future events
        if (eventDate > now) {
          const eventId = `${event.title.replace(/[^a-zA-Z0-9]/g, '')}-${eventDate.getTime()}`
          const startTime = eventDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
          const endTime = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
          
          icalLines.push(
            'BEGIN:VEVENT',
            `UID:${eventId}@whenext.de`,
            `DTSTART:${startTime}`,
            `DTEND:${endTime}`,
            `SUMMARY:${event.title}`,
            `DESCRIPTION:${event.description || event.notes || ''}\\n\\nSource: ${event.source || ''}\\n\\nTracked by Whenext - https://www.whenext.de`,
            'STATUS:CONFIRMED',
            'TRANSP:OPAQUE',
            `CREATED:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            `LAST-MODIFIED:${now.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
            'END:VEVENT'
          )
        }
      }
    })

    icalLines.push('END:VCALENDAR')
    const icalData = icalLines.join('\r\n')

    // Set proper headers for iCal response
    setHeader(event, 'Content-Type', 'text/calendar; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; filename="${cleanCategory}-calendar.ics"`)
    setHeader(event, 'Cache-Control', 'public, max-age=3600')
    setHeader(event, 'X-Content-Type-Options', 'nosniff')
    setHeader(event, 'Access-Control-Allow-Origin', '*')

    return icalData

  } catch (error) {
    console.error('Calendar feed error:', error)
    
    // If it's already a proper error, re-throw it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Otherwise create a generic error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error while generating calendar feed'
    })
  }
})