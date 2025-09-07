// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/icon',
    '@nuxt/eslint'
  ],
  
  devtools: { enabled: true },
  
  css: ['~/assets/css/main.css'],
  
  app: {
    head: {
      title: 'Whenext - Multi Countdown App',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.' },
        { name: 'keywords', content: 'countdown, events, tech, gaming, entertainment, release dates, announcements' },
        { name: 'author', content: 'Whenext' },
        
        // Open Graph
        { property: 'og:title', content: 'Whenext - Multi Countdown App' },
        { property: 'og:description', content: 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://whenext.app' },
        { property: 'og:image', content: 'https://whenext.app/og-image.png' },
        
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Whenext - Multi Countdown App' },
        { name: 'twitter:description', content: 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.' },
        { name: 'twitter:image', content: 'https://whenext.app/og-image.png' },
        
        // Additional SEO
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
        { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://whenext.app' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            'name': 'Whenext',
            'description': 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.',
            'url': 'https://whenext.app',
            'applicationCategory': 'Utility',
            'operatingSystem': 'All',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            }
          })
        }
      ]
    }
  },
  
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },
  
  // Runtime config for environment variables
  runtimeConfig: {
    public: {
      siteUrl: (typeof process !== 'undefined' ? process.env.NUXT_PUBLIC_SITE_URL : undefined) || 'https://whenext.app'
    }
  }
})
