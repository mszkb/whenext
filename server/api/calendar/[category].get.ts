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
      // Try multiple possible paths for the events data
      let eventsData: string
      let dataPath: string
      
      // In production, try the public folder first
      const publicPath = join(process.cwd(), 'public', 'data', 'events.json')
      const dataFolderPath = join(process.cwd(), 'data', 'events.json')
      const nitroPath = join(process.cwd(), '.output', 'public', 'data', 'events.json')
      
      try {
        eventsData = readFileSync(publicPath, 'utf-8')
        dataPath = publicPath
      } catch {
        try {
          eventsData = readFileSync(dataFolderPath, 'utf-8')
          dataPath = dataFolderPath
        } catch {
          try {
            eventsData = readFileSync(nitroPath, 'utf-8')
            dataPath = nitroPath
          } catch {
            // If all file paths fail, try to fetch via HTTP as last resort
            try {
              const config = useRuntimeConfig()
              const baseUrl = config.public.siteUrl || 'https://www.whenext.de'
              const response = await fetch(`${baseUrl}/data/events.json`)
              if (response.ok) {
                const fetchedData = await response.json()
                events = fetchedData
                console.log('Loaded events data via HTTP fetch')
              } else {
                throw new Error(`HTTP fetch failed with status: ${response.status}`)
              }
            } catch (fetchError) {
              // Final fallback: try to import the data directly
              const eventsModule = await import('~/data/events.json').catch(() => null)
              if (eventsModule && eventsModule.default) {
                events = eventsModule.default
                console.log('Loaded events data via import')
              } else {
                throw new Error('No events data found in any location')
              }
            }
          }
        }
      }
      
      if (!events && eventsData) {
        events = JSON.parse(eventsData)
        console.log(`Loaded events data from: ${dataPath}`)
      }
      
      if (!events || !Array.isArray(events)) {
        throw new Error('Events data is not a valid array')
      }
      
    } catch (dataError) {
      console.error('Failed to load events data:', dataError)
      console.error('Current working directory:', process.cwd())
      console.error('Attempted paths:', [
        join(process.cwd(), 'public', 'data', 'events.json'),
        join(process.cwd(), 'data', 'events.json'),
        join(process.cwd(), '.output', 'public', 'data', 'events.json')
      ])
      
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to load events data: ${dataError.message || dataError}`
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