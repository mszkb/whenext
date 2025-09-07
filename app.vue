<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// Global SEO and Schema.org setup
useHead({
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr'
  },
  meta: [
    // Basic meta tags
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' },
    
    // Theme and appearance
    { name: 'theme-color', content: '#2563eb' },
    { name: 'msapplication-TileColor', content: '#2563eb' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    
    // Additional SEO
    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'bingbot', content: 'index, follow' },
    
    // Social media
    { property: 'og:site_name', content: 'Whenext' },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:site', content: '@whenext' },
    { name: 'twitter:creator', content: '@whenext' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ],
  script: [
    // Global structured data
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://whenext.app/#website',
            'url': 'https://whenext.app/',
            'name': 'Whenext',
            'description': 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.',
            'inLanguage': 'en-US',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://whenext.app/?s={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'Organization',
            '@id': 'https://whenext.app/#organization',
            'name': 'Whenext',
            'url': 'https://whenext.app/',
            'description': 'Track upcoming events in tech, gaming, and entertainment with real-time countdowns and confidence scoring.',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://whenext.app/logo.png',
              'width': 512,
              'height': 512
            }
          }
        ]
      })
    }
  ]
})

// Set up global error handling
onErrorCaptured((error) => {
  console.error('Global error captured:', error)
  return false
})
</script>

<style>
/* Global styles are handled in assets/css/main.css */
</style>
