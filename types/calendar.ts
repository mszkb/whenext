export interface CalendarEvent {
  id?: string
  title: string
  description?: string
  source: string
  source_url: string
  event_date_iso: string
  timezone?: string
  unix_timestamp: number
  confidence?: number
  category: string
  notes?: string
  icon?: string
  logo?: string
  logo_url?: string
  location?: string
  tags?: string[]
}

export interface CalendarFeedOptions {
  category?: string
  tags?: string[]
  days?: number
  timezone?: string
}

export interface CalendarSubscription {
  category: string
  feedUrl: string
  webcalUrl: string
  httpsUrl: string
}

export type CalendarCategory = 
  | 'tech' 
  | 'gaming' 
  | 'popkultur' 
  | 'finanzen'
  | 'entertainment'
  | 'AI'
  | 'streaming'
  | 'e-sports'
  | 'alle'

export interface CalendarFeedResponse {
  success: boolean
  data?: string
  error?: string
  contentType: string
  headers: Record<string, string>
}

export interface CalendarAppInfo {
  name: string
  icon: string
  instructions: string[]
  platforms: ('ios' | 'android' | 'desktop' | 'web')[]
}