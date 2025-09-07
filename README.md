# Whenext - Multi Countdown App

A modern, SEO-friendly multi-countdown application built with Nuxt.js that tracks events across tech, gaming, and entertainment categories.

## Features

- **Real-time Countdowns**: Live updating countdown timers for multiple events
- **Category Filtering**: Filter events by Tech, Gaming, and Entertainment
- **Confidence Scoring**: Each event includes a reliability score
- **SEO Optimized**: Full Schema.org markup for Google Gemini searchability
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **FAQ Section**: Comprehensive explanation of how the app works

## Tech Stack

- **Framework**: Nuxt.js 4
- **Styling**: Tailwind CSS with custom components
- **Icons**: Heroicons via @nuxt/icon
- **Data**: JSON-based event storage
- **SEO**: Schema.org structured data

## Project Structure

```
whenext-app/
├── assets/css/main.css          # Custom styles
├── data/events.json            # Event data source
├── layouts/default.vue         # Main layout with navigation
├── pages/
│   ├── index.vue              # Homepage with countdowns
│   └── faq.vue                # FAQ page
├── public/
│   ├── robots.txt             # SEO robots file
│   └── sitemap.xml            # SEO sitemap
└── nuxt.config.ts             # Nuxt configuration
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Navigate to `http://localhost:3000`

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Generate static site**:
   ```bash
   npm run generate
   ```

## Demo Features

The app includes several sample countdown events to demonstrate the functionality:

- **Tech Events**: iPhone 16 Release, Tesla Model 2, SpaceX Mars Mission
- **Gaming Events**: GTA VI, Nintendo Switch 2, Cyberpunk 2077 Sequel  
- **Entertainment Events**: Stranger Things Season 5, Avengers: Secret Wars

Each event includes:
- Real-time countdown timers (days, hours, minutes, seconds)
- Confidence scoring (0-100%)
- Source attribution with links
- Category filtering
- Responsive design

## Data Structure

Events are stored in `data/events.json` following this schema:

```json
{
  "id": "unique-event-id",
  "title": "Event Name",
  "source": "Publication Name",
  "source_url": "https://source-url.com",
  "event_date_iso": "2024-07-15T17:00:00Z",
  "timezone": "UTC",
  "unix_timestamp": 1721062800,
  "confidence": 0.95,
  "notes": "Additional context",
  "category": "tech|gaming|entertainment",
  "icon": "icon-name",
  "description": "Event description"
}
```

## SEO Features

- **Schema.org Markup**: Full structured data for events and FAQ
- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **Sitemap**: XML sitemap for search engines
- **Robots.txt**: Proper crawling instructions
- **Semantic HTML**: Accessible and searchable markup

## Confidence Scoring

- **90-100%**: Official announcement with confirmed date
- **70-89%**: Strong indication from reliable source
- **50-69%**: Educated guess based on patterns
- **0-49%**: Speculation or very uncertain

## Development

The app uses Nuxt.js with the following modules:
- `@nuxt/ui` - UI components and Tailwind CSS
- `@nuxt/icon` - Icon system
- `@nuxt/content` - Content management
- `@nuxt/eslint` - Code linting

## Deployment

The app is ready for deployment on any platform that supports Node.js:
- Vercel
- Netlify
- AWS Amplify
- DigitalOcean App Platform

## License

MIT License - feel free to use this project as a starting point for your own countdown applications.